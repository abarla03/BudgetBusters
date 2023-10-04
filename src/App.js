import React, { useState } from 'react';
import './App.css';
import logo from './BBLogo.png';

/* home page UI */
function Home() {
  return (
    <section id="home">
    </section>
  )
}

/* set monthly goal page UI */
function SetMonthlyGoal() {
  const [budget, setBudget] = useState('');
  const [error, setError] = useState('');

  const handleBudgetChange = (event) => {
    const inputBudget = event.target.value;
    // Regular expression to check if the input contains only numerical characters
    const numericRegex = /^[0-9]*$/;

    if (numericRegex.test(inputBudget)) {
      setBudget(inputBudget);
      setError('');
    } else {
      setBudget(inputBudget);
      setError('Please enter a valid numerical budget.');
    }
  };

  const handleSubmit = () => {
    // Add your submission logic here, for example, sending the budget to a server.
    // This function is called when the "Submit" button is clicked.
  };

  return (
    <div>
      <h3>Set Monthly Budget:</h3>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter your budget"
          value={budget}
          onChange={handleBudgetChange}
        />
        {error && <p className="error-message">{error}</p>}
      </div>
      <h3>Select Categories:</h3>
      <h3>Create Categories:</h3>

      <button 
        className='submit-button'
        type="submit"
        onClick={handleSubmit}
        disabled={error !== ''}>
        Submit
      </button>
    </div>
  );
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