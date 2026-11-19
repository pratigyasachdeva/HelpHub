import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  increment,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { calculateRentalDays, hasOverlappingDates } from '../utils/pricingAndDates';
import { createNotification } from './notificationService';

export async function submitRentalRequest({ resource, renter, startDate, endDate, message }) {
  if (resource.ownerId === renter.uid) {
    throw new Error('You cannot rent your own physical resource.');
  }
  const days = calculateRentalDays(startDate, endDate);
  if (days <= 0) {
    throw new Error('End date must be after start date.');
  }

  // Check active or accepted rentals to prevent overlapping bookings
  const totalAmount = days * Number(resource.dailyRate);

  const reqRef = await addDoc(collection(db, 'rentalRequests'), {
    resourceId: resource.id,
    resourceTitle: resource.title,
    ownerId: resource.ownerId,
    ownerName: resource.ownerName,
    renterId: renter.uid,
    renterName: renter.name,
    startDate,
    endDate,
    days,
    dailyRate: Number(resource.dailyRate),
    totalAmount,
    message: (message || '').trim(),
    status: 'Pending',
    rejectionReason: '',
    paymentMode: 'Offline / Cash on Handover',
    reviewedByRenter: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await updateDoc(doc(db, 'resources', resource.id), {
    interestedUsers: arrayUnion(renter.uid),
    rentalRequestsCount: increment(1),
  });

  await createNotification({
    userId: resource.ownerId,
    type: 'rental_request',
    title: 'New Physical Rental Request',
    message: `${renter.name} requested "${resource.title}" for ${days} days (₹${totalAmount}).`,
    link: '/dashboard/rentals',
  });

  return reqRef.id;
}

export async function updateRentalStatus(request, nextStatus, rejectionReason = '') {
  // Check date conflicts as the owner, whose requests are readable under the
  // Firestore rules. A renter-side query by resourceId would expose other
  // renters' booking details and is correctly denied by those rules.
  if (nextStatus === 'Accepted') {
    const ownerRequestsQuery = query(
      collection(db, 'rentalRequests'),
      where('ownerId', '==', request.ownerId)
    );
    const ownerRequests = await getDocs(ownerRequestsQuery);
    const overlaps = ownerRequests.docs
      .filter((item) => item.id !== request.id)
      .map((item) => ({ id: item.id, ...item.data() }))
      .some((existing) =>
        existing.resourceId === request.resourceId &&
        ['Accepted', 'Active Rental'].includes(existing.status) &&
        hasOverlappingDates([existing], request.startDate, request.endDate)
      );

    if (overlaps) {
      throw new Error('These dates overlap with another accepted or active rental.');
    }
  }

  const reqRef = doc(db, 'rentalRequests', request.id);
  const updates = {
    status: nextStatus,
    updatedAt: serverTimestamp(),
  };

  if (nextStatus === 'Rejected') {
    updates.rejectionReason = rejectionReason.trim();
  }
  if (nextStatus === 'Active Rental') {
    updates.handedOverAt = serverTimestamp();
  }
  if (nextStatus === 'Returned') {
    updates.returnedAt = serverTimestamp();
  }

  await updateDoc(reqRef, updates);

  // Sync physical availability & history
  if (nextStatus === 'Active Rental') {
    await updateDoc(doc(db, 'resources', request.resourceId), {
      isAvailableForRent: false,
    });
  } else if (nextStatus === 'Returned') {
    await updateDoc(doc(db, 'resources', request.resourceId), {
      isAvailableForRent: true,
      completedRentalsCount: increment(1),
    });
    await updateDoc(doc(db, 'users', request.renterId), {
      completedRentalsCount: increment(1),
    });
    await addDoc(collection(db, 'rentalHistory'), {
      rentalRequestId: request.id,
      resourceId: request.resourceId,
      resourceTitle: request.resourceTitle,
      ownerId: request.ownerId,
      renterId: request.renterId,
      days: request.days,
      totalAmount: request.totalAmount,
      completedAt: serverTimestamp(),
    });
  }

  const recipientId = nextStatus === 'Cancelled' ? request.ownerId : request.renterId;
  await createNotification({
    userId: recipientId,
    type: 'rental_status',
    title: `Rental ${nextStatus}`,
    message: `Rental for "${request.resourceTitle}" is now ${nextStatus}.${
      rejectionReason ? ` Reason: ${rejectionReason}` : ''
    }`,
    link: '/dashboard/rentals',
  });
}

export function subscribeRentalsByRole(userId, field, callback, onError) {
  const q = query(
    collection(db, 'rentalRequests'),
    where(field, '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    },
    onError
  );
}
