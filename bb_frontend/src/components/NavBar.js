import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import settingsIcon from './SettingsIcon.png';
import notifications from './images/envelope.png'
import logout from './images/log-out.png'
import profile from './images/user.png'
import DropDownSettings from "./DropDownSettings";


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




    return (
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

                <div className='nav-settings' >
                    <div className='menu-trigger' >
                        <img src={settingsIcon} alt = ''/>
                    </div>

                    <div className = 'dropdown-menu'>
                        <ul>
                            <DropDownItem img = {profile} text = {"Profile"}/>
                            <DropDownItem img = {notifications} text = {"Notifications"}/>
                            <DropDownItem img = {logout} text = {"Log Out"}/>

                        </ul>

                    </div>

                </div>
            </ul>
        </nav>
    );
}

function DropDownItem(props) {
    return (
        <li className = 'dropdownItem' >
            <img src = {props.img}></img>
            <a> {props.text} </a>
        </li>

    )

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
