import React, { useState } from 'react';
import './App.css';
import logo from './BBLogo.png';
import settingsIcon from './SettingsIcon.png';

/* home page UI */
function Home() {
  return (
    <section id="home">
    </section>
  )
}

/* set monthly goal page UI */
function SetMonthlyGoal() {
  return (
    <div>
      <h3>Set Monthly Budget:</h3>
      <input type="text" placeholder="Enter your budget" />
      <h3>Select Categories:</h3>
      <h3>Create Categories:</h3>

      <button className='submit-button' type="submit">Submit</button>
    </div>
  )
}

/* category breakdown page UI */
function CategoryBreakdown() {
  return (
    <h2>category breakdown</h2>
  )
}

/* input daily spending UI */
function InputDailySpending() {
  return (
    <h2>input daily spending</h2>
  )
}

/* handle rendering of pages and options */
function App() {
  const [currentPage, setCurrentPage] = React.useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home/>;
      case 'setMonthlyGoal':
        return <SetMonthlyGoal/>;
      case 'categoryBreakdown':
        return <CategoryBreakdown/>;
      case 'inputDailySpending':
        return <InputDailySpending/>;
      default:
        return <Home/>;
    }
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  /* handle settings dropdown */
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  /* return home page structure */
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
          <li className="nav-settings">
            <button className="settings-button" onClick={toggleDropdown}>
              <img src={settingsIcon} alt = ''/>
            </button>
            {isDropdownVisible && (
              <div className="dropdown-content">
                <button className='nav-button' onClick={() => { }}>
                  <h2>Profile</h2>
                </button>
                <button className='nav-button' onClick={() => { }}>
                  <h2>Manage Notifications</h2>
                </button>
              </div>
            )}
          </li>
        </ul>
      </nav>
      
      <div class="box">
        <img
          src={logo} alt = ''
        />

        <main>{renderPage()}</main>
      </div>
    </div>
  );
}

export default App;