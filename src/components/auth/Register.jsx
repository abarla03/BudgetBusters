import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import { auth } from "../../firebase";


const Register = (props) => {
    const [email, setEmail ] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(' ');

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

    <div className="auth-form-container">
        
    <form className="register-form" onSubmit={registerSubmit}>
            <h2>Register</h2>
        <label htmlFor="name">Full Name </label>
        <input value={name} onChange={(e) => setName(e.target.value)}type="name" id="name" placeholder="Full Name" name="Full Name" />
        <label htmlFor="email">email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email" />

        <label htmlFor="password">password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)}type="password" placeholder="enter password" id="password" name="password" />

        <button type="submit">Register</button>

    </form>
    <button className="link-btn" onClick={() => props.onFormSwitch}>Already have an account? Login here.</button>
    
    </div>

    /*
    <div className='sign-in-container'>
        <form onSubmit={handleSubmit}>
            <h1>Create Account</h1>
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
            <button type="submit">Sign Up</button>
        </form>
    </div>
    */


  )
}

export default Register