import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import CryptoJS from 'crypto-js';
 
 
import { doc, getDoc, updateDoc, runTransaction, increment, addDoc, collection, serverTimestamp, writeBatch } from 'firebase/firestore'; // Import runTransaction for atomic updates
import { Link, useNavigate } from 'react-router-dom';
import { firestore } from '../../../firebase/config';
  // Adjust the import path as necessary

 

const OrderScan = () => {
  const [scanner, setScanner] = useState(null);
  const [scanResult, setScanResult] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isComplete, setisComplete] = useState()
   
  const qrScannerRef = useRef(null); // Initialize a ref to hold the scanner instance
 
  const navigate = useNavigate();
  useEffect(() => {
    // Initialize scanner when the component mounts
    initScanner();
    return () => {
      // Cleanup function to clear the scanner when the component unmounts
      if (qrScannerRef.current) {
        console.log('component unmount ')
        qrScannerRef?.current.clear();
      }
    };
  }, []);

  const initScanner = () => {
    console.log("initScanner")
    console.log(!qrScannerRef.current)
    if (!qrScannerRef.current) {
      const scanner = new Html5QrcodeScanner('reader', { qrbox: 250, fps: 10 }, false);
      scanner.render(onScanSuccess, onScanError);
      qrScannerRef.current = scanner; // Store the scanner instance in the ref
      setIsScanning(true);
    }
  };

  const onScanSuccess = async (encryptedText) => {
    if (qrScannerRef?.current) {
      qrScannerRef?.current.clear(); // Immediately stop scanning
      setIsScanning(false);
      console.log(encryptedText)
      setScanResult("Scan completed. Processing order...");

      try {
        // Process the QR code content
        await updateOrdersAndCreateHistory(encryptedText);
        setScanResult("Order processed successfully.");
        // Navigate or update UI accordingly
      } catch (error) {
        console.error("Error scanning QR code:", error);
        setScanResult("Failed to scan QR code. Please try again.");
      }
    }
  };

  const onScanError = (error) => {
    console.error(`QR scan error: ${error}`);
    setScanResult("QR scanning error. Please try again.");
    if (qrScannerRef.current) {
      // qrScannerRef.current.clear();
      // setIsScanning(false);
    }
  };

  const updateOrdersAndCreateHistory = async (qr) => {
    const orderIds = qr.split(',').map(id => id.trim());
    let successfulUpdates = [];
    let completedOrderIds = [];
    let completedOrdersDetails = [];
  
    try {
      const batch = writeBatch(firestore);
      let sellersToUpdate = {}; // Object to hold total sales to update per seller
  
      for (const orderId of orderIds) {
        const orderRef = doc(firestore, "orders", orderId);
        const orderDoc = await getDoc(orderRef);
  
        if (!orderDoc.exists()) {
          console.log(`Order ${orderId} does not exist.`);
          alert('Order does not exist, or Wrong QR Code');
          continue;
        }
  
        const orderData = orderDoc.data();
        if (orderData.status === 'completed') {
          completedOrderIds.push(orderId);
          completedOrdersDetails.push(orderData);
          console.log(`Order ${orderId} has already been completed.`);
          continue;
        }
  
        // Accumulate total sales per seller from all products in the order
        for (const product of orderData.products) {
          const totalProductValue = product.sold_price * product.quantity;
          sellersToUpdate[orderData.seller_id] = (sellersToUpdate[orderData.seller_id] || 0) + totalProductValue;
        }
  
        // Mark order as completed
        batch.update(orderRef, { status: 'completed' });
        successfulUpdates.push(orderId);
      }
  
      // Update sellers with new total sales
      for (const [sellerId, totalSales] of Object.entries(sellersToUpdate)) {
        const sellerRef = doc(firestore, "sellers", sellerId);
        batch.update(sellerRef, { total_sales: increment(totalSales) }); // Use Firestore increment to adjust total sales
      }
  
      await batch.commit();
  
      if (successfulUpdates.length > 0) {
        const historyDocRef = await addDoc(collection(firestore, "orderHistory"), {
          order_ids: successfulUpdates,
          pickupDate: serverTimestamp(),
        });
  
        alert("The order has been successfully marked as completed. You will now be redirected to the order history.");
        navigate(`/superadmin/order-history/${historyDocRef.id}`);
      }
  
      if (completedOrdersDetails.length > 0) {
        console.log("Details of completed orders:", completedOrdersDetails);
        alert(`Completed Orders: ${completedOrderIds.join(', ')}. This order is already picked up. Look order in history.`);
        navigate('/superadmin/order-history');
      }
  
      console.log(`Processed orders successfully: ${successfulUpdates.join(', ')}.`);
    } catch (error) {
      console.error("Error processing orders:", error);
    }
  };
  
  
  
 
 
  const stopScanning = () => {
    if (scanner) {
      // scanner.clear();
      // setScanner(null);
    }
  };
  
 
  return (
    <div className="w-full bg-gray-100 flex flex-col px-5">
    <div className="bg-white mt-4 relative">
    {scanResult && (
    <div className="p-4 text-center">
    {scanResult}
    {orderDetails && (
    <div>
 
    {/* Display other order details as needed */}
    </div>
    )}
    </div>
    )}
    <div id="reader" className={!orderDetails ? "flex bg-white z-10 justify-center items-center h-96" : "hidden"}></div>
    <div className='p-2'>
 
    {/* <Link to='/sellerPanel/orders' className="text-green-500 flex justify-center items-center hover:text-green-700" onClick={stopScanning}>
    <p className='text-xl'>Return to Back</p>
    </Link> */}
    {!isScanning && <button className="bg-cyan-500 text-white px-4 py-2 rounded" onClick={() => initScanner()}>Start Scanning</button>}
 
    </div>
    </div>
    </div>
  );
};

export default OrderScan;
