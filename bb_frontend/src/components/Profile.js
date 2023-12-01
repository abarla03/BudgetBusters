import React, { useState } from 'react';
import '../App.css';
import { useNavigate  } from 'react-router-dom';
import { deleteAccount } from '../firebase';
import { useEffect } from "react";
import 'firebase/auth';
import { auth } from "../firebase";
import {post, put, get} from "./ApiClient";

function CreateProfile() {
    const user = auth.currentUser;
    const firebaseEmail = user ? user.email : "";
    const firebaseDisplayName = firebaseEmail.match(/([^@]+)/)[0];

    const [userObj, setUserObj] = useState({});
    const [userUpdated, setUserUpdated] = useState(false); // to re-fetch budget info whenever update happens

    /* obtaining user object from user profile input */
    useEffect(() => {
        function fetchUserData() {
            let data;
            try {
                // Make the GET request to retrieve the user
                data = get(`/getUser/${firebaseEmail}`)
            } catch (error) {
                console.error("Error creating or fetching user:", error);
            }
            return data;
        }
        fetchUserData().then((response) => {
            setUserObj(response.data);
        });
        setUserUpdated(false)
    }, [firebaseEmail, userUpdated]);
    
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneValidationMessage, setPhoneValidationMessage] = useState('');
    const [isProfileSubmitted, setIsProfileSubmitted] = useState(Boolean(localStorage.getItem(`profileInfo_${firebaseEmail}`)));
    const [validationMessage, setValidationMessage] = useState('');

    /* populate name and email fields from data inputted in login process */
    useEffect (() => {
        setFullName(firebaseDisplayName);
        setEmail(firebaseEmail);
    }, []);

    /* function handling a change in the age field */
    const handleAgeInputChange = (event) => {
        const value = event.target.value;
        setAge(value);

        // use regular expression to check if the input is a valid integer
        const isValidInteger = /^[0-9]*$/.test(value);

        if (!isValidInteger) {
            setValidationMessage('Please enter a valid integer.');
        } else {
            setValidationMessage('');
        }
    }

    /* function handling a change in the phone field */
    const handlePhoneInputChange = (event) => {
        const value = event.target.value;
        setPhone(value);

        /* check if inputted phone number contains all numbers and has a length of exactly 10 */
        const numericRegex = /^[0-9]*$/;
        if (!(value.length === 10 && numericRegex.test(value))) {
            setPhoneValidationMessage('Please enter a valid phone number. A valid phone number has 10 digits.');
        } else {
            setPhoneValidationMessage('');
        }
    }

    /* function handling delete account functionality */
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

    /* function handling profile information submission */
    const handleSubmit = async () => {
        setIsProfileSubmitted(true);
        localStorage.setItem(`profileInfo_${firebaseEmail}`, JSON.stringify(user));
        const userInfo = {
            fullName: fullName,
            email: firebaseEmail,
            age: age,
            phoneNumber: phone
        }
        const createUserResponse = await put('/updateUser', userInfo);
        setUserUpdated(true)
    };

    return (
        <div>
            {isProfileSubmitted ?
                <DisplayProfile
                    firebaseDisplayName={firebaseDisplayName}
                    firebaseEmail={firebaseEmail}
                    fullName={fullName}
                    setFullName={setFullName}
                    email={email}
                    setEmail={setEmail}
                    setAge={setAge}
                    setPhone={setPhone}
                    handleDeleteAccount={handleDeleteAccount}
                    setUserUpdated={setUserUpdated}
                    userObj={userObj}
                />
                : (
                    <div>
                        <h5> Name:
                            <input value={fullName} onChange={(e) => setFullName(e.target.value)}/>
                        </h5>

                        <h5> Email:
                            <input value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </h5>

                        <h5>Age:
                            <input
                                value={age}
                                onChange={handleAgeInputChange}
                                type="text"
                                id="age"
                                placeholder="Enter your age"
                                name="age"
                            />
                        </h5>
                        <p className="error-message9">{validationMessage}</p>

                        <h5>Phone number:
                            <input
                                value={phone}
                                onChange={handlePhoneInputChange}
                                type="text"
                                id="phone"
                                placeholder="Enter your phone number"
                                name="phone"
                            />
                        </h5>
                        <p className="error-message10">{phoneValidationMessage}</p>

                        <button
                            className="edit-button"
                            onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                )}

            <button className="submit-button"
                    onClick={handleDeleteAccount}>
                Delete Account
            </button>
        </div>
    );
}

