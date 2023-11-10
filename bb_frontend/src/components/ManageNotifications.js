import React, { useState, useEffect } from 'react';
import { auth } from "../firebase";

function SetNotifications() {
    const user = auth.currentUser;
    const userEmail = user ? user.email : "";
    const [formSubmitted, setFormSubmitted] = useState(false);

    /* methods of notification */
    const [isMethodEditMode, setIsMethodEditMode] = useState(true);
    const [selectedMethods, setSelectedMethods] = useState([]);
    const [allMethods, setAllMethods] = useState([]);
    const methods = [
        "Email",
        "Text"
    ]

    /* select time */
    //time
    const [selectedHour, setSelectedHour] = useState(0);
    const [showHourDropdown, setShowHourDropdown] = useState(false); // don't need this; will not be conditional
    //minute -- no need for this, we will just give them options on the hour (1:00, 2:00, etc.)
    const [selectedMin, setSelectedMin] = useState(0);
    const [showMinDropdown, setShowMinDropdown] = useState(false);
    //am or pm
    const [selectedPeriod, setSelectedPeriod] = useState("");
    const [showPeriodDropdown, setShowPeriodDropdown] = useState(false); // don't need this; will not be conditional

    /* options */
    const [isOptionEditMode, setIsOptionEditMode] = useState(true);
    const [warningNotificationChoice, setWarningNotificationChoice] = useState('');
    const [percentageThreshold, setPercentageThreshold] = useState(0);
    const [selectedPercentage, setSelectedPercentage] = useState(0);
    const [showPercentageDropdown, setShowPercentageDropdown] = useState(false);
    const [dollarThreshold, setDollarThreshold] = useState(0); // may not need this; calculations could be done in backend

    const [hasSubmittedOnce, setHasSubmittedOnce] = useState(Boolean(localStorage.getItem(`hasSubmittedOnce_${userEmail}`)));

    /* function handling user's ability to select multiple notification methods */
    const handleMethodClick = (method) => {
        // adds or removes the selected method from the selectedMethods array
        // based on whether it was included before or not
        if (selectedMethods.includes(method)) {
            setSelectedMethods(selectedMethods.filter((c) => c !== method));
            setAllMethods(allMethods.filter((c) => c !== method));
        } else {
            setSelectedMethods([...selectedMethods, method]);
            setAllMethods([...allMethods, method]);
        }
    };

    /* yes/no dropdown for user's budget limit warning notification choice */
    const handleWarningNotificationChange = (e) => {
        setWarningNotificationChoice(e.target.value);
        setShowPercentageDropdown(e.target.value === 'Yes');
        setPercentageThreshold(''); // reset percentageThreshold when the user decides they don't want the notif
    };

    /* function handling the submit button for the notification form */
    const handleSubmit = () => {
        // add logic to submit here
        setFormSubmitted(true);
        setHasSubmittedOnce(true);
    };

    const handleSave = () => {
        // add logic to submit here
        setFormSubmitted(true);
    };

    useEffect(() => {
        // Save hasSubmittedOnce to local storage whenever it changes
        localStorage.setItem(`hasSubmittedOnce_${userEmail}`, hasSubmittedOnce);
    }, [hasSubmittedOnce, `hasSubmittedOnce_${userEmail}`]);

    return (
        <div className="notification-container">
            {formSubmitted ? (
                <DisplayNotifications
                    selectedMethods={selectedMethods}
                    selectedHour={selectedHour}
                    warningNotificationChoice={warningNotificationChoice}
                    setWarningNotificationChoice={setWarningNotificationChoice}
                    percentageThreshold={percentageThreshold}
                    handleEdit={() => setFormSubmitted(!formSubmitted)}
                />
            ) : (
                <>
                    <div className="ManageNotifications">
                        {/* NOTIFICATION GROUP 1 - METHOD - email, text */}
                        <h3>Select Notification Method:</h3>
                        {/*selectable options:*/}
                        <div className="notification-method-buttons">
                            {methods.map((method) => (
                                <button
                                    key={method}
                                    className={`notification-method-button${
                                        selectedMethods.includes(method) ? ' selected' : ''
                                    }`}
                                    onClick={() => handleMethodClick(method)}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Daily Notification Time */}
                    <h3>Select Input Daily Spending Notification Time:</h3>
                    <div>
                        <select
                            id="selectedHour"
                            value={selectedHour}
                            onChange={(e) => setSelectedHour(e.target.value)}
                        >
                            <option value="">Select a time</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                        </select>
                        {/* add am/pm dropdown in this div, and adjust CSS so that dropdown shows right after colon*/}
                    </div>

                    <h3>Set Budget Limit Warning Notification (optional):</h3>
                    <div>
                        <label htmlFor="warningNotificationChoice">Do you want to set a Budget Limit Warning Notification?  </label>
                        <select
                            id="warningNotificationChoice"
                            value={warningNotificationChoice}
                            onChange={handleWarningNotificationChange}
                        >
                            <option value="">Select an option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    {showPercentageDropdown && (
                        <div>
                            <label htmlFor="percentageThreshold">Select a percentage threshold:</label>
                            <select
                                id="percentageThreshold"
                                value={percentageThreshold}
                                onChange={(e) => setPercentageThreshold(e.target.value)}
                            >
                                <option value="">Select a percentage</option>
                                <option value="50">50%</option>
                                <option value="55">55%</option>
                                <option value="60">60%</option>
                                <option value="65">65%</option>
                                <option value="70">70%</option>
                                <option value="75">75%</option>
                                <option value="80">80%</option>
                                <option value="85">85%</option>
                                <option value="90">90%</option>
                                <option value="95">95%</option>
                                {/* Add more options as needed */}
                            </select>
                            {/* adjust the Yes/No dropdown so that it is after the colon (remove the question) and other css styling */}
                        </div>
                    )}

                    {hasSubmittedOnce && (
                        <button className="edit-button" type="submit" onClick={handleSave}>
                            Save
                        </button>
                    )}
                    {!hasSubmittedOnce && (
                        <button className="submit-button" type="submit" onClick={handleSubmit}>
                            Submit
                        </button>
                    )}

                    {/*<button*/}
                    {/*    className="submit-button"*/}
                    {/*    type="submit"*/}
                    {/*    onClick={handleSubmit}*/}
                    {/*>*/}
                    {/*    Submit*/}
                    {/*</button>*/}
                </>
            )}
        </div>
    );
}

function DisplayNotifications({ selectedMethods, selectedHour, warningNotificationChoice, percentageThreshold, handleEdit }) {
    return (
        <div className="notification-container">
            <div className="ManageNotifications">
                <h3>Selected Notification Method:</h3>
                <div className="notification-method-buttons">
                    {selectedMethods.map((method) => (
                        <button
                            key={method}
                            className="notification-method-button selected"
                        >
                            {method}
                        </button>
                    ))}
                </div>
            </div>

            <h3>Selected Input Daily Spending Notification Time:</h3>
            <div>
                <p>{selectedHour}</p>
                {/* add am/pm dropdown in this div, and adjust CSS so that time shows right after colon */}
            </div>

            <h3>Selected Budget Limit Warning Notification:</h3>
            <div>
                <p>{warningNotificationChoice}</p>
                {warningNotificationChoice === 'Yes' && (
                    <p>Percentage Threshold: {percentageThreshold}</p>
                )}
                {/* put yes/no right after colon, adjust CSS styling */}
            </div>

            <button className="edit-button" onClick={handleEdit}>
                Edit
            </button>
        </div>
    );
}

export default SetNotifications;


// S3_US9_and_10 Code
// import React, { useState } from 'react';
// import '../App.css';
// import logo from '../BBLogo.png';
// import { Route, Routes, Link  } from 'react-router-dom';
// import SetMonthlyGoal from './SetMonthlyGoal'; // Import your components
// import CategoryBreakdown from './CategoryBreakdown'; // Import your components
// import InputDailySpending from './InputDailySpending'; // Import your components
//
// //notification methods
// const methods = [
//     "Email",
//     "Text"
// ]
//
// // optional notifications
// // const options = [
// //     "Budget Limit Warning"
// //     //"Set Monthly Goal"
// // ]
//
// // user's budget goal
// const budgetGoal = 100; // get value from backend
// function ManageNotifications() {
//     console.log("Manage Notifications component is rendering.");
//
//     /* methods */
//     const [isMethodEditMode, setIsMethodEditMode] = useState(true);
//     const [selectedMethods, setSelectedMethods] = useState([]);
//     const [allMethods, setAllMethods] = useState([]);
//
//     /* select time */
//
//     //time
//     const [selectedHour, setSelectedHour] = useState(0);
//     const [showHourDropdown, setShowHourDropdown] = useState(false);
//
//     //minute
//     const [selectedMin, setSelectedMin] = useState(0);
//     const [showMinDropdown, setShowMinDropdown] = useState(false);
//
//     //am or pm
//     const [selectedPeriod, setSelectedPeriod] = useState("");
//     const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
//
//     /* options */
//     const [isOptionEditMode, setIsOptionEditMode] = useState(true);
//     //const [selectedOptions, setSelectedOptions] = useState([]);
//     const [percentageThreshold, setPercentageThreshold] = useState(0);
//     const [selectedPercentage, setSelectedPercentage] = useState(0);
//     const [showPercentageDropdown, setShowPercentageDropdown] = useState(false);
//     const [dollarThreshold, setDollarThreshold] = useState(0);
//
//
//
//     /******************************************* NOTIFICATION GROUP 1 - METHOD ***************************************/
//
//     /* function handling user's ability to select multiple categories */
//     const handleMethodClick = (method) => {
//
//         // adds or removes the selected method from the selectedMethods array
//         // based on whether it was included before or not
//         if (selectedMethods.includes(method)) {
//             setSelectedMethods(selectedMethods.filter((c) => c !== method));
//             setAllMethods(allMethods.filter((c) => c !== method));
//         } else {
//             setSelectedMethods([...selectedMethods, method]);
//             setAllMethods([...allMethods, method]);
//         }
//     };
//
//     /* function handling the edit mode */
//     const handleMethodEditClick = () => {
//         setIsMethodEditMode(!isMethodEditMode);
//         // have to revert to default color
//         setSelectedMethods([]); // Clear the selected methods
//
//     };
//
//     /* function handling the saved information from edit */
//     const handleMethodSaveClick = () => {
//
//         if (selectedMethods.length === 0) {
//             // If no methods are selected, show the popup
//             //setShowPopup(true);
//             window.alert("Please select a method of notification!");
//         } else {
//             // If methods are selected, proceed with saving
//             setIsMethodEditMode(false);
//             // Save the selected methods to the backend or do whatever is needed
//             setShowHourDropdown(true);
//             setShowMinDropdown(true);
//             setShowPeriodDropdown(true);
//         }
//
//         // have to save new options in backend/db
//     };
//
//     /******************************************* NOTIFICATION GROUP 2 - OPTIONAL *************************************/
//     //console.log(`selectedOptions before clicking the btn: ${selectedOptions}`);
//     /* function handling user's ability to select multiple categories */
//     const handleOptionClick = (option) => {
//         // console.log(`you chose the following option(s): ${option}`);
//         // console.log(`selectedOptions after clicking the btn: ${selectedOptions}`);
//
//         // adds or removes the selected method from the selectedMethods array
//         // based on whether it was included before or not
//         // if (selectedOptions.includes(option)) {
//         //     console.log(`the selectedOptions array already has that option: ${selectedOptions}`);
//         //     setSelectedOptions(selectedOptions.filter((c) => c !== option));
//         //     console.log(`selectedOptions now: ${selectedOptions}`);
//         //     //setAllMethods(allMethods.filter((c) => c !== option));
//         // } else {
//         //     console.log(`the selectedOptions array doesn't have that option: ${selectedOptions}`);
//         //     setSelectedOptions([...selectedOptions, option]);
//         //     console.log(`selectedOptions now: ${selectedOptions}`);
//         //     if (option === "Budget Limit Warning") {
//         //         console.log(`You chose the ${option} notification!`)
//         //         //window.alert(`You chose the ${option} notification!`);
//         //         // let userThreshold = window.prompt("Please enter your desired percentage threshold (in numeric form): ", 75);
//         //         // console.log(`userThreshold: ${userThreshold}`);
//         //         // let numberCast = parseInt(userThreshold);
//         //         // console.log(`numberCast: ${numberCast}`);
//         //         // if (isNaN(numberCast)) {
//         //         //
//         //         //     console.log(`Invalid input, please enter a valid number.`)
//         //         // } else {
//         //         //     setPercentageThreshold(numberCast);
//         //         //     console.log("Valid input, thank you");
//         //         // }
//         //         // //setPercentageThreshold(userThreshold);
//         //         setShowPercentageDropdown(true);
//         //         //console.log(`you chose to receive a notification when you reach ${percentageThreshold} % of your budget goal`);
//         //         findDollarValueThreshold(percentageThreshold);
//         //     }
//         //     //setAllMethods([...allMethods, option]);
//         // }
//         setShowPercentageDropdown(true);
//
//     };
//     //console.log(`you chose to receive a notification when you reach ${percentageThreshold} % of your budget goal`);
//
//
//     /* function to determine specific dollar value threshold based on percentage */
//     const findDollarValueThreshold = (percentageThreshold) => {
//
//         console.log(`you chose to receive a notification when you reach ${percentageThreshold} % of your budget goal`);
//         let dollarValThreshold = ((percentageThreshold/100) * budgetGoal);
//         console.log(`dollar threshold: ${dollarValThreshold}`);
//         //setDollarThreshold((percentageThreshold/100) * budgetGoal);
//         // let dollarValThreshold = ((percentageThreshold/100) * budgetGoal);
//         // console.log(`dollar threshold: ${dollarValThreshold}`);
//         //console.log(`dollar threshold: ${dollarThreshold}`);
//     }
//
//
//     /* function handling the edit mode */
//     const handleOptionEditClick = () => {
//
//         setIsOptionEditMode(!isOptionEditMode);
//         // have to revert to default color
//         //setSelectedOptions([]); // Clear the selected methods
//         setShowPercentageDropdown(true);
//
//
//     };
//
//     /* function handling the saved information from edit */
//     const handleOptionSaveClick = () => {
//         setShowPercentageDropdown(false); // maybe move in else block?
//
//         setIsOptionEditMode(false);
//         setSelectedPercentage(percentageThreshold);
//         findDollarValueThreshold(percentageThreshold);
//
//
//         // have to save new options in backend/db
//
//     };
//
//
//
//     /**************************************************** UI *********************************************************/
//
//     return (
//         <div className="ManageNotifications">
//             {/* NOTIFICATION GROUP 1 - METHOD - email, text */}
//             <h3>Select Notification Method</h3>
//
//             {/*selectable options:*/}
//             <div className="notification-method-buttons">
//                 {methods.map((method) => (
//                     <button
//                         key={method}
//                         className={`notification-method-button${selectedMethods.includes(method) ? ' selected' : ''}`}
//                         onClick={() => handleMethodClick(method)}
//                     >
//                         {method}
//                     </button>
//
//                 ))}
//
//             </div>
//
//             <div>
//                 {/*SELECT TIME*/}
//                 {/*hour*/}
//                 {showHourDropdown && (
//                     <div>
//                         <label htmlFor="selectedHour">Select a time for your daily notification:</label>
//                         <select id="selectedHour" value={selectedHour} onChange={(e) => setSelectedHour(e.target.value)}>
//                             <option value="12">12</option>
//                             <option value="1">1</option>
//                             <option value="2">2</option>
//
//                             {/* Add more options as needed */}
//                         </select>
//                     </div>
//                 )}
//
//                 {/*min*/}
//                 {showHourDropdown && (
//                     <div>
//                         <label htmlFor="selectedMin">Select a time for your daily notification:</label>
//                         <select id="selectedMin" value={selectedMin} onChange={(e) => setSelectedMin(e.target.value)}>
//                             <option value="00">:00</option>
//                             <option value="15">:15</option>
//                             <option value="30">:30</option>
//                             <option value="45">:45</option>
//
//                             {/* Add more options as needed */}
//                         </select>
//                     </div>
//                 )}
//
//                 {/*period*/}
//                 {showHourDropdown && (
//                     <div>
//                         <label htmlFor="selectedPeriod">Select a time for your daily notification:</label>
//                         <select id="selectedPeriod" value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
//                             <option value="am">am</option>
//                             <option value="pm">pm</option>
//
//
//                             {/* Add more options as needed */}
//                         </select>
//                     </div>
//                 )}
//
//
//                 {isMethodEditMode ? (
//                     <button className='edit-button' onClick={handleMethodSaveClick}>Save</button>
//                 ) : (
//                     <button className='edit-button' onClick={handleMethodEditClick}>Edit</button>
//                 )}
//
//             </div>
//
//             {/* NOTIFICATION GROUP 2 - OPTIONAL - budget limit warning */}
//             <h3>Current Notifications: </h3>
//             <div className="current-notifications">
//                 <h5>Daily Input Spending Notification</h5>
//                 <h5>Monthly Set Monthly Goal Notification</h5>
//
//                 <div className="budget-limit-checkbox">
//                     <input
//                         type="checkbox"
//                         id="budgetLimitCheckbox"
//                         //checked={selectedOptions.includes("Budget Limit Warning")}
//                         onChange={() => handleOptionClick("Budget Limit Warning")}
//
//                     />
//                     <label htmlFor="budgetLimitCheckbox">Enable Budget Limit Warning</label>
//                     {selectedPercentage > 0 && (
//                         <span>Selected Percentage: {selectedPercentage}%</span>
//                     )}
//                 </div>
//             </div>
//
//             {/*checkbox?*/}
//
//
//             <div>
//                 {/* Render the percentage dropdown conditionally */}
//                 {showPercentageDropdown && (
//                     <div>
//                         <label htmlFor="percentageThreshold">Select a percentage threshold:</label>
//                         <select id="percentageThreshold" value={percentageThreshold} onChange={(e) => setPercentageThreshold(e.target.value)}>
//                             <option value="50">50%</option>
//                             <option value="55">55%</option>
//                             <option value="60">60%</option>
//                             <option value="65">65%</option>
//                             <option value="70">70%</option>
//                             <option value="75">75%</option>
//                             <option value="80">80%</option>
//                             <option value="85">85%</option>
//                             <option value="90">90%</option>
//                             <option value="95">95%</option>
//                             {/* Add more options as needed */}
//                         </select>
//                     </div>
//                 )}
//                 {isOptionEditMode ? (
//                     <button className='edit-button' onClick={handleOptionSaveClick}>Save</button>
//                 ) : (
//                     <button className='edit-button' onClick={handleOptionEditClick}>Edit</button>
//                 )}
//
//             </div>
//
//         </div>
//     );
// }
//
// export default ManageNotifications;