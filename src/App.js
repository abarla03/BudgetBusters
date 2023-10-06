import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AuthDetails from './components/AuthDetails';
import Home from './components/Home';

/* 
* 10/6 DAY CHANGES
*/

function App() {

  //const [currentForm, setCurrentForm] = useState('login'); 10/6
  //const [currentForm, setCurrentForm] = useState(null);
  

  // const toggleForm = (formName) => {
  //   setCurrentForm(formName);
  // }

  /* 10/6 */
  
  /* 10/6 */

  return (

    // <div className="App"> 
    // {
    //   currentForm === "login" ? <Login onFormSwitch={toggleForm}/> : <Register onFormSwitch={toggleForm}/> 
    // }
      
    // <AuthDetails />  
     
    // </div>

    <Router>
      {/* <div className="App"> 
        <Switch>
          <Route path="/login">
            <Login onFormSwitch={toggleForm} />
          </Route>
          <Route path="/register">
            <Register onFormSwitch={toggleForm} />
          </Route>
          <Route path="/">
          {currentForm === "login" ? (
              <Login onFormSwitch={toggleForm} />
            ) : (
              <Register onFormSwitch={toggleForm} />
            )}
          </Route>
        </Switch>
        <AuthDetails />
      </div> */}

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
/*
    <div className="App">
      <Login />
      <Register/>
      <AuthDetails />
    </div>
    */
export default App;
