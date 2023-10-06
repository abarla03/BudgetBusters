// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtV57Dv8_Sv3gFIxiQm9iK-uvtcZO-S8Y",
  authDomain: "budget-busters-db.firebaseapp.com",
  projectId: "budge t-busters-db",
  storageBucket: "budget-busters-db.appspot.com",
  messagingSenderId: "619297388407",
  appId: "1:619297388407:web:0a6e6a61e8f31bd09bd372"
}; 



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export const signInWithGoogle = () => {
  return new Promise((resolve, reject) => {
    signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result);
      const user = result.user;
      const userData = {
        name: user.displayName,
        email: user.email,
        phone: user.phoneNumber,
        profilePic: user.photoURL 
      };
      localStorage.setItem("googleUserData", JSON.stringify(userData));
      resolve();
  }).catch((error) => {
      console.log(error);
      reject(error);
  });
});
};

/* clear user data from browser localStorage when user signs out */
export const clearGoogleUserData = () => {
  localStorage.removeItem("googleUserData");
} 

