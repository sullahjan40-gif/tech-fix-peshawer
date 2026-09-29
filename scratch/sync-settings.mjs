import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import fs from 'fs';

const envText = fs.readFileSync('.env', 'utf-8');
const env = {};
envText.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      env[key] = val;
    }
  }
});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyAG6kKK0MH4-XtKfSgnY2IQcavdMJk6uoA",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "gen-lang-client-0759593306.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0759593306",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "gen-lang-client-0759593306.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "928616012414",
  appId: env.VITE_FIREBASE_APP_ID || "1:928616012414:web:fac720e8fce7562f4b962f"
};
const databaseId = env.VITE_FIREBASE_DATABASE_ID || "ai-studio-peshawaronsitete-70e75457-6a23-4284-84ee-9bd0ef9c4555";

const app = initializeApp(firebaseConfig, 'test-sync');
const db = getFirestore(app, databaseId);

async function main() {
  const ref = doc(db, 'settings', 'admin');
  const snap = await getDoc(ref);
  console.log('Current Firestore settings/admin phoneNumber:', snap.exists() ? snap.data().phoneNumber : 'not exists');
  
  await setDoc(ref, {
    phoneNumber: '+92 327 5526107',
    whatsappNumber: '+92 327 5526107'
  }, { merge: true });

  const updatedSnap = await getDoc(ref);
  console.log('Verified Firestore settings/admin phoneNumber:', updatedSnap.data().phoneNumber);
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
