import {
  collection,
  doc,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  runTransaction,
  increment,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { removeResourcePdf, uploadResourcePdf } from './fileStorageService';

export function subscribeApprovedResources(callback) {
  const q = query(
    collection(db, 'resources'),
    where('moderationStatus', '==', 'approved'),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function subscribeUserResources(ownerId, callback) {
  const q = query(
    collection(db, 'resources'),
    where('ownerId', '==', ownerId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function createResource(payload, pdfFile, currentUser) {
  let filePath = '';
  let fileName = '';
  let fileSizeBytes = 0;

  if (payload.hasSoftCopy && pdfFile) {
    if (pdfFile.type !== 'application/pdf') {
      throw new Error('Only PDF files are supported for digital notes.');
    }
    if (pdfFile.size > 25 * 1024 * 1024) {
      throw new Error('PDF size must be under 25 MB.');
    }
    filePath = await uploadResourcePdf(currentUser.uid, pdfFile);
    fileName = pdfFile.name;
    fileSizeBytes = pdfFile.size;
  }

  const dailyRate = payload.hasHardCopy ? Number(payload.dailyRate) : 0;
  if (payload.hasHardCopy && (dailyRate < 3 || dailyRate > 10)) {
    throw new Error('Daily rental rate must be between ₹3 and ₹10.');
  }

  const docRef = await addDoc(collection(db, 'resources'), {
    title: payload.title.trim(),
    subject: payload.subject.trim(),
    category: payload.category,
    description: payload.description.trim(),
    keywords: payload.keywords
      .split(',')
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean),
    pageCount: Number(payload.pageCount),
    hasSoftCopy: Boolean(payload.hasSoftCopy),
    hasHardCopy: Boolean(payload.hasHardCopy),
    filePath,
    fileName,
    fileSizeBytes,
    isAvailableForRent: Boolean(payload.hasHardCopy && payload.isAvailableForRent),
    condition: payload.hasHardCopy ? payload.condition : '',
    dailyRate,
    ownerId: currentUser.uid,
    ownerName: currentUser.name,
    ownerRole: currentUser.role,
    moderationStatus: 'approved',
    totalDownloads: 0,
    uniqueDownloadersCount: 0,
    viewsCount: 0,
    viewedByUsers: [],
    interestedUsers: [],
    rentalRequestsCount: 0,
    completedRentalsCount: 0,
    avgRating: 0,
    reviewCount: 0,
    helpfulPercentage: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await updateDoc(doc(db, 'users', currentUser.uid), {
    uploadedCount: increment(1),
  });

  return docRef.id;
}

export async function recordUniqueResourceView(resourceId, userId) {
  if (!resourceId || !userId) return;
  const resourceRef = doc(db, 'resources', resourceId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(resourceRef);
    if (!snap.exists()) return;
    const data = snap.data();
    const viewed = data.viewedByUsers || [];
    if (!viewed.includes(userId) && data.ownerId !== userId) {
      tx.update(resourceRef, {
        viewedByUsers: arrayUnion(userId),
        viewsCount: increment(1),
      });
    }
  });
}

export async function recordPdfDownload(resource, userId) {
  const downloadId = `${resource.id}_${userId}`;
  const downloadRef = doc(db, 'downloads', downloadId);
  const resourceRef = doc(db, 'resources', resource.id);
  const userRef = doc(db, 'users', userId);

  await runTransaction(db, async (tx) => {
    const dlSnap = await tx.get(downloadRef);
    const isFirstTime = !dlSnap.exists();

    if (isFirstTime) {
      tx.set(downloadRef, {
        resourceId: resource.id,
        resourceTitle: resource.title,
        subject: resource.subject,
        category: resource.category,
        filePath: resource.filePath || '',
        userId,
        downloadCount: 1,
        firstDownloadedAt: serverTimestamp(),
        lastDownloadedAt: serverTimestamp(),
      });
      tx.update(resourceRef, {
        totalDownloads: increment(1),
        uniqueDownloadersCount: increment(1),
      });
      tx.update(userRef, {
        downloadsCount: increment(1),
      });
    } else {
      tx.update(downloadRef, {
        downloadCount: increment(1),
        lastDownloadedAt: serverTimestamp(),
      });
      tx.update(resourceRef, {
        totalDownloads: increment(1),
      });
    }
  });
}

export async function hasUserDownloadedResource(resourceId, userId) {
  if (!userId) return false;
  const snap = await getDoc(doc(db, 'downloads', `${resourceId}_${userId}`));
  return snap.exists();
}

export async function submitVerifiedReview({
  targetType,
  targetId,
  reviewerId,
  reviewerName,
  rating,
  helpful,
  comment,
  resourceIdForAggregate,
}) {
  const reviewId = `${targetType}_${targetId}_${reviewerId}`;
  const reviewRef = doc(db, 'reviews', reviewId);
  const existing = await getDoc(reviewRef);
  if (existing.exists()) {
    throw new Error('You have already submitted a review for this transaction.');
  }

  await setDoc(reviewRef, {
    targetType,
    targetId,
    resourceId: resourceIdForAggregate || targetId,
    reviewerId,
    reviewerName,
    rating: Number(rating),
    helpful: Boolean(helpful),
    comment: comment.trim(),
    createdAt: serverTimestamp(),
  });

  if (resourceIdForAggregate) {
    const resRef = doc(db, 'resources', resourceIdForAggregate);
    await runTransaction(db, async (tx) => {
      const resSnap = await tx.get(resRef);
      if (!resSnap.exists()) return;
      const d = resSnap.data();
      const oldCount = d.reviewCount || 0;
      const newCount = oldCount + 1;
      const newAvg = Number((((d.avgRating || 0) * oldCount + Number(rating)) / newCount).toFixed(2));
      const oldHelpfulTotal = Math.round(((d.helpfulPercentage || 0) / 100) * oldCount);
      const newHelpfulPct = Math.round(((oldHelpfulTotal + (helpful ? 1 : 0)) / newCount) * 100);
      tx.update(resRef, {
        reviewCount: newCount,
        avgRating: newAvg,
        helpfulPercentage: newHelpfulPct,
      });
    });
  }
}

export async function toggleHardCopyAvailability(resourceId, isAvailableForRent) {
  await updateDoc(doc(db, 'resources', resourceId), {
    isAvailableForRent: Boolean(isAvailableForRent),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteUserResource(resourceId) {
  const resourceRef = doc(db, 'resources', resourceId);
  const snap = await getDoc(resourceRef);
  if (!snap.exists()) return;
  const resource = snap.data();
  if (resource.filePath) await removeResourcePdf(resource.filePath);
  await deleteDoc(resourceRef);
}
