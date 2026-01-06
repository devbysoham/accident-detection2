// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBqg8GqkcY1XhA2l9y_qinQTbKFtefh5U",
  authDomain: "ai-based-accident-detection.firebaseapp.com",
  projectId: "ai-based-accident-detection",
  storageBucket: "ai-based-accident-detection.firebasestorage.app",
  messagingSenderId: "155552596068",
  appId: "1:155552596068:web:9a8f4afb2065237ed35f71",
  measurementId: "G-7D1QQ671HL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
