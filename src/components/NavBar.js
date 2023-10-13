import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import settingsIcon from './SettingsIcon.png';


function NavigationBar({ visiblePaths }) {
  const location = useLocation();
  const shouldDisplay = visiblePaths.includes(location.pathname);

  return shouldDisplay ? (
    <nav className="nav">
      <ul>
        <li>
          <button className='nav-button'>
            <Link to="/Home">Home</Link>
          </button>
        </li>
        <li>
          <button className='nav-button'>
            <Link to="/SetMonthlyGoal">Set Monthly Goal</Link>
          </button>
        </li>
        <li>
          <button className='nav-button'>
            <Link to="/CategoryBreakdown">Category Breakdown</Link>
          </button>
        </li>
        <li>
          <button className='nav-button'>
            <Link to="/InputDailySpending">Input Daily Spending</Link>
          </button>
        </li>
        <li className = "nav-settings">
            <button className="settings-button" >
                <img src={settingsIcon} alt = ''/>
            </button>
        </li>
      </ul>
    </nav>
  ) : null;
}

export default NavigationBar;

// import React from 'react';
// import { Link } from 'react-router-dom';

// function NavBar() {
//   return (
//     <nav className="nav">
//       <ul>
//         <li>
//           <button className='nav-button'>
//             <Link to="/">Home</Link>
//           </button>
//         </li>
//         <li>
//           <button className='nav-button'>
//             <Link to="/SetMonthlyGoal">Set Monthly Goal</Link>
//           </button>
//         </li>
//         <li>
//           <button className='nav-button'>
//             <Link to="/CategoryBreakdown">Category Breakdown</Link>
//           </button>
//         </li>
//         <li>
//           <button className='nav-button'>
//             <Link to="/InputDailySpending">Input Daily Spending</Link>
//           </button>
//         </li>
//       </ul>
//     </nav>
//   );
// }

// export default NavBar;