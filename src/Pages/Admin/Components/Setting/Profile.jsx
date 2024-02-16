import React, { useState } from 'react';

const Profile = () => {
  // Dummy profile data for demonstration
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '********', // Password is masked for security reasons
  });

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
        <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={profile.password}
          onChange={handleInputChange}
          className="border border-gray-300 px-3 py-2 rounded-md w-full"
        />
      </div>
    </div>
  );
};

export default Profile;
