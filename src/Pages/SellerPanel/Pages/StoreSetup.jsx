import React, { useState, useContext } from 'react';
import { AppContext } from '../../../Context/Context'; // Adjust import path as necessary
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore,storage } from '../../../firebase/config';
import { useNavigate } from 'react-router-dom';


const StoreSetup = () => {
  const { User, Showalert } = useContext(AppContext);
  const [category, setCategory] = useState('');
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState(''); // New state for address
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  // Handlers for input changes
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleStoreNameChange = (e) => setStoreName(e.target.value);
  const handleAddressChange = (e) => setAddress(e.target.value); // Handler for address change
  const handleImageChange = (e) => setImageFile(e.target.files[0]);

  // Capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const handleSubmit = async () => {
    if (!User || !User.uid) {
      alert("User is not authenticated");
      return;
    }

    let imageUrl = "";
    if (imageFile) {
      const imageRef = ref(storage, `storeImages/${User.uid}/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile).then(snapshot => {
        return getDownloadURL(snapshot.ref);
      }).then(url => {
        imageUrl = url;
      });
    }

    // Capitalize first letters and format data for Firestore
    const formattedStoreName = capitalizeFirstLetter(storeName);
    const formattedCategory = capitalizeFirstLetter(category);

    // Update Firestore document
    const storeDocRef = doc(firestore, 'shop', User.uid);
    await setDoc(storeDocRef, {
      category: formattedCategory,
      storeName: formattedStoreName,
      address: address, // Include address in Firestore document
      imageUrl
    }, { merge: true });

    Showalert("Store created/updated successfully!", 'green');
    navigate('/sellerPanel/dashboard');
  };


  return (
    <div className="  w-full   flex justify-center    bg-gray-200   py-8">
      <div className="w-1/2  bg-white rounded-md overflow-hidden shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Store Details</h2>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              id="category"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
              value={category}
              onChange={handleCategoryChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <input
              type="text"
              id="storeName"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
              value={storeName}
              onChange={handleStoreNameChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              id="address"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
              value={address}
              onChange={handleAddressChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
              onChange={handleImageChange}
              required
            />
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">Preview</h3>
            <div className="border border-gray-300 rounded-md p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Category: {category}</p>
              <p className="text-sm font-medium text-gray-700 mb-2">Store Name: {storeName}</p>
              <p className="text-sm font-medium text-gray-700 mb-2">Store Address: {address}</p>
              {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Store Preview" className="w-40 rounded-md" />}
            </div>
          </div>
          <div className="flex justify-end">
          <button className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 focus:outline-none focus:bg-cyan-600" onClick={handleSubmit}>Create Store</button>

          </div>
        </div>
      </div>
    </div>
  );
};


export default StoreSetup;
