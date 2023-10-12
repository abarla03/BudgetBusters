import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AuthDetails from './components/AuthDetails';
import Home from './components/Home';
//import { categories } from "./predefinedCategories";

function App() {

  return (

    <Router>

      <div className="App">
        <Routes> {/* Use Routes here */}
          <Route path="/login" element={<Login  />} />
          <Route path="/register" element={<Register  />} />
          <Route path="/home" element={<Home />} /> {/* New route for the home page */}
          <Route path="/" element={<Login />} />
        </Routes>
        <AuthDetails />
      </div>
    </Router>

  );
}



export default App;
