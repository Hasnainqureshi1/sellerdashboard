import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase/config'; // Adjust this import path as needed
import { FaBox, FaUser, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import { MdOutlineProductionQuantityLimits } from "react-icons/md";

const OrderHistoryView = () => {
  const [orderDetails, setOrderDetails] = useState({
    customerName: '',
    pickupDate: '',
    totalBill: 0,
    totalProducts: 0,
    paymentStatus: 'Paid', // Assuming all orders are paid
    orders: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchOrdersFromHistory = async () => {
      setIsLoading(true);

      if (!id) {
        setIsLoading(false);
        return;
      }

      const orderHistoryRef = doc(firestore, "orderHistory", id);
      const orderHistorySnap = await getDoc(orderHistoryRef);
      if (!orderHistorySnap.exists()) {
        console.log("Order history not found");
        setIsLoading(false);
        return;
      }

      const orderHistoryData = orderHistorySnap.data();
      const orderIds = orderHistoryData.order_ids;
      let totalBill = 0;
      let totalProducts = 0;
      let ordersDetailsTemp = [];
      let customerName = 'Unknown User';

      // Fetch customer name once using user_id from the first order
      if (orderIds.length > 0) {
        const firstOrderRef = doc(firestore, "orders", orderIds[0].trim());
        const firstOrderSnap = await getDoc(firstOrderRef);
        if (firstOrderSnap.exists()) {
          const firstOrderData = firstOrderSnap.data();
          const userRef = doc(firestore, "app_users", firstOrderData.user_id);
          const userSnap = await getDoc(userRef);
          customerName = userSnap.exists() ? userSnap.data().name : "Unknown User";
        }
      }

      for (const orderId of orderIds) {
        const orderRef = doc(firestore, "orders", orderId.trim());
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          const orderData = orderSnap.data();
          const shopRef = doc(firestore, "shop", orderData.seller_id);  
          const shopSnap = await getDoc(shopRef);
          const shopData = shopSnap.exists() ? shopSnap.data() : { name: "Unknown Shop" };
          let subtotal = 0;

          let productsInfo = await Promise.all(orderData.products.map(async (product) => {
            const productRef = doc(firestore, 'products', product.prod_id);
            const productSnap = await getDoc(productRef);
            const productData = productSnap.exists() ? productSnap.data() : {};
            subtotal += (productData.price || 0) * product.quantity;
            return { ...product, ...productData };
          }));

          totalBill += subtotal;
          totalProducts += productsInfo.length;

          ordersDetailsTemp.push({
            ...orderData,
            orderId,
            productsInfo,
            shopName: shopData.storeName,
            subtotal,
          });
        }
      }

      setOrderDetails({
        ...orderDetails,
        customerName,
        pickupDate: orderHistoryData.pickupDate?.toDate().toDateString() || "Unknown Date",
        totalBill,
        totalProducts,
        orders: ordersDetailsTemp
      });
      setIsLoading(false);
    };

    fetchOrdersFromHistory();
  }, [id]);

  if (isLoading) return <div>Loading order history...</div>;
  if (orderDetails.orders.length === 0) return <div>No orders found.</div>;

  return (
    <div className="p-2 m-3 bg-slate-100 lg:w-80v">
      <div className='pl-10 pr-10 '>

      
      {/* Display customer name and pickup date once */}
      <div className='flex justify-between p-4'>

      <h2 className="text-2xl font-semibold mb-2"><FaUser className="inline mr-2" />Customer: {orderDetails.customerName}</h2>
      <h3 className="text-xl mb-4"><FaCalendarAlt className="inline mr-2" />Pickup Date: {orderDetails.pickupDate}</h3>
      <h3 className="text-xl mb-4"><FaDollarSign  className="inline mr-2"/> Payment Status: {orderDetails.paymentStatus}</h3>
      
      </div>
      {/* Display each order */}
      {orderDetails.orders.map((order, index) => (
        <div key={index} className="mb-8 p-6 bg-white shadow-lg rounded-lg">
          {/* Products list */}
          <div className='flex justify-between w-full flex-row-reverse pb-3'>
          <h4 className='text-md font-md text-right'>Order ID: {order.orderId} </h4>
          <h4 className="text-md font-medium">Purchased From {order.shopName}</h4>
          </div>
            
          {order.productsInfo.map((product, prodIndex) => (
             

<div key={prodIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-center">
              <div className="md:col-span-1 flex items-center">
                <img src={product.images[0]} alt={product.productName} className="w-20 h-20 object-cover rounded-md mr-4" />
                <div>
                  <h4 className="text-md font-medium">{product.productName}</h4>
                  <p className="text-sm">{product.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-start md:justify-center">
                <FaDollarSign className="text-cyan-600 mr-2" />
                <span className="text-lg font-medium">${product.price}</span>
              </div>
              <div className="flex items-center justify-start md:justify-end">
                <MdOutlineProductionQuantityLimits className="text-cyan-600 mr-2" />
                <span className="text-lg font-medium">Qty: {product.quantity}</span>
              </div>
            </div>

          
          ))}
<h3 className='text-right mt-4 font-bold font-sans text-lg'>  Subtotal: ${order.subtotal.toFixed(2)}</h3>
          {/* No need to display individual bill here as per your requirement */}
        </div>
      ))}

      {/* Display total bill and total products */}
      <div className="text-right mt-4">
        <h4 className="text-lg font-semibold"><FaDollarSign className="inline mr-2" />Total Bill: ${orderDetails.totalBill.toFixed(2)}</h4>
        {/* <h4 className="text-lg font-semibold"><MdOutlineProductionQuantityLimits className="inline mr-2" />Total Products: {orderDetails.totalProducts}</h4> */}
      </div>
      </div>
    </div>
  );
};

export default OrderHistoryView;
