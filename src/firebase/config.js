import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD30LSvbx2NCWulfLira3hD7cd6TxVjc4o",
  authDomain: "muse-352ba.firebaseapp.com",
  projectId: "muse-352ba",
  storageBucket: "muse-352ba.appspot.com",
  messagingSenderId: "125120459010",
  appId: "1:125120459010:web:1c94b8e4f62c323ddc521b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
