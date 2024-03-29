import { useEffect, useState } from "react";
import { AppContext } from "./Context";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, firestore } from "../firebase/config";

const AppState = (props) => {
  
  const [User, setUser] = useState([]);
  const [userRole, setUserRole] = useState();
  const checkTokenExpiration = async () => {
    const user = auth.currentUser;
    console.log(user)
    if (user) {
      try {
        const tokenResult = await user.getIdTokenResult();
        const expirationTime = tokenResult.expirationTime;
        console.log(expirationTime)
        // Get current time in milliseconds
        const currentTime = new Date().getTime();

        // Check if token is expired
        if (expirationTime < currentTime) {
          // Token is expired, refresh it
          await user.getIdToken(/* forceRefresh */ true);
          // Token refreshed successfully
          console.log('Token refreshed successfully');
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
        // Handle error refreshing token
      }
    }
  };

  const checkAuthAndRole = async () => {
    try {
      const user = await auth.currentUser; // Get the current user
      if (user) {
        console.log(user)
        setUser(user);
        const token = await user.getIdToken();
        const { role, error } = await VerifyuserRole(token);

        console.log(role);

        return role; // Return the user's role
      } else {
        // User is not signed in
        console.log("user");
        return null;
      }
    } catch (error) {
      console.error("Error checking authentication and role:", error);

      return null;
    }
  };

  const authenticateUser = async (email, password, navigate) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user =await userCredential.user;

      if (user) {
        const token = await user.getIdToken();

        const { role, error } = await VerifyuserRole(token);
        //if user is not authorized return error
        if (error) {
          alert(error);
          return;
        }
        // After successful authentication and role verification
localStorage.setItem("userRole", role);
 
// Optional: Store user ID
localStorage.setItem("userId", user.uid);

        if (role === "admin") {
          navigate("/superadmin");
        }
         else  if (role === "seller") {
          navigate("/sellerPanel"); // Redirect to regular user page or default route
        }
        else{
          navigate("/");
        }
      }
    } catch (error) {
      alert("Please enter correct credentials");
      console.error("Error signing in:", error);
    }
  };
  const VerifyuserRole = async (userToken) => {
    console.log("Verifying");
    try {
      const response = await fetch(`http://localhost:5000/api/auth/user-role`, {
        method: "POST",
        headers: {
          authorization: userToken,
          "Content-Type": "application/json",
        },
      });
      if (!response.status == 200) {
        const error = response;

        return error;
      }

      const json = await response.json();
      console.log(json);
      return json;
    } catch (error) {
      console.log("unauthorized");
      console.log(error.message);
    }
  };

  // Alert 
  const [topalert, setAlert] = useState(null);
  const Showalert = (msg,type) => {
    setAlert({
      message: msg,
      type: type,
    })

    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };


  

  return (
    <AppContext.Provider value={{authenticateUser,checkTokenExpiration,Showalert,setAlert,topalert, User,checkAuthAndRole}}>
      {props.children}
    </AppContext.Provider>
  );
};
export default AppState;
