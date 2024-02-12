// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-kkms-k8kuI3w5Ffq6aVq3h4zSxidva8",
  authDomain: "wholesale-f4f40.firebaseapp.com",
  projectId: "wholesale-f4f40",
  storageBucket: "wholesale-f4f40.appspot.com",
  messagingSenderId: "692247150502",
  appId: "1:692247150502:web:3077a70969f92f58be5967",
  measurementId: "G-7NS580WEM4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);