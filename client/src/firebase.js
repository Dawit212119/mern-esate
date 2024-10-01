// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-cd1fa.firebaseapp.com",
  projectId: "mern-estate-cd1fa",
  storageBucket: "mern-estate-cd1fa.appspot.com",
  messagingSenderId: "647241440095",
  appId: "1:647241440095:web:d63a0454ddf14985bab4ea",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
