import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { uploadAvatar } from './fileStorageService';

export async function registerUser({ name, email, password, role, location = '', bio = '' }) {
  // Enforce strict public role whitelist
  const safeRole = role === 'community_member' ? 'community_member' : 'student';

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });

  const userProfile = {
    uid: credential.user.uid,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role: safeRole,
    status: 'active',
    location: location.trim(),
    bio: bio.trim(),
    photoURL: '',
    uploadedCount: 0,
    downloadsCount: 0,
    completedRentalsCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'users', credential.user.uid), userProfile);
  return userProfile;
}

export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const snap = await getDoc(doc(db, 'users', credential.user.uid));
  if (snap.exists() && snap.data().status === 'deactivated') {
    await signOut(auth);
    throw new Error('Your account has been deactivated by an administrator.');
  }
  return credential.user;
}

export async function resetUserPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

export async function logoutUser() {
  await signOut(auth);
}

export async function updateUserProfileData(uid, updates, avatarFile = null) {
  let photoURL = updates.photoURL || '';
  if (avatarFile) {
    photoURL = await uploadAvatar(uid, avatarFile);
  }

  const cleanUpdates = {
    name: updates.name.trim(),
    location: updates.location.trim(),
    bio: updates.bio.trim(),
    photoURL,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(doc(db, 'users', uid), cleanUpdates);
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, {
      displayName: cleanUpdates.name,
      photoURL: photoURL || null,
    });
  }
  return cleanUpdates;
}
