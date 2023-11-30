import React, { useState, useEffect } from 'react';
import { auth } from "../firebase";
import {post, put, get} from "./ApiClient";

function SetNotifications() {
    const user = auth.currentUser;
    const userEmail = user ? user.email : "";
    const [formSubmitted, setFormSubmitted] = useState(false);

    const [userObj, setUserObj] = useState({});
    const [userUpdated, setUserUpdated] = useState(false); // to re-fetch notifications info whenever update happens
    const [isNotifTime, setIsNotifTime] = useState(false);

    /* getting the user's phone number */
    useEffect(() => {
        function fetchUserData() {
            let data;
            try {
                // Make the GET request to retrieve the budget
                data = get(`/getUser/${userEmail}`);
            } catch (error) {
                console.error("Error creating or fetching budget:", error);
            }
            return data;
        }

        fetchUserData().then((response) => {
            setUserObj(response.data);
        });
        setUserUpdated(false)
        console.log("userObj", userObj)

    }, [userEmail, userUpdated]);


    const [notifObj, setNotifObj] = useState({});
    const [notifUpdated, setNotifUpdated] = useState(false); // to re-fetch notifications info whenever update happens

    /* obtaining notification object from user input */
    useEffect(() => {
        function fetchNotifData() {
            let data;
            try {
                // Make the GET request to retrieve the budget
                data = get(`/getNotifications/${userEmail}`)
            } catch (error) {
                console.error("Error creating or fetching budget:", error);
            }
            return data;
        }

        fetchNotifData().then((response) => {
            setNotifObj(response.data);
        });
        setNotifUpdated(false)
        console.log("notifObj", notifObj)

    }, [userEmail, notifUpdated]);

    /* methods of notification */
    const [selectedMethods, setSelectedMethods] = useState([]);
    const [allMethods, setAllMethods] = useState([]);
    const methods = ["Email", "Text"];

    /* select time */
    //time
    const [selectedHour, setSelectedHour] = useState(notifObj ? notifObj.notifTime?.split(" ")[0] : "0");
    //minute -- no need for this, we will just give them options on the hour (1:00, 2:00, etc.)
    const [selectedMin, setSelectedMin] = useState(0);
    const [showMinDropdown, setShowMinDropdown] = useState(false);
    //am or pm
    const [selectedPeriod, setSelectedPeriod] = useState(notifObj ? notifObj.notifTime?.split(" ")[1] : "");

    /* options */
    const [isOptionEditMode, setIsOptionEditMode] = useState(true);
    const [warningNotificationChoice, setWarningNotificationChoice] = useState(notifObj ? notifObj.warningNotificationChoice : "");
    const [percentageThreshold, setPercentageThreshold] = useState(notifObj ? notifObj.budgetWarning : 0);
    const [selectedPercentage, setSelectedPercentage] = useState(0);
    const [showPercentageDropdown, setShowPercentageDropdown] = useState(false);
    const [dollarThreshold, setDollarThreshold] = useState(0); // may not need this; calculations could be done in backend

    const [hasSubmittedOnce, setHasSubmittedOnce] = useState(Boolean(localStorage.getItem(`hasSubmittedOnce_${userEmail}`)));
    const [isEditMode, setIsEditMode] = useState(false); // Track edit mode
    const [noNumberFlag, setNoNumberFlag] = useState(false);
    const [noNumberMessage, setNoNumberMessage] = useState('');
    const [noTimeMessage, setNoTimeMessage] = useState('');
    const [noPeriodMessage, setNoPeriodMessage] = useState('');

    /* function handling user's ability to select multiple notification methods */
    const handleMethodClick = (method) => {
        // adds or removes the selected method from the selectedMethods array
        // based on whether it was included before or not
        if (selectedMethods?.includes(method)) {
            // this condition deselects a previously chosen method
            setSelectedMethods(selectedMethods.filter((c) => c !== method)); //deselects the method
            setAllMethods(allMethods.filter((c) => c !== method)); //removes the method from allMethods array

            if (method === "Text") {
                setNoNumberMessage('');
            }
        } else {
            console.log("in if (selectedMethods?.includes(method)) { else statement");
            setSelectedMethods([...selectedMethods, method]); //selects method
            setAllMethods([...allMethods, method]); //adds method to allMethods array

            if (method === 'Text') {
                if (userObj?.phoneNumber) {
                    // notif object stored first
                    // store into collections
                    setNoNumberMessage('');
                } else {
                    setNoNumberMessage("Please input your phone number in the profile page to receive texts.");
                }
            }
        }
    };

    /* function handling whether time choice exists */
    const handleTimeChoice = (e) => {
        if (!(e.target.value)) {
            // set error message
            setNoTimeMessage('Please choose an hour for your daily notification.');
        } else {
            // set error ''
            setNoTimeMessage('');
            setSelectedHour(e.target.value);
        }
    }

    /* function handling whether period choice exists */
    const handlePeriodChoice = (e) => {
        if (!(e.target.value)) {
            // set error message
            setNoPeriodMessage('Please choose a period for your daily notification.');
        } else {
            // set error ''
            setNoPeriodMessage('');
            setSelectedPeriod(e.target.value);
        }
    }

    /* yes/no dropdown for user's budget limit warning notification choice */
    const handleWarningNotificationChange = (e) => {
        setWarningNotificationChoice(e.target.value);
        setShowPercentageDropdown(e.target.value === 'Yes');
        setPercentageThreshold(''); // reset percentageThreshold when the user decides they don't want the notif
    };

    /* function handling when user submits all of their notification choices, also stores notifObj on FB */
    const handleSubmit = async () => {
        // change logic here
        if (!selectedHour || selectedHour === "0" || !selectedPeriod || selectedPeriod === '') {
            console.log("selected hour when null", selectedHour);
            console.log("selected period when null", selectedPeriod);
            setNoTimeMessage("HAHA");
        } else {
            console.log("selected hour when not null", selectedHour);
            console.log("selected period when not null", selectedPeriod);
            setNoTimeMessage("LOLOL");
            // save notification data to FB
            const notificationData = {
                email: userEmail,
                preferredMethod: selectedMethods,
                notifTime: selectedHour?.toString().concat(" " + selectedPeriod.toUpperCase()),
                warningNotificationChoice: warningNotificationChoice,
                budgetWarning: percentageThreshold
            };

            const createBudgetResponse = await post('/createNotification', notificationData);

            // verify post was successful
            // if (createBudgetResponse.status === 200) {
            //     console.log('Text notification entry created successfully!');
            //
            // } else {
            //     console.log('Text notification entry creation failed.');
            // }
        }

          // // store into textNotifs collection -- time + number
            // const textNotifTime = {
            //     phoneNumber: userPhone,
            //     dailyNotif: notifObj.notifTime
            // };
            // const createTextNotifEntry = await post('/createTextNotif', textNotifTime);
        setFormSubmitted(true);
        localStorage.setItem(`hasSubmittedOnce_${userEmail}`, 'true');
        setHasSubmittedOnce(true);
        setNotifUpdated(true);
        console.log("test 10");
    };

    /* function handling when user wants to save their edits to their notification choices, also updates notifObj on FB */
    const handleSave = async () => {
        // handleNotifTime();
        // setIsEditMode(false);
        // setFormSubmitted(true);
        if (!isNotifTime) {
            window.alert("Please enter a time to receive your daily notification!");
            // handleNotifTime()
        } else {
            // save notification data in FB
            const updatedNotificationData = {
                email: userEmail,
                preferredMethod: selectedMethods,
                notifTime: selectedHour.toString().concat(" " + selectedPeriod.toUpperCase()),
                warningNotificationChoice: warningNotificationChoice,
                budgetWarning: percentageThreshold
            };
            const updateBudgetResponse = await put('/updateNotifications', updatedNotificationData);

            // store into textNotifs collection -- time + number
            const updatedTextNotifTime = {
                //phoneNumber: notifObj.phoneNumber,??
                phoneNumber: userObj?.phoneNumber,
                dailyNotif: notifObj.notifTime
            };
            const updateTextNotifEntry = await put('/updateTextNotifs', updatedTextNotifTime);

            setIsEditMode(false);
            setFormSubmitted(true);
        }
        
        //const updateBudgetResponse = await put('/updateNotifications', updatedNotificationData);
        setNotifUpdated(true);
    };

    // useEffect(() => {
    //     // save hasSubmittedOnce to local storage whenever it changes
    //     localStorage.removeItem(`hasSubmittedOnce_${userEmail}`);
    // }, [hasSubmittedOnce, `hasSubmittedOnce_${userEmail}`]);

    return (
        <div className="notification-container">
            {/* condition where user previously submitted their notification form and views the page after a login/redirection */}
            {hasSubmittedOnce && (
                <DisplayNotifications
                    warningNotificationChoice={notifObj.warningNotificationChoice}
                    isEditMode={isEditMode}
                    notifObj={notifObj}
                    handleEdit={() => setIsEditMode(!isEditMode)}
                    handleSave={handleSave}
                />
            )}
            {/* condition where user submitted their notification form and views the page immediately after clicking the Submit button */}
            {/* !hasSubmittedOnce && */}
            {!hasSubmittedOnce && formSubmitted && !isEditMode && (
                <DisplayNotifications
                    warningNotificationChoice={notifObj.warningNotificationChoice}
                    isEditMode={isEditMode}
                    notifObj={notifObj}
                    handleEdit={() => setIsEditMode(!isEditMode)}
                    handleSave={handleSave}
                />
            )}
            {/* 2 conditions:
                1. condition where user is submitting their notification form for the first time
                2. condition where the user clicks on the edit button after submission (pre-populates previous info if it exists) */}
            {((!hasSubmittedOnce) || (notifObj && isEditMode)) && (
                <>
                    {/* Choose Notification Method */}
                    <div className="ManageNotifications">
                        <div className="notification-method-container">
                            <h3>Select Notification Method:</h3>
                            <div className="notification-method-buttons">
                                {methods.map((method) => (
                                    <button
                                        key={method}
                                        // className={`notification-method-button${
                                        //     ((notifObj.preferredMethod === selectedMethods) ? notifObj?.preferredMethod : selectedMethods).includes(method) ? ' selected' : ''
                                        // }`}
                                        className={`notification-method-button${selectedMethods.includes(method) ? ' selected' : ''}`}
                                        onClick={() => handleMethodClick(method)}
                                    >
                                        {method}
                                    </button>
                                ))}
                                {noNumberMessage && <p className="error-message">{noNumberMessage}</p>}
                            </div>
                        </div>

                        {/* Input Daily Notification Time */}
                        <div className="notification-method-container">
                            <h3>Select Input Daily Spending Notification Time:</h3>
                            <div className="select-time">
                                <select
                                    id="selectedHour"
                                    // value={(notifObj.notifTime.split(" ")[0] === selectedHour) ? (notifObj?.notifTime.split(" ")[0]) : (selectedHour)}
                                    value={selectedHour}
                                    // onChange={(e) => setSelectedHour(e.target.value)}
                                    onChange={(e) => handleTimeChoice(e)}
                                >
                                    <option value="">Select a time</option>
                                    <option value="12">12:00</option>
                                    <option value="12:30">12:30</option>
                                    <option value="1">1:00</option>
                                    <option value="1:30">1:30</option>
                                    <option value="2">2:00</option>
                                    <option value="2:30">2:30</option>
                                    <option value="3">3:00</option>
                                    <option value="3:30">3:30</option>
                                    <option value="4">4:00</option>
                                    <option value="4:30">4:30</option>
                                    <option value="5">5:00</option>
                                    <option value="5:30">5:30</option>
                                    <option value="6">6:00</option>
                                    <option value="6:30">6:30</option>
                                    <option value="7">7:00</option>
                                    <option value="7:30">7:30</option>
                                    <option value="8">8:00</option>
                                    <option value="8:30">8:30</option>
                                    <option value="9">9:00</option>
                                    <option value="9:30">9:30</option>
                                    <option value="10">10:00</option>
                                    <option value="10:30">10:30</option>
                                    <option value="11">11:00</option>
                                    <option value="11:30">11:30</option>
                                </select>
                                {noTimeMessage && <p className="error-message">{noTimeMessage}</p>}
                                <div className="am-pm">
                                    <select
                                        id="selectedPeriod"
                                        // value={(notifObj.notifTime.split(" ")[1] === selectedPeriod) ? (notifObj?.notifTime.split(" ")[1]) : (selectedPeriod)}
                                        value={selectedPeriod}
                                        onChange={(e) => handlePeriodChoice(e)}
                                        //onChange={handleNotifTime}
                                    >
                                        <option value="">Select AM/PM</option>
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                    {noPeriodMessage && <p className="error-message">{noPeriodMessage}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Choose whether user wants Budget Limit Warning notification */}
                        <div className="notification-method-container">
                            <h3>Set Budget Limit Warning Notification?</h3>
                            <div>
                                <select
                                    id="warningNotificationChoice"
                                    // value={((notifObj.warningNotificationChoice === warningNotificationChoice) ? notifObj?.warningNotificationChoice : warningNotificationChoice)}
                                    value={warningNotificationChoice}
                                    onChange={handleWarningNotificationChange}
                                >
                                    <option value="">Select an option</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            {/* If user wants Budget Limit Warning Notification, user can choose percentage */}
                            {showPercentageDropdown && (
                                <div className="warning-dropdown">
                                    <label htmlFor="percentageThreshold">Select a percentage threshold:</label>
                                    <select
                                        id="percentageThreshold"
                                        // value={(notifObj.budgetWarning === percentageThreshold) ? notifObj?.budgetWarning : percentageThreshold}
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
                                    </select>
                                </div>
                            )}
                        </div>

                        {/*Conditionally renders Submit/Save button depending on if user is in edit mode*/}
                        {!isEditMode ? (
                            <button
                                className="submit-button"
                                type="submit"
                                onClick={handleSubmit}
                                disabled={noNumberMessage !== '' || noTimeMessage !== ''}
                            >
                                Submit
                            </button>
                        ) : (
                            <button className="edit-button" onClick={handleSave}>
                                Save
                            </button>
                        )}
                        {noTimeMessage && <p className="error-message">{noTimeMessage}</p>}
                        {/*{!isEditMode && (*/}
                        {/*    <button*/}
                        {/*        className="submit-button"*/}
                        {/*        type="submit"*/}
                        {/*        onClick={handleSubmit}*/}
                        {/*        disabled={noNumberMessage !== ''}*/}
                        {/*    >*/}
                        {/*        Submit*/}
                        {/*    </button>*/}
                        {/*)}*/}
                    </div>
                </>
            )}
        </div>
    );
}

