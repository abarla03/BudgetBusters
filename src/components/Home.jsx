

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
          <nav className="nav">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/SetMonthlyGoal">Set Monthly Goal</Link>
              </li>
              <li>
                <Link to="/CategoryBreakdown">Category Breakdown</Link>
              </li>
              <li>
                <Link to="/InputDailySpending">Input Daily Spending</Link>
              </li>
            </ul>
          </nav>
        
          <div className="box">
            
            {/* <Routes>
                <Route path="/SetMonthlyGoal" element={<SetMonthlyGoal />} />
                <Route path="/CategoryBreakdown" element={<CategoryBreakdown />} />
                <Route path="/InputDailySpending" element={<InputDailySpending />} />
                <Route path="/" element={<h1>Welcome to the Home Page!</h1>} />
                <Route path="*" element={<h1>Page not found</h1>} />
            </Routes> */}

          </div>
        </div>
      
    );
  }
  
  export default Home;

