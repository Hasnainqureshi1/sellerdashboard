import React, { useState } from 'react';

const AddAdmin = () => {
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddAdmin = () => {
    // You can handle adding the new admin here
    console.log('New admin:', newAdmin);
    // Reset the form fields
    setNewAdmin({
      name: '',
      email: '',
      password: ''
    });
  };

  return (
    <div className=" ">
      <h1 className="text-2xl font-bold mb-4">Add Admin</h1>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={newAdmin.name}
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
          value={newAdmin.email}
          onChange={handleInputChange}
          className="border border-gray-300 px-3 py-2 rounded-md w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password</label>
        <input
          type="password"
          id="adminPassword"
          name="password"
          value={newAdmin.password}
          onChange={handleInputChange}
          className="border border-gray-300  px-3 py-2 rounded-md w-full shadow-remove focus:shadow-remove hover:shadow-remove"
        />
      </div>
      <div className="">
        <button
          onClick={handleAddAdmin}
          className="bg-cyan-500 hover:bg-cyan-600 hover:shadow-none focus:shaodw-none focus:border-none hover:border-white text-white font-bold py-2 px-4 rounded"
        >
          Add Admin
        </button>
      </div>
    </div>
  );
};

export default AddAdmin;
