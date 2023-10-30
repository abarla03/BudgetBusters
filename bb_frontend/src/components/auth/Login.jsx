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
    const [ loginSuccess, setLoginSuccess ] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const loginSubmit = (e) => {
        // todo: sign in
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential);
                // successful login
                // direct user to home page
                //history.push('/home');
                setLoginSuccess(true);
                navigate('/home');
            })
            .catch((error) => {
                console.log(error);
            })
    }

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

                <button type="submit">Log In</button>

            </form>
            <button className="link-btn" onClick={() => navigate('/register')}> Don't have an account? Register here.</button>
            <button className="link-btn" onClick = { handleResetPassword }>Reset Password</button>

            <GoogleSignInButton/>
        </div>
    )
}

export default Login