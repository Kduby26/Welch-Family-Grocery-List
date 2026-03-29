import {
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebase';

export async function signInWithGoogle(): Promise<User> {
  if (!auth || !googleProvider) throw new Error('Firebase not configured');
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOut(): Promise<void> {
  if (!auth) throw new Error('Firebase not configured');
  await fbSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
