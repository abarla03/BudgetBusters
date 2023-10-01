// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQWnf1tw2KR3jZa-wcisYq3GC7oHX9meo",
  authDomain: "auth-practice-51fe0.firebaseapp.com",
  projectId: "auth-practice-51fe0",
  storageBucket: "auth-practice-51fe0.appspot.com",
  messagingSenderId: "822077407630",
  appId: "1:822077407630:web:956275c10ca5ce3e7e64df"
};

// Initialize Firebase - represents our Firebase connection
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

// export const signInWithGoogle = () =>  signInWithPopup(auth, provider);
// refer back to video on how to reorganize this when used multiple times

export const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
        console.log(result);
        // result object contains a lot of info about the user:
        // email, display name, photoURL
        const name = result.user.displayName;
        const email = result.user.email;
        const profilePic = result.user.photoURL;
        //const phone = result.user.phone;

        // local storage: browser remembers who's logged in
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        localStorage.setItem("profilePic", profilePic);
        //localStorage.setItem("phone", phone);

    }).catch((error) => {
        console.log(error);
    });
}