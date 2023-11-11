import React, { useState, useEffect } from 'react';
import { auth } from "../firebase";
import {post, put, get} from "./ApiClient";

function SetNotifications(bool) {
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
    const [percentageThreshold, setPercentageThreshold] = useState('');
    const [selectedPercentage, setSelectedPercentage] = useState(0);
    const [showPercentageDropdown, setShowPercentageDropdown] = useState(false);
    const [dollarThreshold, setDollarThreshold] = useState(0); // may not need this; calculations could be done in backend

    const [hasSubmittedOnce, setHasSubmittedOnce] = useState(Boolean(localStorage.getItem(`hasSubmittedOnce_${userEmail}`)));
    // const [areNotificationsStored, setAreNotificationsStored] = useState(Boolean(localStorage.getItem(`userPreferences_${userEmail}`)));

    const [notifObj, setNotifObj] = useState({});
    const [notifUpdated, setNotifUpdated] = useState(false); // to re-fetch notifications info whenever update happens
    /* obtaining budget goal object from user input */
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
    const handleSubmit = async () => {
        // add logic to submit here
        setFormSubmitted(true);
        setHasSubmittedOnce(true);
        console.log("selected Period: ",selectedPeriod);
        // save notification data in backend/db
        const notificationData = {
            email: userEmail,
            preferredMethod: selectedMethods,
            notifTime: selectedHour.toString().concat(" " + selectedPeriod.toUpperCase()),
            budgetWarning: percentageThreshold
        };
        console.log(notificationData)
        const createBudgetResponse = await post('/createNotification', notificationData);
        console.log(createBudgetResponse)

    };

    const handleSave = async () => {
        // add logic to submit here
        setFormSubmitted(true);

        // save notification data in backend/db
        const updatedNotificationData = {
            email: userEmail,
            preferredMethod: selectedMethods,
            notifTime: selectedHour.toString().concat(" " + selectedPeriod.toUpperCase()),
            budgetWarning: percentageThreshold
        };
        console.log(updatedNotificationData)
        const updateBudgetResponse = await put('/updateNotifications', updatedNotificationData);
        console.log(updateBudgetResponse)
    };

    /* attempt to store user data between logins/redirections */
    // const [areNotificationsStored, setAreNotificationsStored] = useState(Boolean(localStorage.getItem(`userPreferences_${userEmail}`)));
    // useEffect(() => {
    //     // Save hasSubmittedOnce to local storage whenever it changes
    //     localStorage.setItem(`hasSubmittedOnce_${userEmail}`, hasSubmittedOnce);
    //     localStorage.setItem(`userPreferences_${userEmail}`, JSON.stringify({
    //         selectedMethods,
    //         selectedHour,
    //         warningNotificationChoice,
    //         percentageThreshold
    //     }));
    // }, [hasSubmittedOnce, selectedMethods, selectedHour, warningNotificationChoice, percentageThreshold, userEmail]);
    useEffect(() => {
        // Save hasSubmittedOnce to local storage whenever it changes
        localStorage.setItem(`hasSubmittedOnce_${userEmail}`, hasSubmittedOnce);
    }, [hasSubmittedOnce, `hasSubmittedOnce_${userEmail}`]);

    return (
        <div className="notification-container">
            {hasSubmittedOnce && (
                <DisplayNotifications
                    selectedMethods={notifObj.preferredMethod}
                    selectedHour={notifObj.notifTime}
                    warningNotificationChoice={warningNotificationChoice}
                    setWarningNotificationChoice={setWarningNotificationChoice}
                    percentageThreshold={notifObj.budgetWarning}
                    hasSubmittedOnce={hasSubmittedOnce}
                    handleEdit={() => setFormSubmitted(!formSubmitted)}
                />
            )}
            {!hasSubmittedOnce && (
                <>
                    {formSubmitted ? (
                        <DisplayNotifications
                            selectedMethods={selectedMethods}
                            selectedHour={selectedHour}
                            warningNotificationChoice={warningNotificationChoice}
                            setWarningNotificationChoice={setWarningNotificationChoice}
                            percentageThreshold={percentageThreshold}
                            hasSubmittedOnce={hasSubmittedOnce}
                            handleEdit={() => setFormSubmitted(!formSubmitted)}
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
                                        {/* ... (your options) */}
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
                                            <option value=''>Select a percentage</option>
                                            {/* ... (your options) */}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );

    // return (
    //     <div className="notification-container">
    //         {hasSubmittedOnce && (
    //             <DisplayNotifications
    //                 selectedMethods={notifObj.preferredMethod}
    //                 selectedHour={notifObj.notifTime}
    //                 warningNotificationChoice={warningNotificationChoice}
    //                 setWarningNotificationChoice={setWarningNotificationChoice}
    //                 percentageThreshold={notifObj.budgetWarning}
    //                 hasSubmittedOnce={hasSubmittedOnce}
    //                 handleEdit={() => setFormSubmitted(!formSubmitted)}
    //             />
    //             // <button className="edit-button" type="submit" onClick={handleSave}>
    //             //     Save
    //             // </button>
    //         )}
    //         {!hasSubmittedOnce && (
    //             <>
    //                 {formSubmitted ? (
    //                     <DisplayNotifications
    //                         selectedMethods={selectedMethods}
    //                         selectedHour={selectedHour}
    //                         warningNotificationChoice={warningNotificationChoice}
    //                         setWarningNotificationChoice={setWarningNotificationChoice}
    //                         percentageThreshold={percentageThreshold}
    //                         hasSubmittedOnce={hasSubmittedOnce}
    //                         handleEdit={() => setFormSubmitted(!formSubmitted)}
    //                     />
    //                 ) : (
    //                     <>
    //                         <div className="ManageNotifications">
    //                             {/* NOTIFICATION GROUP 1 - METHOD - email, text */}
    //                             <div className="notification-method-container">
    //                                 <h3>Select Notification Method:</h3>
    //                                 {/*selectable options:*/}
    //                                 <div className="notification-method-buttons">
    //                                     {methods.map((method) => (
    //                                         <button
    //                                             key={method}
    //                                             className={`notification-method-button${
    //                                                 selectedMethods.includes(method) ? ' selected' : ''
    //                                             }`}
    //                                             onClick={() => handleMethodClick(method)}
    //                                         >
    //                                             {method}
    //                                         </button>
    //                                     ))}
    //                                 </div>
    //                             </div>
    //                         </div>
    //
    //                         {/* Input Daily Notification Time */}
    //                         <div className="notification-method-container">
    //                             <h3>Select Input Daily Spending Notification Time:</h3>
    //                             <div className="select-time">
    //                                 <select
    //                                     id="selectedHour"
    //                                     value={selectedHour}
    //                                     onChange={(e) => setSelectedHour(e.target.value)}
    //                                 >
    //                                     <option value="">Select a time</option>
    //                                     {/* ... (your options) */}
    //                                 </select>
    //                                 {/* add am/pm dropdown in this div, and adjust CSS so that dropdown shows right after colon*/}
    //                                 <div className="am-pm">
    //                                     <select
    //                                         id="selectedPeriod"
    //                                         value={selectedPeriod}
    //                                         onChange={(e) => setSelectedPeriod(e.target.value)}
    //                                     >
    //                                         <option value="am">am</option>
    //                                         <option value="pm">pm</option>
    //                                     </select>
    //                                 </div>
    //                             </div>
    //                         </div>
    //
    //                         <div className="notification-method-container">
    //                             <h3>Set Budget Limit Warning Notification?</h3>
    //                             <div>
    //                                 <select
    //                                     id="warningNotificationChoice"
    //                                     value={warningNotificationChoice}
    //                                     onChange={handleWarningNotificationChange}
    //                                 >
    //                                     <option value="">Select an option</option>
    //                                     <option value="Yes">Yes</option>
    //                                     <option value="No">No</option>
    //                                 </select>
    //                             </div>
    //
    //                             {showPercentageDropdown && (
    //                                 <div className="warning-dropdown">
    //                                     <label htmlFor="percentageThreshold">Select a percentage threshold:</label>
    //                                     <select
    //                                         id="percentageThreshold"
    //                                         value={percentageThreshold}
    //                                         onChange={(e) => setPercentageThreshold(e.target.value)}
    //                                     >
    //                                         <option value=''>Select a percentage</option>
    //                                         {/* ... (your options) */}
    //                                     </select>
    //                                 </div>
    //                             )}
    //                         </div>
    //                     </>
    //                 )}
    //             </>
    //         )}
    //

            {/*{!hasSubmittedOnce && (*/}
            {/*    {formSubmitted ? (*/}
            {/*            <DisplayNotifications*/}
            {/*                selectedMethods={selectedMethods}*/}
            {/*                selectedHour={selectedHour}*/}
            {/*                warningNotificationChoice={warningNotificationChoice}*/}
            {/*                setWarningNotificationChoice={setWarningNotificationChoice}*/}
            {/*                percentageThreshold={percentageThreshold}*/}
            {/*                hasSubmittedOnce={hasSubmittedOnce}*/}
            {/*                handleEdit={() => setFormSubmitted(!formSubmitted)}*/}
            {/*            />*/}
            {/*        ) : (*/}
            {/*            <>*/}
            {/*                <div className="ManageNotifications">*/}
            {/*                    /!* NOTIFICATION GROUP 1 - METHOD - email, text *!/*/}
            {/*                    <div className="notification-method-container">*/}
            {/*                        <h3>Select Notification Method:</h3>*/}
            {/*                        /!*selectable options:*!/*/}
            {/*                        <div className="notification-method-buttons">*/}
            {/*                            {methods.map((method) => (*/}
            {/*                                <button*/}
            {/*                                    key={method}*/}
            {/*                                    className={`notification-method-button${*/}
            {/*                                        selectedMethods.includes(method) ? ' selected' : ''*/}
            {/*                                    }`}*/}
            {/*                                    onClick={() => handleMethodClick(method)}*/}
            {/*                                >*/}
            {/*                                    {method}*/}
            {/*                                </button>*/}
            {/*                            ))}*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}

            {/*                /!* Input Daily Notification Time *!/*/}
            {/*                <div className="notification-method-container">*/}
            {/*                    <h3>Select Input Daily Spending Notification Time:</h3>*/}
            {/*                    <div className="select-time">*/}
            {/*                        <select*/}
            {/*                            id="selectedHour"*/}
            {/*                            value={selectedHour}*/}
            {/*                            onChange={(e) => setSelectedHour(e.target.value)}*/}
            {/*                        >*/}
            {/*                            <option value="">Select a time</option>*/}
            {/*                            <option value="12">12:00</option>*/}
            {/*                            <option value="12">12:30</option>*/}
            {/*                            <option value="1">1:00</option>*/}
            {/*                            <option value="1">1:30</option>*/}
            {/*                            <option value="2">2:00</option>*/}
            {/*                            <option value="2">2:30</option>*/}
            {/*                            <option value="3">3:00</option>*/}
            {/*                            <option value="2">3:30</option>*/}
            {/*                            <option value="4">4:00</option>*/}
            {/*                            <option value="2">4:30</option>*/}
            {/*                            <option value="5">5:00</option>*/}
            {/*                            <option value="2">5:30</option>*/}
            {/*                            <option value="6">6:00</option>*/}
            {/*                            <option value="2">6:30</option>*/}
            {/*                            <option value="7">7:00</option>*/}
            {/*                            <option value="2">7:30</option>*/}
            {/*                            <option value="8">8:00</option>*/}
            {/*                            <option value="2">8:30</option>*/}
            {/*                            <option value="9">9:00</option>*/}
            {/*                            <option value="2">9:30</option>*/}
            {/*                            <option value="10">10:00</option>*/}
            {/*                            <option value="2">10:30</option>*/}
            {/*                            <option value="11">11:00</option>*/}
            {/*                            <option value="2">11:30</option>*/}

            {/*                        </select>*/}
            {/*                        /!* add am/pm dropdown in this div, and adjust CSS so that dropdown shows right after colon*!/*/}


            {/*                        <div className="am-pm">*/}
            {/*                            /!*<label htmlFor="selectedPeriod">Select a time for your daily notification:</label>*!/*/}
            {/*                            <select*/}
            {/*                                id="selectedPeriod"*/}
            {/*                                value={selectedPeriod}*/}
            {/*                                onChange={(e) => setSelectedPeriod(e.target.value)}*/}
            {/*                            >*/}
            {/*                                <option value="am">am</option>*/}
            {/*                                <option value="pm">pm</option>*/}

            {/*                            </select>*/}
            {/*                        </div>*/}


            {/*                    </div>*/}
            {/*                </div>*/}


            {/*                <div className="notification-method-container">*/}
            {/*                    <h3>Set Budget Limit Warning Notification?</h3>*/}
            {/*                    <div>*/}
            {/*                        /!*<label htmlFor="warningNotificationChoice">Do you want to set a Budget Limit Warning*!/*/}
            {/*                        /!*    Notification? </label>*!/*/}
            {/*                        <select*/}
            {/*                            id="warningNotificationChoice"*/}
            {/*                            value={warningNotificationChoice}*/}
            {/*                            onChange={handleWarningNotificationChange}*/}
            {/*                        >*/}
            {/*                            <option value="">Select an option</option>*/}
            {/*                            <option value="Yes">Yes</option>*/}
            {/*                            <option value="No">No</option>*/}
            {/*                        </select>*/}
            {/*                    </div>*/}

            {/*                    {showPercentageDropdown && (*/}
            {/*                        <div className="warning-dropdown">*/}
            {/*                            <label htmlFor="percentageThreshold">Select a percentage threshold:</label>*/}
            {/*                            <select*/}
            {/*                                id="percentageThreshold"*/}
            {/*                                value={percentageThreshold}*/}
            {/*                                onChange={(e) => setPercentageThreshold(e.target.value)}*/}
            {/*                            >*/}
            {/*                                <option value=''>Select a percentage</option>*/}
            {/*                                <option value='50'>50%</option>*/}
            {/*                                <option value='55'>55%</option>*/}
            {/*                                <option value='60'>60%</option>*/}
            {/*                                <option value='65'>65%</option>*/}
            {/*                                <option value='70'>70%</option>*/}
            {/*                                <option value='75'>75%</option>*/}
            {/*                                <option value='80'>80%</option>*/}
            {/*                                <option value='85'>85%</option>*/}
            {/*                                <option value='90'>90%</option>*/}
            {/*                                <option value='95'>95%</option>*/}
            {/*                                /!* Add more options as needed *!/*/}
            {/*                            </select>*/}
            {/*                            /!* adjust the Yes/No dropdown so that it is after the colon (remove the question) and other css styling *!/*/}
            {/*                        </div>*/}
            {/*                    )}*/}
            {/*                </div>*/}
            {/*)}*/}
            {/*{formSubmitted ? (*/}
            {/*    <DisplayNotifications*/}
            {/*        selectedMethods={selectedMethods}*/}
            {/*        selectedHour={selectedHour}*/}
            {/*        warningNotificationChoice={warningNotificationChoice}*/}
            {/*        setWarningNotificationChoice={setWarningNotificationChoice}*/}
            {/*        percentageThreshold={percentageThreshold}*/}
            {/*        hasSubmittedOnce={hasSubmittedOnce}*/}
            {/*        handleEdit={() => setFormSubmitted(!formSubmitted)}*/}
            {/*    />*/}
            {/*) : (*/}
            {/*    <>*/}
            {/*        <div className="ManageNotifications">*/}
            {/*            /!* NOTIFICATION GROUP 1 - METHOD - email, text *!/*/}
            {/*            <div className="notification-method-container">*/}
            {/*                <h3>Select Notification Method:</h3>*/}
            {/*                /!*selectable options:*!/*/}
            {/*                <div className="notification-method-buttons">*/}
            {/*                    {methods.map((method) => (*/}
            {/*                        <button*/}
            {/*                            key={method}*/}
            {/*                            className={`notification-method-button${*/}
            {/*                                selectedMethods.includes(method) ? ' selected' : ''*/}
            {/*                            }`}*/}
            {/*                            onClick={() => handleMethodClick(method)}*/}
            {/*                        >*/}
            {/*                            {method}*/}
            {/*                        </button>*/}
            {/*                    ))}*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}

            {/*        /!* Input Daily Notification Time *!/*/}
            {/*        <div className="notification-method-container">*/}
            {/*            <h3>Select Input Daily Spending Notification Time:</h3>*/}
            {/*            <div className="select-time">*/}
            {/*                <select*/}
            {/*                    id="selectedHour"*/}
            {/*                    value={selectedHour}*/}
            {/*                    onChange={(e) => setSelectedHour(e.target.value)}*/}
            {/*                >*/}
            {/*                    <option value="">Select a time</option>*/}
            {/*                    <option value="12">12:00</option>*/}
            {/*                    <option value="12">12:30</option>*/}
            {/*                    <option value="1">1:00</option>*/}
            {/*                    <option value="1">1:30</option>*/}
            {/*                    <option value="2">2:00</option>*/}
            {/*                    <option value="2">2:30</option>*/}
            {/*                    <option value="3">3:00</option>*/}
            {/*                    <option value="2">3:30</option>*/}
            {/*                    <option value="4">4:00</option>*/}
            {/*                    <option value="2">4:30</option>*/}
            {/*                    <option value="5">5:00</option>*/}
            {/*                    <option value="2">5:30</option>*/}
            {/*                    <option value="6">6:00</option>*/}
            {/*                    <option value="2">6:30</option>*/}
            {/*                    <option value="7">7:00</option>*/}
            {/*                    <option value="2">7:30</option>*/}
            {/*                    <option value="8">8:00</option>*/}
            {/*                    <option value="2">8:30</option>*/}
            {/*                    <option value="9">9:00</option>*/}
            {/*                    <option value="2">9:30</option>*/}
            {/*                    <option value="10">10:00</option>*/}
            {/*                    <option value="2">10:30</option>*/}
            {/*                    <option value="11">11:00</option>*/}
            {/*                    <option value="2">11:30</option>*/}

            {/*                </select>*/}
            {/*                /!* add am/pm dropdown in this div, and adjust CSS so that dropdown shows right after colon*!/*/}


            {/*                <div className="am-pm">*/}
            {/*                    /!*<label htmlFor="selectedPeriod">Select a time for your daily notification:</label>*!/*/}
            {/*                    <select*/}
            {/*                        id="selectedPeriod"*/}
            {/*                        value={selectedPeriod}*/}
            {/*                        onChange={(e) => setSelectedPeriod(e.target.value)}*/}
            {/*                    >*/}
            {/*                        <option value="am">am</option>*/}
            {/*                        <option value="pm">pm</option>*/}

            {/*                    </select>*/}
            {/*                </div>*/}


            {/*            </div>*/}
            {/*        </div>*/}


            {/*        <div className="notification-method-container">*/}
            {/*            <h3>Set Budget Limit Warning Notification?</h3>*/}
            {/*            <div>*/}
            {/*                /!*<label htmlFor="warningNotificationChoice">Do you want to set a Budget Limit Warning*!/*/}
            {/*                /!*    Notification? </label>*!/*/}
            {/*                <select*/}
            {/*                    id="warningNotificationChoice"*/}
            {/*                    value={warningNotificationChoice}*/}
            {/*                    onChange={handleWarningNotificationChange}*/}
            {/*                >*/}
            {/*                    <option value="">Select an option</option>*/}
            {/*                    <option value="Yes">Yes</option>*/}
            {/*                    <option value="No">No</option>*/}
            {/*                </select>*/}
            {/*            </div>*/}

            {/*            {showPercentageDropdown && (*/}
            {/*                <div className="warning-dropdown">*/}
            {/*                    <label htmlFor="percentageThreshold">Select a percentage threshold:</label>*/}
            {/*                    <select*/}
            {/*                        id="percentageThreshold"*/}
            {/*                        value={percentageThreshold}*/}
            {/*                        onChange={(e) => setPercentageThreshold(e.target.value)}*/}
            {/*                    >*/}
            {/*                        <option value=''>Select a percentage</option>*/}
            {/*                        <option value='50'>50%</option>*/}
            {/*                        <option value='55'>55%</option>*/}
            {/*                        <option value='60'>60%</option>*/}
            {/*                        <option value='65'>65%</option>*/}
            {/*                        <option value='70'>70%</option>*/}
            {/*                        <option value='75'>75%</option>*/}
            {/*                        <option value='80'>80%</option>*/}
            {/*                        <option value='85'>85%</option>*/}
            {/*                        <option value='90'>90%</option>*/}
            {/*                        <option value='95'>95%</option>*/}
            {/*                        /!* Add more options as needed *!/*/}
            {/*                    </select>*/}
            {/*                    /!* adjust the Yes/No dropdown so that it is after the colon (remove the question) and other css styling *!/*/}
            {/*                </div>*/}
            {/*            )}*/}
            {/*        </div>*/}



                    {/*{hasSubmittedOnce && (*/}
                    {/*    <DisplayNotifications*/}
                    {/*        selectedMethods={notifObj.preferredMethod}*/}
                    {/*        selectedHour={notifObj.notifTime}*/}
                    {/*        warningNotificationChoice={warningNotificationChoice}*/}
                    {/*        setWarningNotificationChoice={setWarningNotificationChoice}*/}
                    {/*        percentageThreshold={notifObj.budgetWarning}*/}
                    {/*        hasSubmittedOnce={hasSubmittedOnce}*/}
                    {/*        handleEdit={() => setFormSubmitted(!formSubmitted)}*/}
                    {/*    />*/}
                    {/*    // <button className="edit-button" type="submit" onClick={handleSave}>*/}
                    {/*    //     Save*/}
                    {/*    // </button>*/}
                    {/*)}*/}
                    {/*{!hasSubmittedOnce && (*/}
                    {/*    <button className="submit-button" type="submit" onClick={handleSubmit}>*/}
                    {/*        Submit*/}
                    {/*    </button>*/}
                    {/*)}*/}

                    {/*<button*/}
                    {/*    className="submit-button"*/}
                    {/*    type="submit"*/}
                    {/*    onClick={handleSubmit}*/}
                    {/*>*/}
                    {/*    Submit*/}
                    {/*</button>*/}
{/*                </>*/}
{/*            )}*/}
{/*        </div>*/}
{/*    );*/}
{/*    //}*/}
{/*}*/}

function DisplayNotifications({ selectedMethods, selectedHour, warningNotificationChoice, percentageThreshold, hasSubmittedOnce, handleEdit }) {
    return (
        <div className="notification-container">
            <div className="notification-method-container">
                {/*<div className="ManageNotifications">*/}
                <h3>Selected Notification Method:</h3>
                <div className="notification-method-buttons">
                    {selectedMethods?.map((method) => (
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
                    <h5>{selectedHour}</h5>
                    {/* add am/pm dropdown in this div, and adjust CSS so that time shows right after colon */}
                </div>
            </div>

            <div className="notification-method-container">
                <h3>Selected Budget Limit Warning Notification:</h3>
                <div className="selected-warning-notif-container">
                    {/*<div>*/}
                    {/*    <h5>{warningNotificationChoice}</h5>*/}
                    {/*</div>*/}

                    {warningNotificationChoice === 'Yes' && (

                        <h5> {warningNotificationChoice}, Percentage Threshold: {percentageThreshold}</h5>
                    )}
                    {/* put yes/no right after colon, adjust CSS styling */}
                </div>
            </div>

            <button className="edit-button" onClick={handleEdit}>
                Edit
            </button>

        </div>
    );
}}

export default SetNotifications;
