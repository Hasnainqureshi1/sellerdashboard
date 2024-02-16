import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app, firestore } from '../../../firebase/config'; // Import firestore from firebase config
import { collection, addDoc } from "firebase/firestore"; 
const AddSellerModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [password, setPassword] = useState('');

  const handleCreate = () => {
    const auth = getAuth(app);
    
    // Create a new user with email and password
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
          
        // Set additional data for the seller in Firestore
        const userRef = // Create a reference to the user document
        userRef.set({
          name: name,
          shopName: shopName,
          email:email,
          isSeller:true
        })
        .then(() => {
          console.log('User created:', user);
          console.log('Additional data added to Firestore:', { name, shopName });
          onClose(); // Close the modal after user creation
        })
        .catch((error) => {
          console.error('Error adding additional data to Firestore:', error.message);
        });
      })
      .catch((error) => {
        console.error('Error creating user:', error.message);
      });
  };

  return (
    <div className={`fixed inset-0 overflow-y-auto ${isOpen ? '' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative bg-white w-96 p-6 rounded-lg shadow-md">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            &times;
          </button>
          <h1 className="text-2xl font-bold mb-4">Add Seller</h1>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="shopName" className="block text-sm font-medium text-gray-600">
              Shop Name
            </label>
            <input
              type="text"
              id="shopName"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 shadow-none"
            />
          </div>

          <button
            onClick={handleCreate}
            className="w-full bg-cyan-500 text-white py-2 rounded hover:bg-cyan-600 focus:outline-none"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSellerModal;
