// SellerDetails.js
import React ,{useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import SalesAnalytic from './SalesAnalytics';
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { firestore } from '../../../firebase/config';
 

const SellerDetails = () => {
  const [sellerData, setSellerData] = useState()
  const params = useParams();
console.log(params.sellerid);
 const [showPassword, setShowPassword] = useState(false);
 const uid = params.sellerid;
 
 useEffect(() => {
  const fetchSellerDetails = async () => {
    console.log("useeffect");
    try {
      const sellerDocRef = doc(firestore, 'sellers', uid);
      const userDocRef = doc(firestore, 'users', uid);
      const shopDocRef = doc(firestore, 'shop', uid);
      const orderCollectionRef = collection(firestore, 'orders');
      const orderQuery = query(orderCollectionRef, where('seller_id', '==', uid));
      const reviewCollectionRef = collection(firestore, 'reviews');
      const reviewQuery = query(reviewCollectionRef, where('seller_id', '==', uid));

      const [sellerSnapshot, userSnapshot, shopSnapshot, ordersSnapshot, reviewsSnapshot] = await Promise.all([
        getDoc(sellerDocRef),
        getDoc(userDocRef),
        getDoc(shopDocRef),
        getDocs(orderQuery),
        getDocs(reviewQuery), // Fetch reviews with the same seller_id
      ]);

      const sellerData = sellerSnapshot.data();
      const userData = userSnapshot.data();
      const shopData = shopSnapshot.data();
      const ordersData = ordersSnapshot.docs.map(doc => doc.data());
      const reviewsData = reviewsSnapshot.docs.map(doc => doc.data());

      console.log(ordersData);
      var  totalOrders = 0;
      if(ordersData.length > 0) {
       totalOrders = ordersData.length;
      }
      var  totalReviews = 0;
      if(reviewsData.length >0){

         totalReviews = reviewsData.length;
      }
      var category = 'uncategorized';
      if(shopData?.category){
        category = shopData?.category;
      }
       

      const combinedData = {
        ...sellerData,
        ...userData,
        category: category,
        totalOrders: totalOrders,
        totalReviews: totalReviews // Add total reviews
      };

      console.log(combinedData);
      setSellerData(combinedData);
    } catch (error) {
      console.error("Error fetching seller details:", error);
      throw error;
    }
  };

  fetchSellerDetails();
}, []);

 // Include params.sellerid in the dependency array to re-run the effect when it changes

 const togglePasswordVisibility = () => {
   setShowPassword((prevShowPassword) => !prevShowPassword);
 };
  // Fetch seller details based on the sellerId
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
   <div className='p-2 m-3 bg-slate-100 lg:w-80v  '>
    <div className='mt-3 ml-3 bg-white border shadow-md p-5'>
      <h2 className="text-2xl font-semibold mb-4">Seller Details</h2>
     {sellerData?
    
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-lg font-semibold">Name:</p>
          <p className="text-gray-600">{sellerData.name}</p>
        </div>
        <div>
          <p className="text-lg font-semibold">Date Created:</p>
          <p className="text-gray-600">{formatDate(sellerData?.date)}</p>
        </div>
        <div>
          <p className="text-lg font-semibold">Shop Name:</p>
          <p className="text-gray-600">{sellerData.shopName}</p>
        </div>
        <div>
          <p className="text-lg font-semibold">Shop Category:</p>
          <p className="text-gray-600">{sellerData?.category}</p>
        </div>
        <div>
          <p className="text-lg font-semibold">Sales:</p>
          <p className="text-gray-600">{sellerData.total_sales}</p>
        </div>
        {/* <div>
          <p className="text-lg font-semibold">Password:</p>
          <div className="flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              value={sellerData.password}
              readOnly
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={togglePasswordVisibility}
              className="ml-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        
        </div> */}
        <div>
          <p className="text-lg font-semibold">Email:</p>
          <p className="text-gray-600">{sellerData.email}</p>
        </div>
        
        <div>
          <p className="text-lg font-semibold">Orders:</p>
          <p className="text-gray-600">{sellerData.totalOrders}</p>
        </div>
        <div>
          <p className="text-lg font-semibold">Reviews:</p>
          <p className="text-gray-600">{sellerData.totalReviews}</p>
        </div>
      </div>
       :
       <div className='w-full h-40 flex justify-center items-center bg-'>
        <h2 className='text-xl '>Loading</h2>
       </div>
       }
      <SalesAnalytic sellerId = {uid}/>
      </div>
    </div>
  );
};

export default SellerDetails;
