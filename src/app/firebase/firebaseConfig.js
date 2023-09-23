// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'bakery-434c0.firebaseapp.com',
  projectId: 'bakery-434c0',
  storageBucket: 'bakery-434c0.appspot.com',
  messagingSenderId: '289170495122',
  appId: '1:289170495122:web:f0b390461c25223041784b',
  measurementId: 'G-B3JJH6BLBW'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);