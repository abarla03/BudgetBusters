import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { auth } from "../../firebase";
import { signInWithGoogle } from "../../firebase";
import logo from "../../BBLogo.png";
import { useNavigate } from "react-router-dom";
import GoogleSignInButton from '../GoogleSignInButton';

const Register = (props) => {
    const navigate = useNavigate();
    const [name, setName ] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState(' ');
    const [age, setAge] = useState(' ');
    const [phoneNumber, setPhoneNumber] = useState(' ');
    const [displayMessage, setDisplayMessage] = useState(false);
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
                console.log(error);
            });
    };

    const showMessage = () => {
        setDisplayMessage(true);
    };

    /* populate register input fields with applicable Google account info */
    const populateGoogleUserData = () => {
        const googleUserData = JSON.parse(localStorage.getItem("googleUserData")) || {};
        setName(googleUserData.name);
        setEmail(googleUserData.email);
        setPhoneNumber(googleUserData.phoneNumber);
        /* add in other relevant fields */
    }

    /* call the appropriate method to populate fields */
    useEffect (() => {
        populateGoogleUserData();
    }, []);

    const registerSubmit = (e) => {
        // todo: sign in

        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential);
            })
            .catch((error) => {
                console.log(error);
            })
    }


    return (

        // Debug Register button (compare Sign Up)
        // changed type of name to 'text' instead of 'name' for better input handling

        // <input value={name} onChange={(e) => setName(e.target.value)}type="text" id="name" placeholder="Full Name" name="Full Name" />
        // put after label htmlFor
        <div className="auth-form-container">

            <form className="register-form" onSubmit={registerSubmit}>
                <h2>Register</h2>
                <label htmlFor="name">Full Name </label>

                <input value={googleUserData.name !== '' ? googleUserData.name : name} onChange={(e) => setName(e.target.value)}type="text" id="name" placeholder="Full Name" name="Full Name" />

                <label htmlFor="email">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="email@emailprovider.com" id="email" name="email" />

                <label htmlFor="password">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)}type="password" placeholder="enter password" id="password" name="password" />

                <button type="submit" onClick = { showMessage }>Register</button>

                {displayMessage && <p>You have successfully created an account.</p>}

            </form>
            <button className="link-btn" onClick={() => navigate('/login')}>Already have an account? Login here.</button>
            <GoogleSignInButton/>

        </div>
    )
}

// <button type="submit" onClick = { showMessage }>Register</button>

export default Register