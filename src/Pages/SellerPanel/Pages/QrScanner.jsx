import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import CryptoJS from 'crypto-js';
 
import { app, firestore } from '../../../firebase/config';
import { doc, getDoc, updateDoc, runTransaction, increment } from 'firebase/firestore'; // Import runTransaction for atomic updates
import { Link, useNavigate } from 'react-router-dom';
  // Adjust the import path as necessary

const SECRET_KEY = 'wholesalemarketsystem091';

const QrScanner = () => {
  const [scanner, setScanner] = useState(null);
  const [scanResult, setScanResult] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [encryptedData, setEncryptedData] = useState('');
  const [decryptedData, setDecryptedData] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    initScanner();
    return () => scanner?.clear();
  }, []);

  const initScanner = () => {
    setScanResult('')
    const qrScanner = new Html5QrcodeScanner('reader', { qrbox: 250, fps: 10 });
    qrScanner.render(onScanSuccess, onScanError);
    setScanner(qrScanner);
    setIsScanning(true);
  };
  let orderId;
  let sellerId;

  const onScanSuccess = async (encryptedText) => {
   
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      const [sellerId, orderId] =await decryptedText.split(':');
      console.log(decryptedData)
      console.log(sellerId)
      console.log(orderId)
   
      if (!sellerId || !orderId) {
        throw new Error("Decrypted data is invalid.");
      }

      await updateOrderAndSales(sellerId, orderId);
    } catch (error) {
      console.error("Error scanning QR code:", error);
      setScanResult("Failed to scan QR code. Please try again.");
    }
   

   

       
 
        
  };

  const onScanError = (error) => {
    console.error(`QR scan error: ${error}`);
    setScanResult("QR scanning error. Please try again.");
    setIsScanning(false);
    setOrderDetails(null);
  };
  // const updateOrderAndSales = async (qr) => {
  //   const orderIds = qr.split(',').map(id => id.trim());
  //   // Begin transaction
  //   await runTransaction(firestore, async (transaction) => {
  //     for (const orderId of orderIds) {
  //       const orderRef = doc(firestore, "orders", orderId);
  //       const orderDoc = await transaction.get(orderRef);
  
  //       if (!orderDoc.exists()) {
  //         console.log(`Order ${orderId} does not exist.`);
  //         continue; // Skip this order and continue with the next
  //       }
  
  //       const orderData = orderDoc.data();
  //       if (orderData.status === 'completed') {
  //         setScanResult(`Order ${orderId} has already been completed.`);
  //         console.log(`Order ${orderId} has already been completed.`);
  //         continue; // Skip this already completed order
  //       }
  
  //       // Normalize the products to an array if it's not one
  //       let products = Array.isArray(orderData.products) ? orderData.products : [orderData.products];
  //       let totalOrderValue = 0;
  
  //       for (const product of products) {
  //         const productRef = doc(firestore, "products", product.prod_id);
  //         const productDoc = await transaction.get(productRef);
  //         if (productDoc.exists()) {
  //           totalOrderValue += productDoc.data().price * product.quantity;
  //         }
  //       }
  
  //       // Update the order status to completed
  //       transaction.update(orderRef, { status: 'completed' });
  
  //       // Assuming you still want to update the seller's total sales, you'll need to fetch the sellerId from the order
  //       const sellerRef = doc(firestore, "sellers", orderData.seller_id);
  //       transaction.update(sellerRef, {
  //         total_sales: increment(totalOrderValue)
  //       });
  
  //       console.log(`Order ${orderId} completed successfully.`);
  //     }
  //   });
  // };
  


  const updateOrderAndSales = async (sellerId, orderId) => {
    const orderRef = doc(firestore, "orders", orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists() || orderSnap.data().seller_id !== sellerId) {
      setScanResult("Wrong QR code or this order does not belong to your shop.");
      return;
    }

    // Begin transaction
    await runTransaction(firestore, async (transaction) => {
      const orderDoc = await transaction.get(orderRef);
      if (!orderDoc.exists()) {
        throw new Error("Order does not exist.");
      }

      if (orderDoc.data().status === 'completed') {
        setScanResult("This order has already been completed.");
        setTimeout(() => {
          navigate(`/sellerPanel/orders/${orderDoc.data().id}`)
        }, 2000);
        return;
      }
      const orderData = orderDoc.data();
      // Normalize the products to an array if it's not one
      let products = Array.isArray(orderData.products)
      ? orderData.products
      : [orderData.products];

      console.log("Order working")
      
      // Calculate total order value and update seller's total sales
      let totalOrderValue = 0;
      for (const product of products || []) {
        const productRef = doc(firestore, "products", product.prod_id);
        const productDoc = await transaction.get(productRef);
        if (productDoc.exists()) {
          totalOrderValue += productDoc.data().price * product.quantity;
        }
      }
      console.log("Order working")

      const sellerRef = doc(firestore, "sellers", sellerId);
      
      // Update the order status to completed
      transaction.update(orderRef, { status: 'completed' });
      transaction.update(sellerRef, {
        total_sales: increment(totalOrderValue)
      });

      setScanResult(`Order  completed successfully.`);
      setTimeout(() => {
        navigate(`/sellerPanel/orders/${orderData.id}`)
      }, 1000);
    });
  };
  const stopScanning = () => {
    if (scanner) {
      scanner.clear();
      setScanner(null);
    }
  };
  
  function encryptData(sellerId, orderId) {
    const data = `${sellerId}:${orderId}`;
    const ciphertext = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
    return ciphertext;
  }
  const handleEncrypt = () => {
    const encrypted = encryptData("ssFyznyy5RVG76nUwKO1fp21nuw2", "viZSfXEIaROXk56ph54P");
    setEncryptedData(encrypted);
  };
  return (
    <div className="w-full bg-gray-100 flex flex-col px-5">
    <div className="bg-white mt-4 relative">
    {scanResult && (
    <div className="p-4 text-center">
    {scanResult}
    {orderDetails && (
    <div>
    <p>Order ID: {orderDetails.orderId}</p>
    <p>Seller ID: {orderDetails.seller_id}</p>
    {/* Display other order details as needed */}
    </div>
    )}
    </div>
    )}
    <div id="reader" className={!orderDetails ? "flex bg-white z-10 justify-center items-center h-96" : "hidden"}></div>
    <div className='p-2'>
 
    <Link to='/sellerPanel/orders' className="text-green-500 flex justify-center items-center hover:text-green-700" onClick={stopScanning}>
    <p className='text-xl'>Return to Back</p>
    </Link>
    {!isScanning && <button className="bg-cyan-500 text-white px-4 py-2 rounded" onClick={initScanner}>Start Scanning</button>}
    </div>
    </div>
    </div>
  );
};

export default QrScanner;
