/****************** modified to match App.cs ***************************** */
import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import { onAuthStateChanged} from "firebase/auth";
import { auth } from "../firebase";
import '../App.css';
import logo from '../BBLogo.png';
import { Route, Routes, Link  } from 'react-router-dom';
import SetMonthlyGoal from './SetMonthlyGoal'; // Import your components
import CategoryBreakdown from './CategoryBreakdown'; // Import your components
import InputDailySpending from './InputDailySpending'; // Import your components

function Home() {
    console.log("Home component is rendering.");
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="App">
            { user ? (
                <h3>Welcome to the Home Page, {user.displayName}!</h3>
            ) : (
                <h3>Welcome to the Home Page!</h3>
            )}
        </div>
    );
}

export default Home;

