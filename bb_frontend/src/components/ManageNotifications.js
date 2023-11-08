import React, { useState } from 'react';
import '../App.css';
import logo from '../BBLogo.png';
import { Route, Routes, Link  } from 'react-router-dom';
import SetMonthlyGoal from './SetMonthlyGoal'; // Import your components
import CategoryBreakdown from './CategoryBreakdown'; // Import your components
import InputDailySpending from './InputDailySpending'; // Import your components

//notification methods
const methods = [
    "Email",
    "Text"
]
function ManageNotifications() {
    console.log("Manage Notifications component is rendering.");

    const [isEditMode, setIsEditMode] = useState(true);
    const [selectedMethods, setSelectedMethods] = useState([]);
    const [allMethods, setAllMethods] = useState([]);

    /* function handling user's ability to select multiple categories */
    const handleMethodClick = (method) => {
        if (selectedMethods.includes(method)) {
            setSelectedMethods(selectedMethods.filter((c) => c !== method));
            setAllMethods(allMethods.filter((c) => c !== method));
        } else {
            setSelectedMethods([...selectedMethods, method]);
            setAllMethods([...allMethods, method]);
        }
    };

    /* function handling the edit mode */
    const handleEditClick = () => {
        setIsEditMode(!isEditMode);
        // have to revert to default color
        setSelectedMethods([]); // Clear the selected methods

    };

    /* function handling the saved information from edit */
    const handleSaveClick = () => {
        // setFullName(document.getElementById('fullName').value);
        // setEmail(document.getElementById('email').value);
        // setAge(document.getElementById('age').value);
        // setPhone(document.getElementById('phone').value);
        //setIsEditMode(false);
        if (selectedMethods.length === 0) {
            // If no methods are selected, show the popup
            //setShowPopup(true);
            window.alert("Please select a method of notification!");
        } else {
            // If methods are selected, proceed with saving
            setIsEditMode(false);
            // Save the selected methods to the backend or do whatever is needed
        }

        // have to save new options in backend/db
    };

    return (
        <div className="ManageNotifications">
            <h3>Select Notification Method</h3>

            {/*selectable options:*/}
            <div className="notification-method-buttons">
                {methods.map((method) => (
                    <button
                        key={method}
                        className={`notification-method-button${selectedMethods.includes(method) ? ' selected' : ''}`}
                        onClick={() => handleMethodClick(method)}
                    >
                        {method}
                    </button>

                ))}

            </div>

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

export default ManageNotifications;

