// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtV57Dv8_Sv3gFIxiQm9iK-uvtcZO-S8Y",
  authDomain: "budget-busters-db.firebaseapp.com",
  projectId: "budget-busters-db",
  storageBucket: "budget-busters-db.appspot.com",
  messagingSenderId: "619297388407",
  appId: "1:619297388407:web:0a6e6a61e8f31bd09bd372"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

