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

// get values from backend, for now hardcode
// don't have to explicitly define value, can do it directly in populateProfileData method
const dummyName = "Ooga Booga"
const dummyEmail = "dummy@gmail.com";
const dummyAge = 20;


function Profile() {

    const navigate = useNavigate();

    console.log("Profile component is rendering.");
    const [isEditMode, setIsEditMode] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');

    /* populate name and email fields with already-inputted info */
    const populateProfileData = () => {
        const googleUserData = JSON.parse(localStorage.getItem("googleUserData")) || {};
        setFullName(dummyName);
        setEmail(dummyEmail);
        setAge(dummyAge);

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
        setIsEditMode(false);
    };

    /* delete account */
    const handleDeleteAccountClick = () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            // Call the deleteAccount function from firebase.js
            deleteAccount()
                .then(() => {
                    // Optionally, you can navigate to a different page or perform other actions upon successful deletion
                    // For example, navigate to the login page after account deletion
                    // navigate('/login');
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
            <h5> Age: <input value={age} onChange={(e) => setAge(e.target.value)}type="age" id="age" placeholder="" name="age" /> </h5>


            <div>
                {isEditMode ? (
                    <button className='edit-button' onClick={handleSaveClick}>Save</button>
                ) : (
                    <button className='edit-button' onClick={handleEditClick}>Edit</button>
                )}

            </div>

            <button className="submit-button" onClick={handleDeleteAccountClick}>Delete Account</button>
        </div>
    );
}

export default Profile;