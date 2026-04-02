// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "medical-e-commerce-5998a.firebaseapp.com",
  projectId: "medical-e-commerce-5998a",
  storageBucket: "medical-e-commerce-5998a.firebasestorage.app",
  messagingSenderId: "533710484392",
  appId: "1:533710484392:web:f1732a31e9278d8e8de39d",
  measurementId: "G-F91D3L6ZFH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage=getStorage(app);