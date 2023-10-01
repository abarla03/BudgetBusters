import logo from './logo.svg';
import './App.css';
import { signInWithGoogle } from './Firebase';

function App() {
  return (
    <div className="App">
      <button class="sign-in-with-google-btn" onClick = {signInWithGoogle}>Sign In With Google</button> 
      <h1>{localStorage.getItem("name")}</h1>
      <h1>{localStorage.getItem("email")}</h1>
      <img src = {localStorage.getItem("profilePic")}/>
    </div>
  ) 
}

export default App;
