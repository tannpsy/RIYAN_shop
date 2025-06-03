// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyug0zvsGKeYZ3SsyH09Cwvf1GGLPk160",
  authDomain: "riya-shop.firebaseapp.com",
  projectId: "riya-shop",
  storageBucket: "riya-shop.firebasestorage.app",
  messagingSenderId: "719995535008",
  appId: "1:719995535008:web:b3faf11617665d445993c5",
  measurementId: "G-LCF3Y1RR01"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, createUserWithEmailAndPassword, updateProfile, setDoc, doc };