/* function displaying the user's previously-inputted notification data (including edit/save buttons) */
function DisplayNotifications({ notifObj, handleEdit, handleSave, isEditMode }) {
    return (
        <>
            {!isEditMode && (
                <div className="notification-container">
                    <div className="notification-method-container">
                        <h3>Selected Notification Method:</h3>
                        <div className="notification-method-buttons">
                            {notifObj?.preferredMethod?.map((method) => (
                                <button
                                    key={method}
                                    className="notification-method-button selected"
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="notification-method-container">
                        <h3>Selected Input Daily Spending Notification Time:</h3>
                        <div>
                            <h5>{notifObj?.notifTime}</h5>
                        </div>
                    </div>

                    <div className="notification-method-container">
                        <h3>Selected Budget Limit Warning Notification:</h3>
                        <div className="selected-warning-notif-container">
                            {notifObj?.warningNotificationChoice === 'Yes' && (
                                <h5> {notifObj?.warningNotificationChoice}, Percentage
                                    Threshold: {notifObj?.budgetWarning}%</h5>
                            )}
                            {notifObj?.warningNotificationChoice === 'No' && (
                                <h5>{notifObj?.warningNotificationChoice}</h5>
                            )}
                        </div>
                    </div>

                    <button className="edit-button" onClick={handleEdit}>
                        Edit
                    </button>

                    {isEditMode && (
                        <button className="edit-button" onClick={handleSave}>
                            Save
                        </button>
                    )}
                </div>
            )}
        </>
    );
}



export default SetNotifications;