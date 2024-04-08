import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
 
import { FaQrcode } from "react-icons/fa";
import { Link } from "react-router-dom";
import { firestore } from "../../../firebase/config";
import { HiOutlineSearch } from "react-icons/hi";

const OrderHistory = () => {
  const [orderHistories, setOrderHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredHistories, setFilteredHistories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = orderHistories.filter(history =>
      history.userName.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredHistories(filteredData);
  }, [searchTerm, orderHistories]);


  useEffect(() => {
    const fetchOrderHistories = async () => {
      setIsLoading(true);
      const orderHistoryRef = collection(firestore, "orderHistory");
      const orderHistorySnap = await getDocs(orderHistoryRef);
    
      let historiesData = await Promise.all(orderHistorySnap.docs.map(async (historyDoc) => {
        const orderHistoryData = historyDoc.data();
        let totalItems = 0; // This will now count products, not quantities
        let totalSoldPrice = 0;
    
        let userName = "Unknown User"; // Default user name
        if (orderHistoryData.order_ids.length > 0) {
          const firstOrderRef = doc(firestore, "orders", orderHistoryData.order_ids[0].trim());
          const firstOrderSnap = await getDoc(firstOrderRef);
          if (firstOrderSnap.exists()) {
            const firstOrderData = firstOrderSnap.data();
            const userRef = doc(firestore, "app_users", firstOrderData.user_id);
            const userSnap = await getDoc(userRef);
            userName = userSnap.exists() ? userSnap.data().name : "Unknown User";
          }
        }
    
        for (const orderId of orderHistoryData.order_ids) {
          const orderRef = doc(firestore, "orders", orderId.trim());
          const orderSnap = await getDoc(orderRef);
          if (orderSnap.exists()) {
            const orderData = orderSnap.data();
            // Count each product once, regardless of quantity
            totalItems += orderData.products.length; // Count the number of products
            totalSoldPrice += orderData.products.reduce((acc, product) => acc + (product.quantity * product.sold_price), 0);
          }
        }
    
        const date = orderHistoryData.pickupDate?.toDate().toDateString() || "Unknown Date";
    
        return {
          id: historyDoc.id,
          date,
          userName,
          totalItems, // Represents the count of unique products
          totalSoldPrice,
        };
      }));
    
      setOrderHistories(historiesData);
      setIsLoading(false);
    };
    
    fetchOrderHistories();
  }, []);
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    
        <div className='p-2 m-3 bg-slate-100 lg:w-80v  '>
      <h1 className=' text-4xl p-3'>Order History</h1>
      <div className="flex items-center mt-3 p-4 border bg-white border-gray-300 rounded shadow-md">
      {/* Search Bar */}
      <div className="relative w-full flex flex-row mr-4 bg-white">
        {/* <span className=" flex-row  inset-y-0 left-0 flex items-center pl-2 bg-white">
        <HiOutlineSearch fontSize={20} className='absolute left-3 ' />

        </span> */}
     
      <input 
        type="text"
        placeholder="Search by customer name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border border-gray-300 rounded-lg w-full"
      />
 

     

    </div>
    {/* Seller table  */}
  
 
      </div>
      <table className="table-auto w-full bg-white text-center border">
        <thead className='text-md text-cyan-700 uppercase bg-gray-50 dark:bg-cyan-700 dark:text-gray-50'>
          <tr>
         
            <th className="px-4 py-2 text-xs lg:text-lg">Customer</th>
            <th className="px-4 py-2 text-xs lg:text-lg">Pickup Date</th>
            <th className="px-4 py-2 text-xs lg:text-lg">Total Bill</th>
            <th className="px-4 py-2 text-xs lg:text-lg">Items</th>
            <th className="px-4 py-2 text-xs lg:text-lg">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredHistories.map((row) => (
            <tr key={row.id} className='bg-white border-b dark:border-gray-300'>
            
              <td className="px-0 py-2 md:px-1 text-xs lg:text-lg">{row.userName}</td>
              <td className="px-0 py-2 md:px-1 text-xs lg:text-lg">{row.date}</td>
              <td className="px-0 py-2 md:px-1 text-xs lg:text-lg">${row.totalSoldPrice}</td>
              <td className="px-0 py-2 md:px-1 text-xs lg:text-lg">{row.totalItems}</td>
              <td className="px-0 py-2 md:px-1 text-xs lg:text-lg">
                <Link
                  to={`./${row.id}`}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>  
    </div>
 
    
   
  );
};

export default OrderHistory;
