import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../../firebase/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    let unsubProfile = null;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = null;
      }

      if (user) {
        unsubProfile = onSnapshot(doc(db, 'users', user.uid), (snap) => {
          if (snap.exists()) {
            setUserProfile({ id: snap.id, ...snap.data() });
          } else {
            setUserProfile({
              uid: user.uid,
              name: user.displayName || 'HelpHub Member',
              email: user.email,
              role: 'student',
              status: 'active',
            });
          }
          setLoading(false);
        });
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, isFirebaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
