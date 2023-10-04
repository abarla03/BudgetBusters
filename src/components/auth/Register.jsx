import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import { auth } from "../../firebase";
import { signInWithGoogle } from "../../firebase";
import logo from "../../BBLogo.png";


const Register = (props) => {
    const [email, setEmail ] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(' ');
    const [age, setAge] = useState(' ');
    const [phoneNumber, setPhoneNumber] = useState(' ');

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

    <div className="auth-form-container">
        
    <form className="register-form" onSubmit={registerSubmit}>
    <img src={logo} alt = ''/>
            <h2>Register</h2>
        <label htmlFor="name">Full Name </label>
        <input value={name} onChange={(e) => setName(e.target.value)}type="text" id="name" placeholder="Full Name" name="Full Name" />

        <label htmlFor="age">Age </label>
        <input value={age} onChange={(e) => setAge(e.target.value)}type="age" id="age" placeholder="" name="age" />


        <label htmlFor="phoneNumber">Phone Number </label>
        <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}type="phoneNumber" id="phoneNumber" placeholder="" name="phoneNumber" />


        <label htmlFor="email">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="email@emailprovider.com" id="email" name="email" />

        <label htmlFor="password">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)}type="password" placeholder="enter password" id="password" name="password" />

        <button type="submit">Register</button>


    </form>
    <button className="link-btn" onClick={() => props.onFormSwitch}>Already have an account? Login here.</button>
    
    <button className="sign-in-with-google-btn" onClick = {signInWithGoogle}>Sign In With Google</button> 
    <h1>{localStorage.getItem("name")}</h1>
    <h1>{localStorage.getItem("email")}</h1>
    <img src = {localStorage.getItem("profilePic")}/>


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
