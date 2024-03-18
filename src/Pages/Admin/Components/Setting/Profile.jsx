import React, { useContext, useEffect, useState } from 'react';
import UpdatePasswordModal from '../Model/UpdatePasswordModal';
import { AppContext } from '../../../../Context/Context';
import { reauthenticateWithCredential, updateEmail, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '../../../../firebase/config';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { User, checkAuthAndRole, alert,Showalert } = useContext(AppContext);
  const [token, settoken] = useState( )
  const navigate = useNavigate();
  useEffect(() => {
    User.getIdToken().then((token) => {
      console.log('result')
      console.log(token)
      settoken(token);
    }).
    catch((error) => {
      console.log('error',error);
    });
  
  console.log(token);
   }, [ ])
  const [profile, setProfile] = useState({
    name: '',
    email: '',
  
  });
  useEffect(() => {
    setProfile({
      name: User.displayName || '',
      email: User.email || '',
    });
  }, [User]);
const handleUpdateProfile = async () => {
  try {
    
      const response = await fetch(`http://localhost:5000/api/auth/update-admin-profile`, {
        method: "PUT",
        headers: {
          authorization: token,
          "Content-Type": "application/json", 
         
        },
        body: JSON.stringify({
          email:profile.email,
          name: profile.name,
          uid:User.uid,
          
        })
      });
      if (response.ok) {
        const json = await response.json();
        console.log(json);
   
     
    
      
    Showalert("'Profile updated successfully","green");

       // setalert(false);
       console.log('New seller added successfully!');
    
       setTimeout(async() => {
               // Sign out the user from Firebase
               await auth.signOut();
               // Clear local storage
              
             localStorage.removeItem("userRole");
             localStorage.removeItem("userId");
             // Navigate to the login page
             navigate('/login');
       }, 3000);
      }
     

   
  } catch (error) {
    console.error('Error updating profile:', error.message);
    
  }
};

  const handleUpdatePassword = async(currentPassword, newPassword, confirmPassword) => {
    // Add your logic to update the password
    console.log('Current Password:', currentPassword);
    console.log('New Password:', newPassword);
    console.log('Confirm Password:', confirmPassword);
  if(newPassword == confirmPassword) {
    try {
    
      const response = await fetch(`http://localhost:5000/api/auth/update-admin-password`, {
        method: "PUT",
        headers: {
          authorization: token,
          "Content-Type": "application/json", 
         
        },
        body: JSON.stringify({
          password:newPassword, 
          uid:User.uid,
          
        })
      });
      if (response.ok) {
        const json = await response.json();
        console.log(json);
   
     
    
      
    Showalert("Password updated successfully","green");
 
    
       setTimeout(async() => {
               // Sign out the user from Firebase
               await auth.signOut();
               // Clear local storage
              
             localStorage.removeItem("userRole");
             localStorage.removeItem("userId");
             // Navigate to the login page
             navigate('/login');
       }, 3000);
      }
     

   
  } catch (error) {
    console.error('Error updating profile:', error.message);
    
  }
  } 
  else{
    Showalert("Password does not match","red")
  } 
    // Close the modal
    setIsModalOpen(false);
  };

  // Function to handle changes in input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  return (
    <div className=" ">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={profile.name}
          onChange={handleInputChange}
          className="border border-gray-300 px-3 py-2 rounded-md w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={profile.email}
          onChange={handleInputChange}
          className="border border-gray-300 px-3 py-2 rounded-md w-full"
        />
      </div>
      
      <div className="mb-4 flex ">
      <button
        className="bg-cyan-500 mr-3 text-white px-4 py-2 rounded"
        onClick={() => handleUpdateProfile()}
      >
        Update Profile
      </button>
      <button
        className="bg-cyan-500 text-white px-4 py-2 rounded"
        onClick={() => setIsModalOpen(true)}
      >
        Update Password
      </button>
      <UpdatePasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdatePassword={handleUpdatePassword}
      />
      </div>
    </div>
  );
};

export default Profile;
