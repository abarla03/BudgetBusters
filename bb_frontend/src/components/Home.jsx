

/****************** modified to match App.cs ***************************** */
import React from 'react';
import '../App.css';
import logo from '../BBLogo.png';
import { Route, Routes, Link  } from 'react-router-dom';
import SetMonthlyGoal from './SetMonthlyGoal'; // Import your components
import CategoryBreakdown from './CategoryBreakdown'; // Import your components
import InputDailySpending from './InputDailySpending'; // Import your components

function Home() {
    console.log("Home component is rendering.");

    return (
        <div className="App">
            <h3>Welcome to the Home Page!</h3>
        </div>
    );
}

export default Home;

