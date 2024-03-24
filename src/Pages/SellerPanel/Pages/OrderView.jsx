import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom'; // if you're using react-router for navigation
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase/config'; // Adjust the import path as needed
import { FaBox, FaUser, FaCalendarAlt, FaDollarSign, FaInfoCircle, FaCheckCircle, FaTimesCircle, FaBan } from 'react-icons/fa';
import { AppContext } from '../../../Context/Context';

const OrderView = () => {
 const [order, setOrder] = useState(null);
 const [isLoading, setIsLoading] = useState(true);
 const { User,Showalert } = useContext(AppContext);
 const { orderId } = useParams();

  useEffect(() => {
   const fetchOrderDetails = async () => {
     if (!User || !User.uid || !orderId) {
       setIsLoading(false);
       return;
     }

     setIsLoading(true);
     const orderRef = doc(firestore, "orders", orderId);
     const orderSnap = await getDoc(orderRef);

     if (!orderSnap.exists()) {
       console.log("No such order!");
       setIsLoading(false);
       return;
     }

     const orderData = orderSnap.data();
     
     // Fetch product name
     const productRef = doc(firestore, "products", orderData.prod_id);
     const productSnap = await getDoc(productRef);
     const productName = productSnap.exists() ? productSnap.data().name : "Unknown Product";
     
     // Fetch customer name
     const userRef = doc(firestore, "app_users", orderData.user_id);
     const userSnap = await getDoc(userRef);
     const customerName = userSnap.exists() ? userSnap.data().name : "Unknown Customer";

     // Calculate total price based on quantity and sold_price
     const totalPrice = orderData.quantity * orderData.sold_price;

     setOrder({
       ...orderData,
       productName,
       customerName,
       totalPrice
     });
     setIsLoading(false);
   };

   fetchOrderDetails();
 }, [User, orderId]);
  if (!order) return <div className="text-center">Loading order details...</div>;

  // Helper function to determine the status icon
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <FaCheckCircle className="text-green-500 mr-2" />;
      case 'pending':
        return <FaInfoCircle className="text-yellow-500 mr-2" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500 mr-2" />;
      default:
        return <FaInfoCircle className="text-gray-500 mr-2" />;
    }
  };
  // Function to cancel the order
  const handleCancelOrder = async () => {
    if (!orderId) return;
    
    const orderRef = doc(firestore, "orders", orderId);

    // Update the status of the order to 'cancelled'
    await updateDoc(orderRef, {
      status: 'cancelled'
    });

    // Optionally, refetch the order details or directly update the local state
    setOrder(prev => ({ ...prev, status: 'cancelled' }));

    // Show feedback to the user
    alert('Order has been cancelled successfully.');
    Showalert("Order has been cancelled successfully.", 'green');
  };

  function formatDate(timestamp) {
   try {
     // Check for valid Firestore Timestamp object and construct Date object
     const date = new Date(
       timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
     );
  
     // Get month, day, and year using Date object methods
     const month = date.toLocaleString("en-US", { month: "long" });
     const day = date.getDate();
     const year = date.getFullYear();
  
     // Return formatted date string
     return `${month} ${day}, ${year}`;
   } catch (error) {
     // Handle any errors (e.g., invalid timestamp format)
     console.error("Error formatting date:", error);
     return "Invalid Date"; // Or consider returning a default date or placeholder
   }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-10">
      <div className="p-4 md:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <FaBox className="text-cyan-600 mr-2" />Order Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center text-gray-700">
            <FaUser className="text-cyan-600 mr-2" />
            <span>Customer: {order.customerName}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaBox className="text-cyan-600 mr-2" />
            <span>Product: {order.productName}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaDollarSign className="text-cyan-600 mr-2" />
            <span>Price per Item: ${order.sold_price}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaDollarSign className="text-cyan-600 mr-2" />
            <span>Total Price: ${order.totalPrice?.toFixed(2)}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaCalendarAlt className="text-cyan-600 mr-2" />
            <span>Date: {formatDate(order?.order_date)}</span>
          </div>
          <div className="flex items-center">
            {getStatusIcon(order.status)}
            <span className="text-gray-700">Status: {order.status}</span>
          </div>
        </div>
      </div>
      {order.status === 'pending' && (
        <div className="p-4 md:p-8">
          <button 
            onClick={handleCancelOrder}
            className="flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <FaBan className="mr-2" />
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderView;
