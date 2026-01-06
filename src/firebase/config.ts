// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfLDfT0wZS7JxgQL0_D-o_kQM3xBnPxH8",
  authDomain: "accident-detect-3.firebaseapp.com",
  projectId: "accident-detect-3",
  storageBucket: "accident-detect-3.firebasestorage.app",
  messagingSenderId: "804136463716",
  appId: "1:804136463716:web:972dfd67fdb9e9b8edde71",
  measurementId: "G-FQCY9GYB9W"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
