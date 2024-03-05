import "../style/style.css";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useNavigate } from "react-router-dom";
import firebase from "firebase/app";
import { auth, firestore } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
 
import { AppContext } from "../Context/Context";

const Login = ({ setCurrentUser }) => {
    const { User, authenticateUser,checkAuthAndRole } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
 
authenticateUser(email,password,navigate)
      // Update currentUser state in App component
    
  }
  useEffect(() => {
const role = localStorage.getItem('userRole');
const userId = localStorage.getItem('userId');
 
        if (role =='admin'){
            navigate('/superadmin')
          }
          else if (role =='seller'){

          }
          else{
        
          }
        
 
     
  }, []);
  return (
    <div className="logincontainer">
      <div className="login-form">
        <h1>Login</h1>
        <form action="">
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              className="form-control"
              id="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="submit"
              onClick={handleLogin}
              placeholder="Login"
              value="Login"
              className="form-control"
              id="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
