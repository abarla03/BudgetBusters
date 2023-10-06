import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import { auth } from "../../firebase";
import logo from "../../BBLogo.png";
import { signInWithGoogle } from "../../firebase";
//import { withRouter } from 'react-router-dom';
//import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import GoogleSignInButton from '../GoogleSignInButton';
// 10.6 day changes

const Login = () => {
    //const history = useHistory();
    const Navigate = useNavigate();
    const [email, setEmail ] = useState('');
    const [password, setPassword] = useState('');
    const [ loginSuccess, setLoginSuccess ] = useState(false);

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
                //navigate('/home');
            })
            .catch((error) => {
            console.log(error);
        })
    }

    // if (loginSuccess) {
    //     return <Navigate to="/home" />;
    // }

    if (loginSuccess) {
        Navigate('/home');
      }

    
  return (

    <div className="auth-form-container">
        <img src={logo} alt = ''/>
        <h2>Login</h2>
    <form className="login-form" onSubmit={loginSubmit}>
        <label htmlFor="email">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="email@emailprovider.com" id="email" name="email" />

        <label htmlFor="password">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)}type="password" placeholder="enter password" id="password" name="password" />

        <button type="submit">Log In</button>
    </form>
    <button className="link-btn" onClick={() => Navigate('/register')}> Don't have an account? Register here.</button>
    
    <GoogleSignInButton/>
    </div>

//<button className="sign-in-with-google-btn" onClick = {signInWithGoogle}>Sign In With Google</button> 


/*
    <div className='sign-in-container'>
        <form onSubmit={signIn}>
            <h1>Log In to Account</h1>
            <input 
                type="email" 
                placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
            ></input>
            <input 
                type="password" 
                placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
            ></input>
            <button type="submit">Log In</button>
        </form>
    </div>
*/

  )
}

export default Login