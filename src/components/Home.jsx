

/****************** modified to match App.cs ***************************** */
import React, { useState } from 'react';
import '../App.css';
import logo from '../BBLogo.png';

/* home page UI */
function Home() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <h1>Welcome to the Home Page!</h1>;
      case 'setMonthlyGoal':
        return <SetMonthlyGoal />;
      case 'categoryBreakdown':
        return <CategoryBreakdown />;
      case 'inputDailySpending':
        return <InputDailySpending />;
      default:
        return <h1>Welcome to the Home Page!</h1>;
    }
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      <nav>
        <ul>
          <li>
            <button className='nav-button' onClick={() => handleNavigation('home')}>Home</button>
          </li>
          <li>
            <button className='nav-button' onClick={() => handleNavigation('setMonthlyGoal')}>Set Monthly Goal</button>
          </li>
          <li>
            <button className='nav-button' onClick={() => handleNavigation('categoryBreakdown')}>Category Breakdown</button>
          </li>
          <li>
            <button className='nav-button' onClick={() => handleNavigation('inputDailySpending')}>Input Daily Spending</button>
          </li>
        </ul>
      </nav>
      
      <div className="page-container"> {/* Added the page-container class */}
        <img src={logo} alt='' />
        <main>{renderPage()}</main>
      </div>
    </div>
  );
}

/* set monthly goal page UI */
function SetMonthlyGoal() {
  return (
    <div>
      <h3>Set Monthly Budget:</h3>
      {/* Add your content for the SetMonthlyGoal component */}
    </div>
  );
}

/* category breakdown page UI */
function CategoryBreakdown() {
  return (
    <div>
      <h2>Category Breakdown</h2>
      {/* Add content and logic for category breakdown */}
    </div>
  );
}

/* input daily spending UI */
function InputDailySpending() {
  return (
    <div>
      <h2>Input Daily Spending</h2>
      {/* Add content and logic for inputting daily spending */}
    </div>
  );
}

export default Home;
/****************** modified to match App.cs ***************************** */