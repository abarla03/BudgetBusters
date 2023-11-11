import React, { useState, useEffect } from 'react';
import { auth } from "../firebase";

function SetNotifications(bool) {
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
    const [isEditMode, setIsEditMode] = useState(false); // Track edit mode

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
                    // selectedMethods={selectedMethods}
                    // selectedHour={selectedHour}
                    // setWarningNotificationChoice={setWarningNotificationChoice}
                    // percentageThreshold={percentageThreshold}
                    // hasSubmittedOnce={hasSubmittedOnce}
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
                            // selectedMethods={selectedMethods}
                            // selectedHour={selectedHour}
                            // setWarningNotificationChoice={setWarningNotificationChoice}
                            // percentageThreshold={percentageThreshold}
                            // hasSubmittedOnce={hasSubmittedOnce}
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
//
//                         <>
//                             {isEditMode ? (
//                                 <p> this form is in edit mode. </p>
//                             ) : (
//                                 <p> this form is not in edit mode </p>
//                             )}
//                         </>
//
//                         <>
//                             <div className="ManageNotifications">
//                                 {/* NOTIFICATION GROUP 1 - METHOD - email, text */}
//                                 <div className="notification-method-container">
//                                     <h3>Select Notification Method:</h3>
//                                     {/* selectable options: */}
//                                     <div className="notification-method-buttons">
//                                         {methods.map((method) => (
//                                             <button
//                                                 key={method}
//                                                 className={`notification-method-button${
//                                                     selectedMethods.includes(method) ? ' selected' : ''
//                                                 }`}
//                                                 onClick={() => handleMethodClick(method)}
//                                             >
//                                                 {method}
//                                             </button>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//
//                             {/* Input Daily Notification Time */}
//                             <div className="notification-method-container">
//                                 <h3>Select Input Daily Spending Notification Time:</h3>
//                                 <div className="select-time">
//                                     <select
//                                         id="selectedHour"
//                                         value={selectedHour}
//                                         onChange={(e) => setSelectedHour(e.target.value)}
//                                     >
//                                         <option value="">Select a time</option>
//                                         <option value="12">12:00</option>
//                                         <option value="12:30">12:30</option>
//                                         <option value="1">1:00</option>
//                                         <option value="1:30">1:30</option>
//                                         <option value="2">2:00</option>
//                                         <option value="2:30">2:30</option>
//                                         <option value="3">3:00</option>
//                                         <option value="3:30">3:30</option>
//                                         <option value="4">4:00</option>
//                                         <option value="4:30">4:30</option>
//                                         <option value="5">5:00</option>
//                                         <option value="5:30">5:30</option>
//                                         <option value="6">6:00</option>
//                                         <option value="6:30">6:30</option>
//                                         <option value="7">7:00</option>
//                                         <option value="7:30">7:30</option>
//                                         <option value="8">8:00</option>
//                                         <option value="8:30">8:30</option>
//                                         <option value="9">9:00</option>
//                                         <option value="9:30">9:30</option>
//                                         <option value="10">10:00</option>
//                                         <option value="10:30">10:30</option>
//                                         <option value="11">11:00</option>
//                                         <option value="11:30">11:30</option>
//                                     </select>
//                                     {/* add am/pm dropdown in this div, and adjust CSS so that dropdown shows right after colon*/}
//                                     <div className="am-pm">
//                                         <select
//                                             id="selectedPeriod"
//                                             value={selectedPeriod}
//                                             onChange={(e) => setSelectedPeriod(e.target.value)}
//                                         >
//                                             <option value="am">am</option>
//                                             <option value="pm">pm</option>
//                                         </select>
//                                     </div>
//                                 </div>
//                             </div>
//
//                             <div className="notification-method-container">
//                                 <h3>Set Budget Limit Warning Notification?</h3>
//                                 <div>
//                                     <select
//                                         id="warningNotificationChoice"
//                                         value={warningNotificationChoice}
//                                         onChange={handleWarningNotificationChange}
//                                     >
//                                         <option value="">Select an option</option>
//                                         <option value="Yes">Yes</option>
//                                         <option value="No">No</option>
//                                     </select>
//                                 </div>
//
//                                 {showPercentageDropdown && (
//                                     <div className="warning-dropdown">
//                                         <label htmlFor="percentageThreshold">Select a percentage threshold:</label>
//                                         <select
//                                             id="percentageThreshold"
//                                             value={percentageThreshold}
//                                             onChange={(e) => setPercentageThreshold(e.target.value)}
//                                         >
//                                             <option value="">Select a percentage</option>
//                                             <option value="50">50%</option>
//                                             <option value="55">55%</option>
//                                             <option value="60">60%</option>
//                                             <option value="65">65%</option>
//                                             <option value="70">70%</option>
//                                             <option value="75">75%</option>
//                                             <option value="80">80%</option>
//                                             <option value="85">85%</option>
//                                             <option value="90">90%</option>
//                                             <option value="95">95%</option>
//                                         </select>
//                                     </div>
//                                 )}
//                             </div>
//                             <button
//                                 className="submit-button"
//                                 type="submit"
//                                 onClick={handleSubmit}
//                             >
//                                 Submit
//                             </button>
//                         </>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// }

// OLD RETURN STATEMENT
//     return (
//         <div className="notification-container">
//             {formSubmitted ? (
//                 <DisplayNotifications
//                     selectedMethods={selectedMethods}
//                     selectedHour={selectedHour}
//                     warningNotificationChoice={warningNotificationChoice}
//                     setWarningNotificationChoice={setWarningNotificationChoice}
//                     percentageThreshold={percentageThreshold}
//                     hasSubmittedOnce={hasSubmittedOnce}
//                     mockNotificationData={mockNotificationData}
//                     handleEdit={() => setFormSubmitted(!formSubmitted)}
//                 />
//             ) : (
//                 <>
//                     <div className="ManageNotifications">
//                         {/* NOTIFICATION GROUP 1 - METHOD - email, text */}
//                         <div className="notification-method-container">
//                             <h3>Select Notification Method:</h3>
//                             {/*selectable options:*/}
//                             <div className="notification-method-buttons">
//                                 {methods.map((method) => (
//                                     <button
//                                         key={method}
//                                         className={`notification-method-button${
//                                             selectedMethods.includes(method) ? ' selected' : ''
//                                         }`}
//                                         onClick={() => handleMethodClick(method)}
//                                     >
//                                         {method}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Input Daily Notification Time */}
//                     <div className="notification-method-container">
//                         <h3>Select Input Daily Spending Notification Time:</h3>
//                         <div className="select-time">
//                             <select
//                                 id="selectedHour"
//                                 value={selectedHour}
//                                 onChange={(e) => setSelectedHour(e.target.value)}
//                             >
//                                 <option value="">Select a time</option>
//                                 <option value="12">12:00</option>
//                                 <option value="12">12:30</option>
//                                 <option value="1">1:00</option>
//                                 <option value="1">1:30</option>
//                                 <option value="2">2:00</option>
//                                 <option value="2">2:30</option>
//                                 <option value="3">3:00</option>
//                                 <option value="2">3:30</option>
//                                 <option value="4">4:00</option>
//                                 <option value="2">4:30</option>
//                                 <option value="5">5:00</option>
//                                 <option value="2">5:30</option>
//                                 <option value="6">6:00</option>
//                                 <option value="2">6:30</option>
//                                 <option value="7">7:00</option>
//                                 <option value="2">7:30</option>
//                                 <option value="8">8:00</option>
//                                 <option value="2">8:30</option>
//                                 <option value="9">9:00</option>
//                                 <option value="2">9:30</option>
//                                 <option value="10">10:00</option>
//                                 <option value="2">10:30</option>
//                                 <option value="11">11:00</option>
//                                 <option value="2">11:30</option>
//
//                             </select>
//                             {/* add am/pm dropdown in this div, and adjust CSS so that dropdown shows right after colon*/}
//
//
//                             <div className="am-pm">
//                                 {/*<label htmlFor="selectedPeriod">Select a time for your daily notification:</label>*/}
//                                 <select
//                                     id="selectedPeriod"
//                                     value={selectedPeriod}
//                                     onChange={(e) => setSelectedPeriod(e.target.value)}
//                                 >
//                                     <option value="am">am</option>
//                                     <option value="pm">pm</option>
//
//                                 </select>
//                             </div>
//
//
//                         </div>
//                     </div>
//
//                     <div className="notification-method-container">
//                         <h3>Set Budget Limit Warning Notification?</h3>
//                         <div>
//                             {/*<label htmlFor="warningNotificationChoice">Do you want to set a Budget Limit Warning*/}
//                             {/*    Notification? </label>*/}
//                             <select
//                                 id="warningNotificationChoice"
//                                 value={warningNotificationChoice}
//                                 onChange={handleWarningNotificationChange}
//                             >
//                                 <option value="">Select an option</option>
//                                 <option value="Yes">Yes</option>
//                                 <option value="No">No</option>
//                             </select>
//                         </div>
//
//                         {showPercentageDropdown && (
//                             <div className="warning-dropdown">
//                                 <label htmlFor="percentageThreshold">Select a percentage threshold:</label>
//                                 <select
//                                     id="percentageThreshold"
//                                     value={percentageThreshold}
//                                     onChange={(e) => setPercentageThreshold(e.target.value)}
//                                 >
//                                     <option value="">Select a percentage</option>
//                                     <option value="50">50%</option>
//                                     <option value="55">55%</option>
//                                     <option value="60">60%</option>
//                                     <option value="65">65%</option>
//                                     <option value="70">70%</option>
//                                     <option value="75">75%</option>
//                                     <option value="80">80%</option>
//                                     <option value="85">85%</option>
//                                     <option value="90">90%</option>
//                                     <option value="95">95%</option>
//                                     {/* Add more options as needed */}
//                                 </select>
//                                 {/* adjust the Yes/No dropdown so that it is after the colon (remove the question) and other css styling */}
//                             </div>
//                         )}
//                     </div>
//
//                     {hasSubmittedOnce && (
//                         <button className="edit-button" type="submit" onClick={handleSave}>
//                             Save
//                         </button>
//                     )}
//                     {!hasSubmittedOnce && (
//                         <button className="submit-button" type="submit" onClick={handleSubmit}>
//                             Submit
//                         </button>
//                     )}
//
//                     {/*<button*/}
//                     {/*    className="submit-button"*/}
//                     {/*    type="submit"*/}
//                     {/*    onClick={handleSubmit}*/}
//                     {/*>*/}
//                     {/*    Submit*/}
//                     {/*</button>*/}
//                 </>
//             )}
//         </div>
//     );
//     //}
// }

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

// OLD RETURN
    // return (
    //     <div className="notification-container">
    //         <div className="notification-method-container">
    //             {/*<div className="ManageNotifications">*/}
    //             <h3>Selected Notification Method:</h3>
    //             <div className="notification-method-buttons">
    //                 {mockNotificationData.preferredMethod?.map((method) => (
    //                     <button
    //                         key={method}
    //                         className="notification-method-button selected"
    //                     >
    //                         {method}
    //                     </button>
    //                 ))}
    //             </div>
    //             {/*</div>*/}
    //         </div>
    //
    //         <div className="notification-method-container">
    //             <h3>Selected Input Daily Spending Notification Time:</h3>
    //             <div>
    //                 <h5>{mockNotificationData.notifTime}</h5>
    //                 {/* add am/pm dropdown in this div, and adjust CSS so that time shows right after colon */}
    //             </div>
    //         </div>
    //
    //         <div className="notification-method-container">
    //             <h3>Selected Budget Limit Warning Notification:</h3>
    //             <div className="selected-warning-notif-container">
    //                 {warningNotificationChoice === 'Yes' && (
    //                     <h5> {warningNotificationChoice}, Percentage Threshold: {mockNotificationData.budgetWarning}</h5>
    //                 )}
    //                 {warningNotificationChoice === 'No' && (
    //                     <h5>{warningNotificationChoice}</h5>
    //                 )}
    //             </div>
    //         </div>
    //
    //         {/*<button className="edit-button" onClick={handleEdit}>*/}
    //         {/*    Edit*/}
    //         {/*</button>*/}
    //         {isEditMode ? (
    //             <button className="edit-button" onClick={handleSave}>
    //                 Save
    //             </button>
    //         ) : (
    //             <button className="edit-button" onClick={handleEdit}>
    //                 Edit
    //             </button>
    //         )}
    //
    //     </div>
    // );
// }

export default SetNotifications;