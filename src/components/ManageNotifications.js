import React from 'react';
import '../App.css';
import logo from '../BBLogo.png';
import { Route, Routes, Link  } from 'react-router-dom';
import SetMonthlyGoal from './SetMonthlyGoal'; // Import your components
import CategoryBreakdown from './CategoryBreakdown'; // Import your components
import InputDailySpending from './InputDailySpending'; // Import your components

function ManageNotifications() {
    console.log("Manage Notifications component is rendering.");

    return (
      <div className="ManageNotifications">
      <h3>Welcome to the Manage Notifications Page!</h3>
      </div>
    );
  }
  
  export default ManageNotifications;

 