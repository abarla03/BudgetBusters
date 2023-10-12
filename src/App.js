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
//import { categories } from "./predefinedCategories";

function App() {
  //console.log("SetMonthlyGoal component is rendering.")
  return (

    <Router>

      <div className="App">
        <Routes> {/* Use Routes here */}
          <Route path="/login" element={<Login  />} />
          <Route path="/register" element={<Register  />} />
          <Route path="/home" element={<Home />} /> {/* New route for the home page */}
          <Route path="/SetMonthlyGoal" element={<SetMonthlyGoal />} />
          <Route path="/CategoryBreakdown" element={<CategoryBreakdown />} />
          <Route path="/InputDailySpending" element={<InputDailySpending />} />
          <Route path="/" element={<Login />} />
        </Routes>
        <AuthDetails />
      </div>
    </Router>

  );
}



export default App;
