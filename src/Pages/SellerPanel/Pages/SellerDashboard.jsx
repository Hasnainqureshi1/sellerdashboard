import React, { useContext, useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, where, doc, getDoc, Timestamp } from 'firebase/firestore';
import { AppContext } from '../../../Context/Context';
import Card from '../../Admin/Container/Card';
import { firestore } from '../../../firebase/config';
import SetupStore from '../Container/SetupStore';
import RecentOrders from '../DashboardComp/RecentOrders';

const SellerDashboard = () => {
  const { User, checkAuthAndRole, topalert } = useContext(AppContext);
  const [isStoreSetup, setIsStoreSetup] = useState(false); // State to track if the store is set up or not
  const [totalSales, setTotalSales] = useState([
    { head: 'Total  Sales', sale: 0 },
    { head: 'This Week  Sales', sale: 0 },
    { head: 'This Month  Sales', sale: 0 },
  ]);
  const [totalUsers, setTotalUsers] = useState([
    { head: 'Total Sellers', total: 0 },
    { head: 'Total Mebership', total: 0 },
  ]);
  const uid = User.uid;

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        // Fetch total sales from the seller with the provided UID
        const ShopDocRef = doc(firestore, 'shop', uid);
        const ShopDocSnapshot = await getDoc(ShopDocRef);
       const shopLength =  ShopDocSnapshot ;
       console.log(shopLength)
       if (ShopDocSnapshot.exists()) {
        console.log("seller");
        setIsStoreSetup(false)
        // Fetch total sales from the seller with the provided UID
        const sellerDocRef = doc(firestore, 'sellers', uid);
        const sellerDocSnapshot = await getDoc(sellerDocRef);

        if (sellerDocSnapshot.exists()) {
          //if shop document exists then fetch seller details 
          //else to show setup store
          const sellerData = sellerDocSnapshot.data();
          const totalSalesSum = sellerData.total_sales || 0;
        
          // Fetch sold prices for this week
          const now = Timestamp.now();
          const lastWeek = new Timestamp(now.seconds - 7 * 24 * 60 * 60, now.nanoseconds);
          const lastMonth = new Timestamp(now.seconds - 30 * 24 * 60 * 60, now.nanoseconds);

          const ordersQueryThisWeek = query(
            collection(firestore, 'orders'),
            // where('status', '==', 'complete'),
            where('order_date', '>=', lastWeek),
            where('seller_id', '==', uid)
          );

          const ordersQueryThisMonth = query(
            collection(firestore, 'orders'),
            // where('status', '==', 'complete'),
            where('order_date', '>=', lastMonth),
            where('seller_id', '==', uid)
          );
          const [ordersSnapshotThisWeek, ordersSnapshotThisMonth] = await Promise.all([
            getDocs(ordersQueryThisWeek),
            getDocs(ordersQueryThisMonth)
          ]);

          
          let thisWeekSalesSum = 0;
          let thisMonthSalesSum = 0;

          ordersSnapshotThisWeek.forEach((orderDoc) => {
            const orderData = orderDoc.data();
            
            thisWeekSalesSum += orderData.sold_price || 0;
          });

          ordersSnapshotThisMonth.forEach((orderDoc) => {
            const orderData = orderDoc.data();
             
            thisMonthSalesSum += orderData.sold_price || 0;
          });

          // Update total sales state
          setTotalSales((prevTotalSales) => [
            { ...prevTotalSales[0], sale: totalSalesSum },
            { ...prevTotalSales[1], sale: thisWeekSalesSum },
            { ...prevTotalSales[2], sale: thisMonthSalesSum }
          ]);

          // Check if the store is already set up
          
        }  
        
      } else {
        setIsStoreSetup(true);
        console.log('Shop document does not exist');
      }
      
    
      } catch (error) {
        console.error('Error fetching sales data:', error.message);
      }
    };

    fetchSalesData();
  }, [uid]); // Make sure to include uid in the dependency array to re-fetch data when uid changes

  return (
    <div className='p-2 m-3 bg-slate-100 lg:w-80v '>
    {isStoreSetup ? (
      <SetupStore />
    ) : (
      <>
      <div className='bg-white shadow-lg '>
        {/* Render SetupStore component only if the store is not set up */}
      <> <div className='mt-5 flex w-auto bg-white justify-around p-3'>
          {totalSales.map((totalSale, index) => (
            <Card key={index} totalSales={totalSale} />
          ))}
        </div>
        <div className='mt-5 flex w-auto bg-white justify-evenly px-0 p-3'>
          {/* {totalUsers.map((totalUser, index) => (
            <TotalCard key={index} totalUser={totalUser} />
          ))} */}
        </div>
        </>
    </div>
      <RecentOrders userId = {uid}/>
      </> )}
      {/* <MembersDashboardChart /> */}
    </div>
  );
};

export default SellerDashboard;
