import React, { useState } from 'react';
import '../App.css';
import logo from '../BBLogo.png';
import { Route, Routes, Link, useNavigate  } from 'react-router-dom';
import SetMonthlyGoal from './SetMonthlyGoal'; // Import your components
import CategoryBreakdown from './CategoryBreakdown'; // Import your components
import InputDailySpending from './InputDailySpending'; // Import your components
import { deleteUser } from "firebase/auth";
import { deleteAccount } from '../firebase';



function Profile() {

    const navigate = useNavigate();

    console.log("Profile component is rendering.");
    const [isEditMode, setIsEditMode] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');

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
            <h4>Full Name:</h4>
            {isEditMode ? (
                <input
                    id="fullName"
                    className="prepopulated-field"
                    placeholder="Prepopulated name"
                    defaultValue={fullName}
                />
            ) : (
                <h6>{fullName}</h6>
            )}
            <h5>Email:</h5>
            {isEditMode ? (
                <input
                    id="email"
                    className="prepopulated-field"
                    placeholder="Prepopulated email"
                    defaultValue={email}
                />
            ) : (
                <h6>{email}</h6>
            )}

            <h5>Age:</h5>
            {isEditMode ? (
                <input
                    id="age"
                    className="prepopulated-field"
                    placeholder="Prepopulated age"
                    defaultValue={age}
                />
            ) : (
                <h6>{age}</h6>
            )}
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

// return (
//   <div className="Profile">
//   <h3>Welcome to the Profile Page!</h3>
//   </div>
// );

export default Profile;