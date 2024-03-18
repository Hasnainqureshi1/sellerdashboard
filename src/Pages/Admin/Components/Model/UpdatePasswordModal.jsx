import React, { useState } from 'react';

const UpdatePasswordModal = ({ isOpen, onClose, onUpdatePassword }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdatePassword(currentPassword, newPassword, confirmPassword);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-10 ${
        isOpen ? '' : 'hidden'
      }`}
    >
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white z-10 shadow-md rounded-lg p-8 w-96">
        <h2 className="text-lg font-semibold mb-4">Update Password</h2>
        <form onSubmit={handleSubmit}>
          {/* <div className="mb-4">
            <label htmlFor="currentPassword" className="block mb-1">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div> */}
          <div className="mb-4">
            <label htmlFor="newPassword" className="block mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-cyan-500 text-white px-4 py-2 rounded"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UpdatePasswordModal;