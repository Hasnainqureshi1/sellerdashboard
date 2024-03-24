import React, { useState, useEffect } from 'react';
import { firestore } from '../../../firebase/config';
import { collection, getDocs, orderBy, where,query,limit, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { prodErrorMap } from 'firebase/auth';
 
 

const RecentOrders = ({ userId }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
   const fetchOrders = async () => {
    try {
      if (!userId) {
        throw new Error('Missing userId');
      }
  
      const ordersRef = collection(firestore, 'orders');
      const OrderQueryRecent = query(
        ordersRef,
        where('status', '==', 'pending'),
        where('seller_id', '==', userId)
      );
  
      const orderSnapshot = await getDocs(OrderQueryRecent);
      const ordersData = orderSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(ordersData);
      const productsMap = {}; // Create a map to store products data
      
      // Fetch product data for each order asynchronously
      await Promise.all(ordersData.map(async order => {
        try {
         console.log(order)
          const prodId = order.prod_id; // Assuming 'prod_id' is the property for product ID
          console.log(prodId);
          console.log(prodId);
          if (!prodId) {
            throw new Error('Missing product ID in order data');
          }
  
          const prodDocRef = doc(firestore, 'products', prodId);
          const productSnapshot = await getDoc(prodDocRef);
          const productData = productSnapshot.data();
  
          productsMap[prodId] = { id: prodId, ...productData }; // Store product data in the map
          
        } catch (error) {
          console.error('Error fetching product:', error.message);
        }
      }));
  
      console.log(ordersData);
      console.log(productsMap);
  
      // Combine order data with corresponding product data
      const combinedData = ordersData.map(order => ({
        ...order,
        product: productsMap[order.prod_id] // Attach product data to each order
      }));
      console.log(combinedData)
      setOrders(combinedData);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      // Handle error appropriately
    }
  };
  
    

    fetchOrders();
  }, []);
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
   <div className="bg-white border-t  mt-2 p-6 rounded-lg shadow-md">
   <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
   {orders?.length > 0 ? (
    <>
       <table className="min-w-full divide-y divide-gray-200">
           <thead className="bg-gray-50">
               <tr>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
               </tr>
           </thead>
           <tbody className="bg-white divide-y divide-gray-200">
               {orders.map(order => (
                   <tr key={order.id}>
                       <td className="px-6 py-4 whitespace-nowrap">
                           <div className="text-sm font-medium text-gray-900">{order.product.name}</div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                           <div className="text-sm text-gray-900">{order.quantity}</div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                           <div className="text-sm text-gray-900">{formatDate(order.order_date)}</div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                           <div className="text-sm text-gray-900">${order.sold_price}</div>
                       </td>
                   </tr>
               ))}
           </tbody>
       </table>
        <div className="mt-4">
        <Link to='../orders' className="bg-cyan-500 mr-3 text-white px-4 py-2 rounded">View All</Link>
    </div>
    </> ) : (
       <p className="text-gray-500">There is no recent orders.</p>
   )}
  
</div>
);
};

export default RecentOrders;
