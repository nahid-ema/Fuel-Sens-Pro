import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  signInAnonymously
} from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  getDocFromServer,
  getDocsFromServer,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyD70Y7BhZsAuJs-DowFTXvzucfFbCVDlrQ",
  authDomain: "fuel-flow0.firebaseapp.com",
  projectId: "fuel-flow0",
  storageBucket: "fuel-flow0.firebasestorage.app",
  messagingSenderId: "168176085455",
  appId: "1:168176085455:web:3cbb775d031963b9198aba",
  measurementId: "G-2YBCCECKSJ"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Initialize Analytics if supported in environment
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

// Initialize Firestore with persistent IndexedDB local cache
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
  });
} catch {
  firestoreDb = getFirestore(app);
}

export const db = firestoreDb;

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  signInAnonymously,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  getDocFromServer,
  getDocsFromServer,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp
};
export type { FirebaseUser };
