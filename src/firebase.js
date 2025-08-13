import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAwGjW2qHwHcm6I1ZPQHA5q6X8RVva8mws",
  authDomain: "edumasr-f37d8.firebaseapp.com",
  projectId: "edumasr-f37d8",
  storageBucket: "edumasr-f37d8.firebasestorage.app",
  messagingSenderId: "905519114217",
  appId: "1:905519114217:web:2c8ce8500695493c538d78"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const rtdb = getDatabase(app);