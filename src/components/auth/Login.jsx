import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import { auth } from "../../firebase";
import logo from "../../BBLogo.png";


const Login = (props) => {
    const [email, setEmail ] = useState('');
    const [password, setPassword] = useState('');

    const loginSubmit = (e) => {
        // todo: sign in
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential);
            })
            .catch((error) => {
            console.log(error);
        })
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
    <button className="link-btn" onClick={() => props.onFormSwitch('register')}>Don't have an account? Register here.</button>

    </div>


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