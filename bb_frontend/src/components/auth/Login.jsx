import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import { auth } from "../../firebase";
import logo from "../../BBLogo.png";
import { signInWithGoogle } from "../../firebase";
//import { withRouter } from 'react-router-dom';
//import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import GoogleSignInButton from '../GoogleSignInButton';
import { resetPassword } from "../../firebase";

const Login = (props) => {
    //const history = useHistory();
    const navigate = useNavigate();
    const [email, setEmail ] = useState('');
    const [password, setPassword] = useState('');
    const [displayMessage, setDisplayMessage ] = useState('');
    const [isSent, setIsSent] = useState(false);

    const loginSubmit = (e) => {
        // todo: sign in
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential);
                //const successMessage = "You have successfully logged in!";
                //showMessage(successMessage);
                // maybe show a success message on home, like 'successfully logged in as ''

                // successful login
                // direct user to home page
                navigate('/home');
            })
            .catch((error) => {
                console.log(`showing the error: ${error}`);
                showMessage(error);
            })
    }

    /* function to display appropriate UI messages based on user input */
    const showMessage = (error) => {
        if (error && error.message) {
            // handle firebase errors
            const match = error.message.match(/\(([^)]+)\)/);

            switch (error.message.match(/\(([^)]+)\)/)[1]) {
                // diff firebase errors:
                case 'auth/invalid-email':
                    setDisplayMessage("Please enter a valid email!");
                    break;

                case 'auth/invalid-login-credentials':
                    setDisplayMessage("Please enter the correct credentials");
                    break;

                // case 'auth/missing-email':
                //     break;

                case 'auth/missing-password':
                    setDisplayMessage("Please enter your password!");
                    break;

                default:
                    setDisplayMessage("An error occurred. Please try again.");
            }
        } else {
            // non-firebase errors/message
            setDisplayMessage("An error occurred. Please try again.");
            // successful login
            // if (error === "You have successfully logged in!") {
            //     setDisplayMessage(error);
            // } else {
            //     setDisplayMessage("An error occurred. Please try again.");
            // }
        }
    };


    const handleResetPassword = () => {
        console.log("clicked on reset password link");
        //console.log("here's the email: " + email);
        resetPassword(email)
            // console.log("here's the email: " + email);
            .then(() => {
                console.log("here's the email: " + email);
                setIsSent(true);
            })
            .catch((error) => {
                // Handle error, e.g., display an error message to the user
            });
    };

    return (

        <div className="auth-form-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={loginSubmit}>
                <label htmlFor="email">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="email@emailprovider.com" id="email" name="email" />

                <label htmlFor="password">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)}type="password" placeholder="enter password" id="password" name="password" />

                <button type="submit" onClick={loginSubmit}>Log In</button>

                {<p>{displayMessage}</p>}
            </form>
            <button className="link-btn" onClick={() => navigate('/register')}> Don't have an account? Register here.</button>
            <button className="link-btn" onClick = { handleResetPassword }>Reset Password</button>

            <GoogleSignInButton/>
        </div>
    )
}

export default Login