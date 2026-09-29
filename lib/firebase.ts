// Next.js-ready Firebase client initialization
// Uses NEXT_PUBLIC_* environment variables (Phase 1 confirmed these are browser-safe)
// This file is the Next.js replacement for src/lib/firebase.ts (hardcoded config)
// src/lib/firebase.ts is left unchanged until Phase 3 updates all import paths.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Custom Firestore database ID confirmed in Phase 1
// (ai-studio-peshawaronsitete-70e75457-6a23-4284-84ee-9bd0ef9c4555)
const databaseId = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID;

let firestoreInstance;
try {
  firestoreInstance = databaseId
    ? getFirestore(app, databaseId)
    : getFirestore(app);
} catch (e) {
  console.warn('[Firebase] Falling back to default Firestore database:', e);
  firestoreInstance = getFirestore(app);
}

export const db = firestoreInstance;
export const auth = getAuth(app);
