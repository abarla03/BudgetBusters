import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import settingsIcon from './SettingsIcon.png';
import notifications from './images/envelope.png'
import logout from './images/log-out.png'
import profile from './images/user.png'
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/app';
import { auth } from '../firebase'

function NavigationBar({ visiblePaths }) {

    const location = useLocation();
    const shouldDisplay = visiblePaths.includes(location.pathname);
    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = React.useState('home');
    const navigate = useNavigate();

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
            if(menuRef.current && !menuRef.current.contains(e.target)){
                setOpen(false);
                console.log(menuRef.current);
            }
        };

        document.addEventListener("mousedown", handler);

        return() => {
            document.removeEventListener("mousedown",handler)
        }
    });

    const handleOptionClick = (path) => {
        navigate(path);
    };

    const handleSignOut = () => {
        auth.signOut()
            .then(() => {
                console.log("sign out successful");
                navigate('/login');
            })
            .catch((error) => {
                console.log("oops error");
            })
    };

    return shouldDisplay? (
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
                        <ul className = 'dropdownItem'>
                            <li>
                                <img src = {profile} alt = '' />
                                <button_dropdown onClick={() => handleOptionClick('/Profile')}>Profile</button_dropdown>
                            </li>

                            <li>
                                <img src = {notifications} alt = '' />
                                <button_dropdown onClick={() => handleOptionClick('/ManageNotifications')}>Notifications</button_dropdown>
                            </li>

                            <li>
                                <img src = {logout} alt = '' />
                                <button_dropdown onClick={() => handleSignOut()}>Logout</button_dropdown>
                            </li>

                        </ul>
                    </div>
                </div>
            </ul>
        </nav>
    ) : <> </>;
}

export default NavigationBar;