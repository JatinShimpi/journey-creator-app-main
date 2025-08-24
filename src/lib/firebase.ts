import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration - replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyAS9tBnz67gO9VL2pCaYiNJtHuAU2_eqsY",
  authDomain: "journey-creator.firebaseapp.com",
  projectId: "journey-creator",
  storageBucket: "journey-creator.firebasestorage.app",
  messagingSenderId: "298753990484",
  appId: "1:298753990484:web:8bb72f07d0cabba8a672c1",
  // measurementId: "G-BE69ZRTDQ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;