import React, { useState } from "react";
import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AuthDetails from './components/AuthDetails';



function App() {

  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }

  return (


    <div className="App"> 
    {
      currentForm === "login" ? <Login onFormSwitch={toggleForm}/> : <Register onFormSwitch={toggleForm}/> 
    }
      
    <AuthDetails />  
     
  </div>


    /*
    <div className="App">
      <Login />
      <Register/>
      <AuthDetails />
    </div>
    */
  );
}

export default App;