function DisplayProfile({firebaseDisplayName, firebaseEmail, setFullName, setEmail, fullName, email, setAge, setPhone,
                            handleDeleteAccount, setUserUpdated, userObj}) {

    const [isEditMode, setIsEditMode] = useState(false);
    const [editFullName, setEditFullName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPhone, setEditPhone] = useState(userObj ? userObj.phoneNumber : '');
    const [editAge, setEditAge] = useState(userObj ? userObj.age : '');
    const [invalidAgeError, setInvalidAgeError] = useState('');
    const [invalidPhoneError, setInvalidPhoneError] = useState('');

    /* function handling a change in the age field */
    const handleAgeInputChange = (event) => {
        const value = event.target.value;
        setEditAge(value);

        // use regular expression to check if the input is a valid integer
        const isValidInteger = /^[0-9]*$/.test(value);

        if (!isValidInteger) {
            setInvalidAgeError('Please enter a valid integer.');
        } else {
            setInvalidAgeError('');
        }
    }

    /* function handling a change in the phone field */
    const handlePhoneInputChange = (event) => {
        const value = event.target.value;
        setEditPhone(value);

        /* check if inputted phone number contains all numbers and has a length of exactly 10 */
        const numericRegex = /^[0-9]*$/;
        if (!value) {
            setInvalidPhoneError('');
        } else if (!(value.length === 10 && numericRegex.test(value))) {
            setInvalidPhoneError('Please enter a valid phone number. A valid phone number has 10 digits.');
        } else {
            setInvalidPhoneError('');
        }
    }

    const populateProfileData = () => {
        setFullName(firebaseDisplayName);
        setEmail(firebaseEmail);

        setEditFullName(firebaseDisplayName);
        setEditEmail(firebaseEmail);
        setEditAge(userObj.age);
        setEditPhone(userObj.phoneNumber);
    }

    /* call the appropriate method to populate fields */
    useEffect (() => {
        populateProfileData();
    }, []);

    /* function handling the edit mode */
    const handleEditClick = () => {
        populateProfileData();
        setIsEditMode(true);
    };

    const handleSaveClick = async () => {
        setIsEditMode(false);
        setFullName(editFullName);
        setEmail(editEmail);
        setAge(editAge);
        setPhone(editPhone);
        window.alert("User Profile Information Modified.")

        const updatedUserInfo = {
            fullName: editFullName,
            email: firebaseEmail,
            age: editAge,
            phoneNumber: editPhone
        }

        const updatedUserResponse = await put('/updateUser', updatedUserInfo);
        setUserUpdated(true);
    };

    return (
        <div>
            <h5>Name: {isEditMode ? <input value={editFullName} onChange={(e) => setEditFullName(e.target.value)} /> : fullName}</h5>
            <h5>Email: {isEditMode ? <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} /> : email}</h5>

            <h5>Age:
                {isEditMode ? (
                    <input
                        value={editAge}
                        onChange={handleAgeInputChange}
                        type="text"
                        id="age"
                        placeholder="Enter your age"
                        name="age"
                    />
                ) : (
                    <span>{userObj.age}</span>
                )}
            </h5>
            <p className="error-message9">{invalidAgeError}</p>

            <h5>Phone number:
                {isEditMode ? (
                    <input
                        value={editPhone}
                        onChange={handlePhoneInputChange}
                        type="text"
                        id="phone"
                        placeholder="Enter your phone number"
                        name="phone"
                    />
                ) : (
                    <span>{userObj.phoneNumber}</span>
                )}
            </h5>
            <p className="error-message10">{invalidPhoneError}</p>

            <div>
                {isEditMode ? (
                    <div>
                        <button className='edit-button' onClick={handleSaveClick}>Save</button>
                    </div>
                ) : (
                    <div>
                        <button className='edit-button' onClick={handleEditClick}>Edit</button>
                    </div>
                )}
            </div>

            <button className="submit-button" onClick={handleDeleteAccount}>Delete Account</button>
        </div>
    );
}

export default CreateProfile;