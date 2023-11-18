import React, { useState, useEffect } from 'react';
import { auth } from "../firebase";
import emailjs from 'emailjs-com';

function SetNotifications() {
    const user = auth.currentUser;
    const userEmail = user ? user.email : "";
    const [formSubmitted, setFormSubmitted] = useState(false);

    /* methods of notification */
    const [selectedMethods, setSelectedMethods] = useState([]);
    const [allMethods, setAllMethods] = useState([]);
    const methods = [
        "Email",
        "Text"
    ]

    /* select time */
    //time
    const [selectedHour, setSelectedHour] = useState(0);
    const [selectedMin, setSelectedMin] = useState(0);
    const [showMinDropdown, setShowMinDropdown] = useState(false);
    //am or pm
    const [selectedPeriod, setSelectedPeriod] = useState("");

    /* options */
    const [isOptionEditMode, setIsOptionEditMode] = useState(true);
    const [warningNotificationChoice, setWarningNotificationChoice] = useState('');
    const [percentageThreshold, setPercentageThreshold] = useState(0);
    const [selectedPercentage, setSelectedPercentage] = useState(0);
    const [showPercentageDropdown, setShowPercentageDropdown] = useState(false);

    const [hasSubmittedOnce, setHasSubmittedOnce] = useState(Boolean(localStorage.getItem(`hasSubmittedOnce_${userEmail}`)));
    const [isEditMode, setIsEditMode] = useState(false);

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

    const MyComponent= () => {
        useEffect(() => {
            emailjs.init("user_yourEmailJsUserId");

            return () => {
                emailjs.reset();
            };
        }, []);
    }

    const sendEmail = () => {
        const templateParams = {
            to_email: 'recipient@example.com',
            subject: 'Your Subject',
            // other template parameters
        };

        emailjs.send(
            'your_service_id',
            'your_template_id',
            templateParams
        )
            .then((response) => {
                console.log('Email sent successfully:', response);
            })
            .catch((error) => {
                console.error('Email could not be sent:', error);
            });
    };

    /* yes/no dropdown for user's budget limit warning notification choice */
    const handleWarningNotificationChange = (e) => {
        setWarningNotificationChoice(e.target.value);
        setShowPercentageDropdown(e.target.value === 'Yes');
        setPercentageThreshold(''); // reset percentageThreshold when the user decides they don't want the notif
    };

    /* function handling the submit button for the notification form */
    let mockNotificationData = {
        email: userEmail,
        preferredMethod: ["Text", "Email"],
        notifTime: "5 PM",
        budgetWarning: "60%"
    };
    const handleSubmit = () => {
        // add logic to submit here
        setFormSubmitted(true);
        setHasSubmittedOnce(true);
    };

    const handleSave = () => {
        // add logic to submit here
        setIsEditMode(false);
        setFormSubmitted(true);
    };

    useEffect(() => {
        // Save hasSubmittedOnce to local storage whenever it changes
        localStorage.setItem(`hasSubmittedOnce_${userEmail}`, hasSubmittedOnce);
    }, [hasSubmittedOnce, `hasSubmittedOnce_${userEmail}`]);

    return (
        <div className="notification-container">
            {hasSubmittedOnce && (
                <DisplayNotifications
                    warningNotificationChoice={warningNotificationChoice}
                    isEditMode={isEditMode}
                    mockNotificationData={mockNotificationData}
                    handleEdit={() => setIsEditMode(!isEditMode)}
                    handleSave={handleSave}
                />
            )}
            {(!hasSubmittedOnce || isEditMode) && (
                <>
                    {formSubmitted && !isEditMode ? (
                        <DisplayNotifications
                            warningNotificationChoice={warningNotificationChoice}
                            isEditMode={isEditMode}
                            mockNotificationData={mockNotificationData}
                            handleEdit={() => setIsEditMode(!isEditMode)}
                            handleSave={handleSave}
                        />
                    ) : (
                        <>
                            <div className="ManageNotifications">
                                {/* NOTIFICATION GROUP 1 - METHOD - email, text */}
                                <div className="notification-method-container">
                                    <h3>Select Notification Method:</h3>
                                    {/* selectable options: */}
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
                                <div className="notification-method-container">
                                    <h3>Select Input Daily Spending Notification Time:</h3>
                                    <div className="select-time">
                                        <select
                                            id="selectedHour"
                                            value={selectedHour}
                                            onChange={(e) => setSelectedHour(e.target.value)}
                                        >
                                            <option value="">Select a time</option>
                                            <option value="12">12:00</option>
                                            <option value="1">1:00</option>
                                            <option value="2">2:00</option>
                                            <option value="3">3:00</option>
                                            <option value="4">4:00</option>
                                            <option value="5">5:00</option>
                                            <option value="6">6:00</option>
                                            <option value="7">7:00</option>
                                            <option value="8">8:00</option>
                                            <option value="9">9:00</option>
                                            <option value="10">10:00</option>
                                            <option value="11">11:00</option>
                                        </select>
                                        {/* add am/pm dropdown in this div, and adjust CSS so that dropdown shows right after colon*/}
                                        <div className="am-pm">
                                            <select
                                                id="selectedPeriod"
                                                value={selectedPeriod}
                                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                            >
                                                <option value="am">am</option>
                                                <option value="pm">pm</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="notification-method-container">
                                    <h3>Set Budget Limit Warning Notification?</h3>
                                    <div>
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
                                        <div className="warning-dropdown">
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
                                            </select>
                                        </div>
                                    )}
                                </div>
                                {!isEditMode ? (
                                    <button
                                        className="submit-button"
                                        type="submit"
                                        onClick={handleSubmit}
                                    >
                                        Submit
                                    </button>
                                ) : (
                                    <button className="edit-button" onClick={handleSave}>
                                        Save
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

function DisplayNotifications({ selectedMethods, selectedHour, warningNotificationChoice, percentageThreshold, hasSubmittedOnce, isEditMode, handleEdit, handleSave, mockNotificationData }) {
    return (
        <>
            {!isEditMode ? (
                <div className="notification-container">
                    <div className="notification-method-container">
                        {/*<div className="ManageNotifications">*/}
                        <h3>Selected Notification Method:</h3>
                        <div className="notification-method-buttons">
                            {mockNotificationData.preferredMethod?.map((method) => (
                                <button
                                    key={method}
                                    className="notification-method-button selected"
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
                        {/*</div>*/}
                    </div>

                    <div className="notification-method-container">
                        <h3>Selected Input Daily Spending Notification Time:</h3>
                        <div>
                            <h5>{mockNotificationData.notifTime}</h5>
                            {/* add am/pm dropdown in this div, and adjust CSS so that time shows right after colon */}
                        </div>
                    </div>

                    <div className="notification-method-container">
                        <h3>Selected Budget Limit Warning Notification:</h3>
                        <div className="selected-warning-notif-container">
                            {warningNotificationChoice === 'Yes' && (
                                <h5> {warningNotificationChoice}, Percentage
                                    Threshold: {mockNotificationData.budgetWarning}</h5>
                            )}
                            {warningNotificationChoice === 'No' && (
                                <h5>{warningNotificationChoice}</h5>
                            )}
                        </div>
                    </div>

                    <button className="edit-button" onClick={handleEdit}>
                        Edit
                    </button>
                </div>
            ) : ''}
        </>
    );
}

export default SetNotifications;