 // SettingsPage.js
import React, { useState } from 'react';
// import ProfileAvatar from './ProfileAvatar'; // Import the ProfileAvatar component
// import AddAdminModal from './AddAdminModal'; // Import the AddAdminModal component

function Setting() {
  const [isOpen, setIsOpen] = useState(false); // State for AddAdminModal visibility

  // Handle form submissions and user state updates (modify according to your backend setup)
  const handleProfilePicChange = (event) => {
    const newImage = event.target.files[0];
    // Update user profile picture
  };
  const handleLogout = () => {
    // Handle logout logic
  };
  const handleAddAdmin = (newUser) => {
    // Add new admin to your user database
    setIsOpen(false); // Close the modal
  };

  return (
    <div className="container mx-auto p-4">
      {/* Profile section */}
      <div className="flex items-center mb-8">
        {/* <ProfileAvatar /> */}
        <div className="ml-4">
          <h2 className="text-2xl font-bold">John Doe</h2>
          <p className="text-gray-500">johndoe@example.com</p>
          <label htmlFor="profile-pic-upload" className="text-blue-500 cursor-pointer">
            Change Profile Picture
          </label>
          <input
            type="file"
            id="profile-pic-upload"
            className="hidden"
            onChange={handleProfilePicChange}
          />
        </div>
      </div>

      {/* Settings sections (modify and add new sections as needed) */}
      <section className="mb-8">
        <h3 className="text-lg font-medium mb-2">Security</h3>
        <div className="flex items-center">
          <p className="mr-4">Change Password</p>
          {/* Replace with PasswordChange component or button */}
        </div>
      </section>
      <section className="mb-8">
        <h3 className="text-lg font-medium mb-2">Notifications</h3>
        <div className="flex items-center">
          <p className="mr-4">Email Notifications</p>
          <label className="toggle-switch">
            <input type="checkbox" checked />
            <span className="slider round"></span>
          </label>
        </div>
      </section>

      {/* More settings and AddAdminModal */}
      {/* ... */}

      <button className="btn btn-primary" onClick={handleLogout}>
        Logout
      </button>

      {/* <AddAdminModal isOpen={isOpen} onClose={() => setIsOpen(false)} onSubmit={handleAddAdmin} /> */}
    </div>
  );
}

export default Setting;

// ProfileAvatar.js (optional)
// ... (implement avatar image and upload functionality)

// AddAdminModal.js (optional)
// ... (implement modal with name, email, role, password fields and submission logic)
