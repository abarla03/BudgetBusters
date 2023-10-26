import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AuthDetails from './components/AuthDetails';
import Home from './components/Home';
import SetMonthlyGoal from "./components/SetMonthlyGoal";
import InputDailySpending from "./components/InputDailySpending";
import CategoryBreakdown from "./components/CategoryBreakdown";
import Profile from "./components/Profile";
import ManageNotifications from "./components/ManageNotifications";
import NavBar from './components/NavBar';
import logo from './BBLogo.png';

//changes from IntelliJ ult. setup (flag)

function App() {
    return (
        <Router>
            <div className="App">
                <NavBar visiblePaths={['/home', '/SetMonthlyGoal', '/CategoryBreakdown', '/InputDailySpending', '/Profile', '/ManageNotifications']} />
                <img src={logo} width = '20%'/>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/SetMonthlyGoal" element={<SetMonthlyGoal />} />
                    <Route path="/CategoryBreakdown" element={<CategoryBreakdown />} />
                    <Route path="/InputDailySpending" element={<InputDailySpending />} />
                    <Route path="/Profile" element={<Profile />} />
                    <Route path="/ManageNotifications" element={<ManageNotifications />} />
                    <Route path="/" element={<Login />} />
                </Routes>
                <AuthDetails />
            </div>
        </Router>
    );
}

export default App;