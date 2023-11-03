import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { auth } from "../../firebase";
import { signInWithGoogle } from "../../firebase";
import logo from "../../BBLogo.png";
import { useNavigate } from "react-router-dom";
import GoogleSignInButton from '../GoogleSignInButton';
import GoogleSignUpButton from "../GoogleSignUpButton";
import * as currentUser from "firebase/auth";
const Register = (props) => {
    const navigate = useNavigate();
    const [name, setName ] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState(' ');
    const [age, setAge] = useState(' ');
    const [phoneNumber, setPhoneNumber] = useState(' ');
    const [displayMessage, setDisplayMessage] = useState('');
    //const [nameError, setNameError] = useState(null);
    const [googleUserData, setGoogleUserData] = useState({
        name: '',
        email: '',
        phoneNumber: ''
    })

    const signInWithGoogleHandler = () => {
        signInWithGoogle()
            .then(() => {
                // After successful sign-in with Google, navigate to the '/home' route
                //navigate('/home');

            })
            .catch((error) => {
                // implement UI message logic here too!
                console.log(error);
            });
    };

    const showMessage = (error) => {


        if (error && error.message) {
            // handle firebase errors
            //setDisplayMessage(true);
            const match = error.message.match(/\(([^)]+)\)/);
            //const errorCode = match ? match[1] : null;

            switch (error.message.match(/\(([^)]+)\)/)[1]) {
                // diff firebase errors:
                case 'auth/missing-password':
                    setDisplayMessage("Please enter your password!");
                    break;

                case 'auth/missing-email':
                    setDisplayMessage("Please enter your email!");
                    break;

                case 'Please enter your name!': // missing name field
                    setDisplayMessage("Please enter your name!");
                    break;

                case 'auth/email-already-in-use':
                    setDisplayMessage("You already have an account associated with this email, please log in!");
                    break;

                case 'auth/weak-password':
                    setDisplayMessage("Password is too weak. Must be at least 6 characters.");
                    break;

                default:
                    setDisplayMessage("An error occurred. Please try again.");
            }
        } else {
            // non-firebase errors/messages
            // check for success message:
            if (error === "You have successfully created an account!") {
                setDisplayMessage(error);
            } else if (error === "Please enter your name!" ) {
                setDisplayMessage(error);
            } else {
                setDisplayMessage("An error occurred. Please try again.");
            }
        }
    };

    /* DON'T NEED THIS ANYMORE - populate register input fields with applicable Google account info */
    // const populateGoogleUserData = () => {
    //     // fix current population bug
    //     const googleUserData = JSON.parse(localStorage.getItem("googleUserData")) || {};
    //     setName(googleUserData.name);
    //     setEmail(googleUserData.email);
    //     setPhoneNumber(googleUserData.phoneNumber);
    //     /* add in other relevant fields */
    // }

    // /* call the appropriate method to populate fields */
    // useEffect (() => {
    //     populateGoogleUserData();
    // }, []);

    /* send confirmation email */
    const registerSubmit = (e) => {
        // todo: sign in

        e.preventDefault();

        if (name.length < 1) {
            console.log("no name!");
            const nameError = "Please enter your name!";
            showMessage(nameError);
            return;
        }

            // e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)

            .then((userCredential) => {
                console.log(userCredential);
                //console.log('no actual error'); // THIS IS WHERE SUCCESSFUL LOGIN MESSAGE GOES
                const successMessage = "You have successfully created an account!";
                console.log(successMessage);
                window.alert("You have successfully created an account!");
                navigate('/login')
                //showMessage(successMessage);
                //showMessage("You have successfully created an account!");
            })
            .catch((error) => {
                console.log(`showing the firebase error ${error}`);
                showMessage(error);
            })
    }


    return (
        <div className="auth-form-container">

            <form className="register-form" onSubmit={registerSubmit}>
                <h2>Register</h2>
                <label htmlFor="name">Full Name </label>

                <input value={googleUserData.name !== '' ? googleUserData.name : name} onChange={(e) => setName(e.target.value)}type="text" id="name" placeholder="Full Name" name="Full Name" />

                <label htmlFor="email">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="email@emailprovider.com" id="email" name="email" />

                <label htmlFor="password">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)}type="password" placeholder="enter password" id="password" name="password" />

                {/* incorporate logic for success/error messages in handle click/ showMessage method?*/}
                <button type="submit" onClick = { registerSubmit }>Register</button>

                {<p>{displayMessage}</p>}

            </form>
            <button className="link-btn" onClick={() => navigate('/login')}>Already have an account? Login here.</button>
            <GoogleSignUpButton/>

        </div>
    )
}

export default Register
