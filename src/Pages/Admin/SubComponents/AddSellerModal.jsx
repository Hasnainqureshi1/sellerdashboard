import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { app, firestore } from '../../../firebase/config'; // Import firestore from firebase config
import { collection, addDoc,setDoc, doc } from "firebase/firestore"; // Import collection, addDoc, and doc
import Date from '../../../function/Date';

const AddSellerModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [password, setPassword] = useState('');
 

















  
  const handleCreate = async () => {
    const Sellerauth = getAuth(app);
    const formattedDate = Date;
    console.log(formattedDate);
    try {
      // Create user credentials with email and password
      const { user } = await createUserWithEmailAndPassword(email, password);
  
      // Create the main user document with common data
      const userDocRef = doc(collection(firestore, 'users'), user.uid);
      const commonUserData = {
        name:name,
        email:email,
        user_type:"seller",
        // Other common fields
      };
  
      await setDoc(userDocRef, commonUserData);
      console.log(user.uid)
      // Create a document in the 'sellers' subcollection using user ID
      const sellerDocRef = doc(collection(firestore, 'sellers'));
      const specificUserData = {
        // Data specific to the seller
        seller_id:user.uid,
        shop_name:shopName,
        // date:,
      };
  
      await setDoc(sellerDocRef, specificUserData);
      // await signOut(auth);
      console.log('User created successfully:', user);
      onClose(); // Close the modal or handle success
    } catch (error) {
      console.error('Error creating user:', error.message);
      // Handle errors appropriately
    }
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
