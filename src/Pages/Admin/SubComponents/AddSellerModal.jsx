import React, { useContext, useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { app, firestore } from '../../../firebase/config'; // Import firestore from firebase config
import { collection, addDoc,setDoc, doc } from "firebase/firestore"; // Import collection, addDoc, and doc
import Date from '../../../function/Date';
import { AppContext } from '../../../Context/Context';

const AddSellerModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [password, setPassword] = useState('');
 const [AddingSeller, setAddingSeller] = useState(false)
  const { User,Showalert,checkTokenExpiration } = useContext(AppContext);
  const [token, settoken] = useState( )
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
  const handleCreate = async () => {
    console.log(checkTokenExpiration())
    setAddingSeller(true)
    try {
      const response = await fetch(`http://localhost:5000/api/auth/create-seller`, {
        method: "POST",
        headers: {
          authorization: token,
          "Content-Type": "application/json", 
         
        },
        body: JSON.stringify({
          email: email,
          name: name,
          password: password,
          shopName:shopName,
        })
      });
      const json = await response.json();
      if (response.ok) {
        console.log(json);
   
     
       // Reset the form fields
       setName('')
       setEmail('')
       setPassword('')
       setShopName('')
      
       Showalert("New Seller added successfully!","green");
       // setalert(false);
       console.log('New seller added successfully!');
       onClose();
      }
      else{
        console.log(json);
        Showalert( json.statusText,"green");

     }
     } catch (error) {
     
       console.error('Error adding Seller: ', error);
     }  finally {
      setAddingSeller(false); // Set AddingSeller back to false after the process is complete
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
          {AddingSeller ? (
            <div>
              <h3>Wait a moment, creating seller...</h3>
            </div>
          ) : (
        <>

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
          </>
      
      )}
        </div>
      </div>
    </div>
  );
};

export default AddSellerModal;
