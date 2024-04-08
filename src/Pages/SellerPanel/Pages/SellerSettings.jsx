 
import { useNavigate } from "react-router-dom";
 
import React, { useEffect, useState } from "react";
 
import { auth, firestore } from "../../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

const SellerSettings = () => {
  const navigate = useNavigate();
  const [sellerProfile, setSellerProfile] = useState(null); // State to store seller profile

  useEffect(() => {
    const fetchSellerProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const sellerRef = doc(firestore, "users", user.uid); // Reference to the seller's document
      try {
        const docSnap = await getDoc(sellerRef);
        if (docSnap.exists()) {
          console.log(docSnap.data());
          setSellerProfile(docSnap.data()); // Set seller profile if document exists
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching seller profile:", error);
      }
    };

    fetchSellerProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.clear(); // Clears the entire local storage
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="p-2 m-3 bg-slate-100  w-full">
      <h1 className="text-4xl p-3">Setting</h1>
      <div className="mt-3 p-4 border bg-white border-gray-300 rounded shadow-md">
        {sellerProfile && (
          <div>
            <h2 className="text-xl font-semibold">Profile</h2>
            <p>Name: {sellerProfile.name}</p>
            <p>Email: {sellerProfile.email}</p>
            {/* Display more seller information as needed */}
          </div>
        )}
        <div className="w-full py-1 bg-cyan-200 rounded-lg mt-3"></div>
        <button
          className="border-cyan-300 p-3 shadow-md border rounded mt-5"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};


export default SellerSettings;
