import React, { useState } from 'react';
import '../App.css';
import logo from '../BBLogo.png';
import { Route, Routes, Link  } from 'react-router-dom';
import SetMonthlyGoal from './SetMonthlyGoal'; // Import your components
import CategoryBreakdown from './CategoryBreakdown'; // Import your components
import InputDailySpending from './InputDailySpending'; // Import your components

function Profile() {
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
      </div>
    );
  }

    // return (
    //   <div className="Profile">
    //   <h3>Welcome to the Profile Page!</h3>
    //   </div>
    // );
  
  export default Profile;

 