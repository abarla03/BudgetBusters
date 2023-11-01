import React from 'react';
import { signInWithGoogle } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../App.css'

const GoogleSignUpButton = () => {

    const navigate = useNavigate();

    const handleSignIn = async () => {
        try {
            await signInWithGoogle();
            // Redirect to '/home' after successful sign-in


            // should we immediately navigate to login
            // should we wait to display a message then navigate to login - yee
            //const delayInMS = 2000;
            // setTimeout(() => {
            //     console.log("Success! You were able to sign up using Google!")
            //     console.log("navigate after a few seconds to display success message");
            //     navigate('/login');
            // }, delayInMS);
            // should we not navigate anywhere, and just let the user press login?
            navigate('/home');
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    };

    return (
        <button className = "google-auth-btn" onClick={handleSignIn}>
            Sign up with Google
        </button>
    );
};



export default GoogleSignUpButton;