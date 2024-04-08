import React, { useContext,useEffect, useState } from 'react';
// import { firestore } from ''; // Import Firestore from your Firebase configuration file

import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { firestore,auth } from '../../../../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Alert from '../../Container/Alert';
import { AppContext } from '../../../../Context/Context';

const AddAdmin = () => {
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: ''
  });
 
  const { User,Showalert } = useContext(AppContext);
 
  const [token, settoken] = useState( )

  const handleInputChange = (e) => {
   const { name, value } = e.target;
   setNewAdmin(prevState => ({
     ...prevState,
     [name]: value
   }));
  
 };
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
 

 const handleAddAdmin = async () => {
   try {
    const response = await fetch(`http://localhost:5000/api/auth/create-admin`, {
      method: "POST",
      headers: {
        authorization: token,
        "Content-Type": "application/json", 
       
      },
      body: JSON.stringify({
        email: newAdmin.email,
        name: newAdmin.name,
        password: newAdmin.password
      })
    });
    if (response.ok) {
      const json = await response.json();
      console.log(json);
 
   
     // Reset the form fields
     setNewAdmin({
       name: '',
       email: '',
       password: ''
     });
     
     Showalert("New Admin added successfully!","green");
     // setalert(false);
     console.log('New admin added successfully!');
    }
   } catch (error) {
     console.error('Error adding admin: ', error);
   }
 };

 

  return (
    <div className=" ">
   
    
 
      <h1 className="text-2xl font-bold mb-4">Add User</h1>
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
          Add User
        </button>
      </div>
    </div>
  );
};

export default AddAdmin;
