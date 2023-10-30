import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import settingsIcon from './SettingsIcon.png';
import notifications from './images/envelope.png'
import logout from './images/log-out.png'
import profile from './images/user.png'



function NavigationBar({ visiblePaths }) {
    const location = useLocation();
    const shouldDisplay = visiblePaths.includes(location.pathname);

    const [open, setOpen] = useState(false);

    const [currentPage, setCurrentPage] = React.useState('home');

    const handleNavigation = (page) => {
        setCurrentPage(page);
    };

    /* handle settings dropdown */
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    let menuRef = useRef();

    useEffect(() => {
        let handler = (e)=>{
            if(!menuRef.current.contains(e.target)){
                setOpen(false);
                console.log(menuRef.current);
            }
        };

        document.addEventListener("mousedown", handler);

        return() => {
            document.removeEventListener("mousedown",handler)
        }
    });


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

                <div className='menu-container' ref={menuRef}>
                    <div className='menu-trigger' onClick={()=>{setOpen(!open)}}>
                        <img src={settingsIcon} alt = ''/>
                    </div>

                    <div className={`dropdown-menu ${open? 'active' : 'inactive'}`} >
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
    );
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
