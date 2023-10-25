import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import settingsIcon from './SettingsIcon.png';


function NavigationBar({ visiblePaths }) {
    const location = useLocation();
    const shouldDisplay = visiblePaths.includes(location.pathname);

    const [currentPage, setCurrentPage] = React.useState('home');

    const handleNavigation = (page) => {
        setCurrentPage(page);
    };

    /* handle settings dropdown */
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    return shouldDisplay ? (
        <nav className="nav">
            <ul>
                <li>
                    <button className='nav-button'>
                        <Link to="/home">Home</Link>
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
                    <button className="settings-button" onClick={toggleDropdown}>
                        <img src={settingsIcon} alt = ''/>
                    </button>
                    {isDropdownVisible && (

                        <div className="dropdown-content">
                            <button className='nav-button' >
                                <Link to = "/Profile">Profile</Link>
                            </button>
                            <button className='nav-button' >
                                <Link to = "/ManageNotifications">Manage Notifications</Link>
                            </button>
                        </div>
                    )}
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
