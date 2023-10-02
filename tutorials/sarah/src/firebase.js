// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-th5f8b3zw-HZIF5-Fy2j4VV7robYwpo",
  authDomain: "react-auth-tutorial-86028.firebaseapp.com",
  projectId: "react-auth-tutorial-86028",
  storageBucket: "react-auth-tutorial-86028.appspot.com",
  messagingSenderId: "393442867360",
  appId: "1:393442867360:web:e10ca890bc6c21a12e31c5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
