import React, { useState, useContext } from 'react';
// import { firestore } from './firebase'; // Adjust this import according to your Firebase config file's location
import { collection, addDoc, Timestamp } from 'firebase/firestore';
 
import { firestore } from '../../../firebase/config';
import { AppContext } from '../../../Context/Context';

const CreateOrder = () => {
  const { User } = useContext(AppContext); // Assuming you have a User context
  const [products, setProducts] = useState([{ productId: '', quantity: 1 }]);
  const [soldPrice, setSoldPrice] = useState('');
  const [status, setStatus] = useState('');
  
  const handleProductChange = (index, event) => {
    const newProducts = [...products];
    newProducts[index][event.target.name] = event.target.value;
    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([...products, { productId: '', quantity: 1 }]);
  };

  const removeProduct = (index) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!User) {
      alert("User not authenticated");
      return;
    }
    const orderData = {
      order_date: Timestamp.now(),
      products,
      seller_id: User.uid,
      sold_price: Number(soldPrice),
      status,
      user_id:'ctqDarr9m6RiEwcy2K518uAhnrv1', // Assuming the user placing the order is the same as the authenticated user
    };

    try {
      await addDoc(collection(firestore, 'orders'), orderData);
      alert('Order created successfully');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order');
    }
  };

  return (
   <div className='w-full bg-red-200 h-screen'>
    
  
    <form onSubmit={handleSubmit}>
      {products.map((product, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Product ID"
            name="productId"
            value={product.productId}
            onChange={(e) => handleProductChange(index, e)}
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            name="quantity"
            value={product.quantity}
            onChange={(e) => handleProductChange(index, e)}
            required
            min="1"
          />
          {index > 0 && (
            <button type="button" onClick={() => removeProduct(index)}>
              Remove
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addProduct}>
        Add Product
      </button>
      <input
        type="number"
        placeholder="Sold Price"
        value={soldPrice}
        onChange={(e) => setSoldPrice(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        required
      />
      <button type="submit">Create Order</button>
    </form>
    </div>
  );
};

export default CreateOrder;
