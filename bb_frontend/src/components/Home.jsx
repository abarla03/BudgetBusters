/****************** modified to match App.cs ***************************** */
import React from 'react';
import '../App.css';
import logo from '../BBLogo.png';
import { Route, Routes, Link  } from 'react-router-dom';
import SetMonthlyGoal from './SetMonthlyGoal'; // Import your components
import CategoryBreakdown from './CategoryBreakdown'; // Import your components
import InputDailySpending from './InputDailySpending';
import {useState, useEffect} from "react";
import Register from "./auth/Register";
import {auth} from "../firebase"; // Import your components

function Home() {
    const user = auth.currentUser;
    const userEmail = user ? user.email : "";

    // return (
    //     <div className="App">
    //         <h3>Welcome to the Home Page!</h3>
    //     </div>
    // );
    const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

    useEffect(() => {
        // Check if the user has just registered
        const justRegistered = localStorage.getItem('justRegistered');

        if (justRegistered) {
            // If the user just registered, show the welcome message
            setShowWelcomeMessage(true);

            // Clear the flag to prevent showing the welcome message again
            localStorage.removeItem('justRegistered');
        }
    }, []);

    return (
        <div className="App">
            {showWelcomeMessage ? (
                <div>
                    <h3>Welcome to the Home Page, {userEmail}!</h3>
                    <p>Here are instructions for how to use the app.</p>
                </div>
            ) : (
                <h3>Welcome to the Home Page!</h3>
            )}
        </div>
    );
}

export default Home;

