import React from 'react';
import { signInWithGoogle } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../App.css'

const GoogleSignInButton = () => {
 
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Redirect to '/home' after successful sign-in
      navigate('/home');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <button classname = "google-sign-in-2-btn" onClick={handleSignIn}>
      Sign In with Google
    </button>
  );
};



export default GoogleSignInButton;
