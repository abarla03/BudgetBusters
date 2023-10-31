import React, { useState } from 'react';
import '../App.css';
import logo from '../BBLogo.png';
import { Route, Routes, Link, useNavigate  } from 'react-router-dom';
import SetMonthlyGoal from './SetMonthlyGoal'; // Import your components
import CategoryBreakdown from './CategoryBreakdown'; // Import your components
import InputDailySpending from './InputDailySpending'; // Import your components
import { deleteUser } from "firebase/auth";
import { deleteAccount } from '../firebase';
import { useEffect } from "react";
import firebase from "firebase/app";
import 'firebase/auth';
import { auth } from "../firebase";

function Profile() {
    const user = auth.currentUser;

    let firebaseEmail = "";
    let firebaseDisplayName = "";
    if (user) {
        console.log("there's a user signed in: ");
        console.log(user.displayName);
        console.log("here's their email: ");
        console.log(user.email);
        firebaseEmail = user.email;
        firebaseDisplayName = user.displayName;
    }


// get values from backend, for now hardcode
// don't have to explicitly define value, can do it directly in populateProfileData method
//     const dummyName = "Ooga Booga"
//     const dummyEmail = "dummy@gmail.com";
//const dummyAge = 20;
    const dummyPhone = 2247049742; // have users only enter numbers, or we parse string?

    const navigate = useNavigate();

    console.log("Profile component is rendering.");
    const [isEditMode, setIsEditMode] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState();

    /* populate name and email fields with already-inputted info */
    const populateProfileData = () => {
        //const googleUserData = JSON.parse(localStorage.getItem("googleUserData")) || {};
        setFullName(firebaseDisplayName);
        setEmail(firebaseEmail);

        // users will enter this info for the first time, so don't populate
        // unless we extract phone from google account settings...

        //setAge(dummyAge);
        //setPhone(dummyPhone);

    }

    /* call the appropriate method to populate fields */
    useEffect (() => {
        populateProfileData();
    }, []);

    /* function handling the edit mode */
    const handleEditClick = () => {
        setIsEditMode(!isEditMode);
    };

    /* function handling the saved information from edit */
    const handleSaveClick = () => {
        setFullName(document.getElementById('fullName').value);
        setEmail(document.getElementById('email').value);
        setAge(document.getElementById('age').value);
        setPhone(document.getElementById('phone').value);
        setIsEditMode(false);
    };

    /* delete account */
    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            deleteAccount()
                .then(() => {
                    navigate("/register");
                    console.log("account is deleted");
                })
                .catch((error) => {
                    console.error("Error deleting user account: ", error);
                });
        }
    };



    return (
        <div>

            <h5> Name: <input value={fullName} onChange={(e) => setFullName(e.target.value)}type="name" id="name" placeholder="" name="name" /> </h5>
            <h5> Email: <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" id="email" placeholder="" name="email" /> </h5>
            <h5> Age: <input value={age} onChange={(e) => setAge(e.target.value)}type="age" id="age" placeholder="Enter your age" name="age" /> </h5>
            <h5> Phone number: <input value={phone} onChange={(e) => setPhone(e.target.value)}type="phone" id="phone" placeholder="Enter your phone number" name="phone" /> </h5>

            <div>
                {isEditMode ? (
                    <button className='edit-button' onClick={handleSaveClick}>Save</button>
                ) : (
                    <button className='edit-button' onClick={handleEditClick}>Edit</button>
                )}

            </div>

            <button className="submit-button" onClick={handleDeleteAccount}>Delete Account</button>
        </div>
    );
}

export default Profile;