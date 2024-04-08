import React, { useState, useContext } from 'react';
import { AppContext } from '../../../Context/Context';
import { firestore, storage } from '../../../firebase/config';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';

const AddProductModal = ({ isOpen, onClose }) => {
 const { User,Showalert } = useContext(AppContext);
 const [productName, setProductName] = useState('');
 const [productDescription, setProductDescription] = useState('');
 const [productPrice, setProductPrice] = useState('');
 const [imageFiles, setImageFiles] = useState([]);
 const [imagePreviews, setImagePreviews] = useState([]);
 const [AddingProduct, setAddingProduct] = useState(false)

 const handleImageChange = (e) => {
   const files = Array.from(e.target.files);
   setImageFiles(files);

   const previews = files.map(file => URL.createObjectURL(file));
   setImagePreviews(previews);
 };

 const uploadImagesAndGetURLs = async (files) => {
   const urls = await Promise.all(files.map(file => {
     const fileRef = ref(storage, `product-images/${User.uid}/${file.name}`);
     return uploadBytesResumable(fileRef, file).then(() => getDownloadURL(fileRef));
   }));
   return urls;
 };

 const handleSubmit = async (e) => {
   e.preventDefault();
   setAddingProduct(true)
   const imageUrls = await uploadImagesAndGetURLs(imageFiles);
   const newProductData = {
    name: productName,
    description: productDescription,
    price: productPrice,
    images: imageUrls,
    seller_id: User.uid, 
    createdAt:serverTimestamp(),
};

// Create a new document in 'products' collection with an auto-generated ID
const newDocRef = doc(collection(firestore, 'products'));
await setDoc(newDocRef, newProductData);

 setAddingProduct(false)
   // Reset form and close modal after submission
   setProductName('');
   setProductDescription('');
   setProductPrice('');
   setImageFiles([]);
   setImagePreviews([]);
   onClose();
   Showalert("New Product added successfully!","green");
 };

 if (!isOpen) return null;

  return (
   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-full max-w-lg">
      {AddingProduct ? (
            <div>
              <h3>Wait a moment, Adding Product...</h3>
            </div>
          ) : (
           <>
           
        <h2 className="text-xl font-bold mb-4">Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="productName">Name</label>
            <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" type="text" id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="productDescription">Description</label>
            <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" id="productDescription" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} rows="4" required></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="productPrice">Price</label>
            <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" type="number" id="productPrice" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="productImages">Images</label>
            <input className="mt-1 block w-full" type="file" id="productImages" onChange={handleImageChange} multiple accept="image/*" />
            <div className="mt-4 grid grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <img key={index} src={preview} alt="Preview" className="object-cover h-24 w-24" />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Close</button>
            <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600">Add Product</button>
          </div>
        </form>
        </>
          )}
      </div>
    </div>
  );
};

export default AddProductModal;


 