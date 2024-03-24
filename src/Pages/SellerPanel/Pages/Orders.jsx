import React, { useState, useEffect, useContext } from 'react';
 // Adjust the import path as needed
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { FaQrcode } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AppContext } from '../../../Context/Context';
import { firestore } from '../../../firebase/config';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { User } = useContext(AppContext);  
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
const [sortOrder, setSortOrder] = useState('pending'); // Default sort order

 

useEffect(() => {
 const fetchOrdersAndProducts = async () => {
  if (!User || !User.uid) {
   setIsLoading(false);
   return;
 }
 setIsLoading(true); // Start loading
   const ordersQuery = query(collection(firestore, "orders"), where("seller_id", "==", User.uid));
   const ordersSnapshot = await getDocs(ordersQuery);

   const ordersData = await Promise.all(ordersSnapshot.docs.map(async (orderDoc) => {
     const orderData = orderDoc.data();
     
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

     return {
       ...orderData,
       id: orderDoc.id,
       productName,
       customerName,
       totalPrice, // Calculated total price
     };
   }));
     // After fetching, filter and sort the ordersData array
     const filteredAndSortedOrders = ordersData
     .filter(order => order.productName.toLowerCase().includes(searchTerm.toLowerCase()) && order.status === sortOrder)
     .sort((a, b) => b.order_date - a.order_date); // Assuming you want the most recent orders first

   setIsLoading(false); // End loading
   setOrders(ordersData);
 };

 fetchOrdersAndProducts();
}, [User]);

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
    <div className="w-full bg-gray-100 flex flex-col px-5">
      <div className="bg-white mt-4 relative">
        <header className='p-3 my-2 border-b shadow-md flex justify-between '>
          <h2 className="text-xl font-bold">Orders</h2>
          <Link to='/sellerPanel/orderScan' className="text-green-500 flex justify-center items-center hover:text-green-700">
            <FaQrcode aria-label="Start QR Scan" className='mr-2'/>
            <p>Scan Order</p>
          </Link>
        </header>
        <header className='p-3 my-2 border-b shadow-md flex justify-between items-center'>
  <h2 className="text-xl font-bold">Orders</h2>
  <div className="flex items-center space-x-4">
    <input
      type="text"
      placeholder="Search by product name..."
      className="px-4 py-2 border rounded"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <select
      className="px-4 py-2 border rounded"
      value={sortOrder}
      onChange={(e) => setSortOrder(e.target.value)}
    >
      <option value="pending">Pending</option>
      <option value="completed">Completed</option>
      <option value="cancelled">Cancelled</option>
    </select>
  </div>
  <Link to='/sellerPanel/orderScan' className="text-green-500 flex justify-center items-center hover:text-green-700">
    <FaQrcode aria-label="Start QR Scan" className='mr-2'/>
    <p>Scan Order</p>
  </Link>
</header>

        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
        <table className="min-w-full text-center table-auto border-collapse">
          <thead className="bg-cyan-100">
            <tr>
              
              <th className="border px-4 py-2">Product Name</th>
              <th className="border px-4 py-2">Customer Name</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Total</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2"> Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
               
                <td className="border px-4 py-2">{order.productName}</td>
                <td className="border px-4 py-2">{order.customerName}</td>
                <td className="border px-4 py-2">{order.quantity}</td>
                <td className="border px-4 py-2">{`$${order.totalPrice.toFixed(2)}`}</td>
                <td className="border px-4 py-2">{order.status}</td>
                <td className="border px-4 py-2">{formatDate(order?.order_date)}</td>
                <td className="border px-4 py-2">
      <Link
        to={`./${order.id}`}
        className="bg-cyan-100 text-cyan-500 font-bold hover:bg-cyan-200 px-4 py-2 rounded focus:outline-none"
      >
        View
      </Link>
    </td>
              </tr>
            ))}
          </tbody>
        </table>
          )}
        {orders.length === 0 && !isLoading && <p className="text-center py-4">No orders found.</p>}
      </div>
    </div>
  );
};

export default Orders;
