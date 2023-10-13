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

/* category breakdown page UI  */
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

/* profile page UI */
function Profile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [fullName, setFullName] = useState(''); 
  const [email, setEmail] = useState(''); 
  const [age, setAge] = useState('');

  /* function handling the edit mode */
  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };

  /* function handling the saved information from edit */
  const handleSaveClick = () => {
    setFullName(document.getElementById('fullName').value);
    setEmail(document.getElementById('email').value);
    setAge(document.getElementById('age').value);
    setIsEditMode(false);
  };

  return (
    <div>
      <h4>Full Name:</h4>
      {isEditMode ? (
        <input
          id="fullName"
          className="prepopulated-field"
          placeholder="Prepopulated name"
          defaultValue={fullName}
        />
      ) : (
        <h6>{fullName}</h6>
      )}
      <h5>Email:</h5>
      {isEditMode ? (
        <input
          id="email"
          className="prepopulated-field"
          placeholder="Prepopulated email"
          defaultValue={email}
        />
      ) : (
        <h6>{email}</h6>
      )}

      <h5>Age:</h5>
      {isEditMode ? (
        <input
          id="age"
          className="prepopulated-field"
          placeholder="Prepopulated age"
          defaultValue={age}
        />
      ) : (
        <h6>{age}</h6>
      )}
      <div>
        {isEditMode ? (
          <button className='edit-button' onClick={handleSaveClick}>Save</button>
        ) : (
          <button className='edit-button' onClick={handleEditClick}>Edit</button>
        )}
      </div>
    </div>
  );
}

/* manage notifications UI */
function ManageNotifications() {
  return (
    <h2>Manage Notifications</h2>
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
      case 'profile':
        return <Profile/>;
      case 'manageNotifications':
        return <ManageNotifications/>;
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
                <button className='nav-button' onClick={() => handleNavigation('profile')}>Profile</button>
                <button className='nav-button' onClick={() => handleNavigation('manageNotifications')}>Manage Notifications</button>
              </div>
            )}
          </li>
        </ul>
      </nav>
      
      <div class="box">
        <img
          src={logo} 
          alt= '' 
        />

        <main>{renderPage()}</main>
      </div>
    </div>
  );
}

export default App;