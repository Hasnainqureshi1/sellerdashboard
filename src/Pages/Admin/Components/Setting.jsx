 import React from 'react'
import Tabs from '../SubComponents/Tabs'
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase/config';
 
 const Setting = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      
        // Sign out the user from Firebase
        await auth.signOut();
        // Clear local storage
      localStorage.removeItem("userRole");
      localStorage.removeItem("userRole");
      localStorage.removeItem("firebaseUser");
      // Navigate to the login page
      navigate('/login');
     
 
      
        
   

      

      
    } catch (error) {
      console.error("Error logging out:", error);
      // Handle error if needed
    }
  };
   return (
     <>
        <div className='p-2 m-3 bg-slate-100 lg:w-80v  '>
      <h1 className=' text-4xl p-3 '>Setting</h1>
      <div className="     mt-3 p-4 border bg-white border-gray-300 rounded shadow-md">
       <Tabs/>
       <div className='w-full py-1  bg-cyan-200 rounded-lg mt-3'></div>
       <button
        className='border-cyan-300 p-3 shadow-md border rounded mt-5'
        onClick={handleLogout}
      >
        Logout
       </button>
      </div>
     </div>
     </>
   )
 }
 
 export default Setting