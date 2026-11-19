import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export async function createNotification({ userId, type, title, message, link = '/dashboard/notifications' }) {
  if (!userId) return;
  await addDoc(collection(db, 'notifications'), {
    userId,
    type,
    title,
    message,
    link,
    read: false,
    createdAt: serverTimestamp(),
  });
}

export function subscribeUserNotifications(userId, callback) {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

export async function markNotificationRead(notificationId) {
  await updateDoc(doc(db, 'notifications', notificationId), { read: true });
}

export async function markAllNotificationsRead(notifications) {
  const unread = notifications.filter((n) => !n.read);
  if (unread.length === 0) return;
  const batch = writeBatch(db);
  unread.forEach((n) => {
    batch.update(doc(db, 'notifications', n.id), { read: true });
  });
  await batch.commit();
}
