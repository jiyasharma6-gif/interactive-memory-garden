import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInAnonymously, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  linkWithPopup
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAnonymous: boolean;
  effectiveId: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      } else {
        // Automatically sign in anonymously if no user is present
        try {
          const cred = await signInAnonymously(auth);
          setUser(cred.user);
        } catch (error: any) {
          if (error.code === 'auth/admin-restricted-operation') {
            // This is expected if Anonymous Auth is not enabled in the Firebase Console.
            // We use local storage as a fallback for guest users.
          } else {
            console.error("Authentication failed:", error.message);
          }
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getGuestId = () => {
    let gid = localStorage.getItem('memory_garden_guest_id');
    if (!gid) {
      gid = 'guest_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('memory_garden_guest_id', gid);
    }
    return gid;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      if (user?.isAnonymous) {
        await linkWithPopup(user, provider);
      } else {
        await signInWithPopup(auth, provider);
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      loginWithGoogle, 
      logout,
      isAnonymous: user?.isAnonymous || !user,
      effectiveId: user?.uid || getGuestId()
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
