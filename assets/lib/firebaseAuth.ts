// lib/firebaseAuth.ts

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { auth } from "./firebase";

// ✅ SIGNUP
export const signup = async (email: string, password: string, name: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// ✅ LOGIN
export const login = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// ✅ LOGOUT
export const logout = async () => {
  return await signOut(auth);
};

// ✅ CHECK SESSION
const getCurrentSession = () => {
  return new Promise<boolean>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
};

// ✅ IMPORTANT: DEFAULT EXPORT
export default getCurrentSession;