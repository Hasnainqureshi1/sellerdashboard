import React, { useEffect, useState } from "react";
import Login from "./Pages/Login";
import { Routes, Route, useNavigate } from "react-router-dom";
import SuperAdmin from './Routes/SuperAdmin';
import { auth, firestore } from "./firebase/config";
import { doc, getDoc } from "firebase/firestore";
import SellerRoute from "./Routes/SellerRoute";
import AppState from "./Context/AppState";
import NotFound from "./Pages/Admin/Container/NotFound";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (!user) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);
   
  return (
    <>
    <AppState>
      <Routes>
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
        <Route path="/" element={<Login setCurrentUser={setCurrentUser} />} />
      {/* if role == admin then superadmin else seller or else login */}
        <Route path="/superadmin/*" element={<SuperAdmin />} />
        <Route path="/sellerPanel/*" element={<SellerRoute />} />
        <Route path="*" element={<NotFound/>} />
      
      </Routes>
      </AppState>
    </>
  );
};

export default App;
