import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export function subscribeAllCollection(collectionName, callback) {
  const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    () => {
      // Fallback if some legacy docs omit createdAt
      onSnapshot(collection(db, collectionName), (fallbackSnap) => {
        callback(fallbackSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      });
    }
  );
}

export async function setUserAccountStatus(userId, status) {
  await updateDoc(doc(db, 'users', userId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function moderateResourceListing(resourceId, moderationStatus) {
  await updateDoc(doc(db, 'resources', resourceId), {
    moderationStatus,
    updatedAt: serverTimestamp(),
  });
}

export async function removeResourceAsAdmin(resourceId) {
  await deleteDoc(doc(db, 'resources', resourceId));
}

export async function submitReport({ targetType, targetId, targetTitle, reason, reporter }) {
  await addDoc(collection(db, 'reports'), {
    targetType,
    targetId,
    targetTitle,
    reason: reason.trim(),
    reporterId: reporter.uid,
    reporterName: reporter.name,
    status: 'Open',
    createdAt: serverTimestamp(),
  });
}

export async function resolveReport(reportId, status = 'Resolved') {
  await updateDoc(doc(db, 'reports', reportId), {
    status,
    resolvedAt: serverTimestamp(),
  });
}
