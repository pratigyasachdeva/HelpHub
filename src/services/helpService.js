import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { createNotification } from './notificationService';

export function subscribeHelpRequests(callback) {
  const q = query(collection(db, 'helpRequests'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function subscribeHelpOffers(callback) {
  const q = query(collection(db, 'helpOffers'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function createHelpRequest({ title, subject, category, description, urgency }, user) {
  await addDoc(collection(db, 'helpRequests'), {
    title: title.trim(),
    subject: subject.trim(),
    category,
    description: description.trim(),
    urgency: urgency || 'Normal',
    authorId: user.uid,
    authorName: user.name,
    status: 'Pending',
    acceptedOfferId: '',
    acceptedHelperId: '',
    acceptedHelperName: '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function submitHelpOffer({ request, helper, message }) {
  if (request.authorId === helper.uid) {
    throw new Error('You cannot offer help on your own request.');
  }
  await addDoc(collection(db, 'helpOffers'), {
    requestId: request.id,
    requestTitle: request.title,
    requestAuthorId: request.authorId,
    helperId: helper.uid,
    helperName: helper.name,
    message: message.trim(),
    status: 'Pending',
    createdAt: serverTimestamp(),
  });

  await createNotification({
    userId: request.authorId,
    type: 'help_offer',
    title: 'New Help Offer Received',
    message: `${helper.name} offered assistance on "${request.title}".`,
    link: '/dashboard/help',
  });
}

export async function respondToHelpOffer({ request, offer, decision }) {
  await updateDoc(doc(db, 'helpOffers', offer.id), {
    status: decision,
  });

  if (decision === 'Accepted') {
    await updateDoc(doc(db, 'helpRequests', request.id), {
      status: 'Accepted',
      acceptedOfferId: offer.id,
      acceptedHelperId: offer.helperId,
      acceptedHelperName: offer.helperName,
      updatedAt: serverTimestamp(),
    });
  }

  await createNotification({
    userId: offer.helperId,
    type: 'help_status',
    title: `Help Offer ${decision}`,
    message: `${request.authorName} ${decision.toLowerCase()} your offer for "${request.title}".`,
    link: '/dashboard/help',
  });
}

export async function markHelpRequestCompleted(request) {
  await updateDoc(doc(db, 'helpRequests', request.id), {
    status: 'Completed',
    updatedAt: serverTimestamp(),
  });

  if (request.acceptedHelperId) {
    await createNotification({
      userId: request.acceptedHelperId,
      type: 'help_completed',
      title: 'Help Session Completed',
      message: `"${request.title}" was marked as Completed by ${request.authorName}.`,
      link: '/dashboard/help',
    });
  }
}
