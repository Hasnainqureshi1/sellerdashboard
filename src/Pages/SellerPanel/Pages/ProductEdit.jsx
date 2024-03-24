import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../../Context/Context';
import { firestore, storage } from '../../../firebase/config';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ProductEdit = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ name: '', description: '', price: '', images: [] });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const { User } = useContext(AppContext);
  
 
 
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) return;
      const docRef = doc(firestore, 'products', productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const productData = docSnap.data();
        setProduct({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          images: productData.images || [],
        });
        setImagePreviews(productData.images || []); // For displaying existing images
      } else {
        console.log("No such document!");
      }
    };
  
    fetchProductDetails();
  }, [productId]);
  useEffect(() => {
    return () => imagePreviews.forEach(url => URL.revokeObjectURL(url));
  }, [imagePreviews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };
  // Function to remove an image from the previews and the product object
  const handleRemoveImage = (indexToRemove) => {
    const newImagePreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
    const newImages = product.images.filter((_, index) => index !== indexToRemove);
    
    setImagePreviews(newImagePreviews);
    setProduct({ ...product, images: newImages });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const uploadImagesAndGetURLs = async (files) => {
    const uploadPromises = files.map(file => {
      const fileRef = ref(storage, `product-images/${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);
      return uploadTask.then(() => getDownloadURL(fileRef));
    });
    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!User) return; // Ensure there's a logged-in user
    
    // Upload new images if any
    const newImageUrls = imageFiles.length > 0 ? await uploadImagesAndGetURLs(imageFiles) : [];
    const updatedProductImages = [...product.images, ...newImageUrls];
    
    const updatedProduct = { ...product, images: updatedProductImages, seller_id: User.uid };
    
    // Update Firestore document
    await setDoc(doc(firestore, 'products', productId), updatedProduct);
    
    navigate('/sellerPanel/products'); // Redirect to products page after update
  };
  return (
    <div className="  bg-gray-50 w-full flex justify-center items-center   items p-4">

      <div className='bg-white w-2/3 p-4  '>
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Inputs for name, description, and price */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" id="name" name="name" value={product.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" name="description" value={product.description} onChange={handleChange} rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <input type="text" id="price" name="price" value={product.price} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
        </div>

        <div className="mb-4">
          <label htmlFor="images" className="block text-sm font-medium text-gray-700">Product Images</label>
          <input type="file" id="images" onChange={handleImageChange} className="mt-1 block w-full" accept="image/*" multiple />
          <p className='text-gray-500 '> For choosing multiple images click on choose and select all images </p>
          <div className="mt-4 grid grid-cols-3 gap-4"> {/* Adjust grid-cols as needed */}
          {imagePreviews.map((previewUrl, index) => (
    <div key={index} className="relative border flex justify-center">
      <img src={previewUrl} alt={`Preview ${index}`} className="object-cover h-24 w-24 " />
      <button type="button" className="absolute top-0 right-0 bg-cyan-300 hover:bg-cyan-500 text-white rounded p-1" onClick={() => handleRemoveImage(index)}>
        &times; {/* A simple way to make a close button */}
      </button>
    </div>
  ))}
          </div>
        </div>

        <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600">Update Product</button>
      </form>
      </div>
    </div>
  );
};

export default ProductEdit;
