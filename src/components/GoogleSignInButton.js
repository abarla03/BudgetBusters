import React from 'react';
import { signInWithGoogle } from '../firebase';
import { useNavigate } from 'react-router-dom';

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
    <button onClick={handleSignIn}>
      Sign In With Google 2
    </button>
  );
};

export default GoogleSignInButton;
