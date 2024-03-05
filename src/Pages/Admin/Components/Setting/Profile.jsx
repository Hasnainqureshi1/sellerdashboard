import React, { useContext, useEffect, useState } from 'react';
import UpdatePasswordModal from '../Model/UpdatePasswordModal';
import { AppContext } from '../../../../Context/Context';

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { User, checkAuthAndRole, alert } = useContext(AppContext);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
  
  });
useEffect(() => {
  setProfile({
    name:User.displayName,
    email: User.email,
  })
}, [])


  const handleUpdatePassword = (currentPassword, newPassword, confirmPassword) => {
    // Add your logic to update the password
    console.log('Current Password:', currentPassword);
    console.log('New Password:', newPassword);
    console.log('Confirm Password:', confirmPassword);
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
      <div className="mb-4">
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
