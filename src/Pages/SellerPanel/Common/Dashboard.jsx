import React, { useContext, useEffect, useState } from 'react';
 
 
 
import { getFirestore, collection, getDocs, query, where, doc, getDoc, Timestamp } from 'firebase/firestore';
 
import { firestore } from '../../firebase/config';
import Card from './../Container/Card';
import { AppContext } from '../../Context/Context';
const { User, checkAuthAndRole, topalert } = useContext(AppContext);
const Dashboard = () => {
  const [totalSales, setTotalSales] = useState([
    { head: 'Total  Sales', sale: 0 },
    { head: 'This Week  Sales', sale: 0 },
    { head: 'This Month  Sales', sale: 0 },
  ]);
  const [totalUsers, setTotalUsers] = useState([
    { head: 'Total Sellers', total: 0 },
    { head: 'Total Mebership', total: 0 },
  ]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        // Fetch total sales from all sellers
        const sellersCollectionRef = collection(firestore, 'sellers');
        const sellersSnapshot = await getDocs(sellersCollectionRef);
        let totalSalesSum = 0;
        sellersSnapshot.forEach((sellerDoc) => {
          const sellerData = sellerDoc.data();
          totalSalesSum += sellerData.total_sales || 0;
        });
  
        // Fetch sold prices for this week
        const now = Timestamp.now();
        const lastWeek = new Timestamp(now.seconds - 7 * 24 * 60 * 60, now.nanoseconds);
        const lastMonth = new Timestamp(now.seconds - 30 * 24 * 60 * 60, now.nanoseconds);
  
        const ordersQueryThisWeek = query(
          collection(firestore, 'orders'),
          where('status', '==', 'complete'),
          where('order_date', '>=', lastWeek)
        );
  
        const ordersQueryThisMonth = query(
          collection(firestore, 'orders'),
          where('status', '==', 'complete'),
          where('order_date', '>=', lastMonth)
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
      } catch (error) {
        console.error('Error fetching sales data:', error.message);
      }
    };
  
    fetchSalesData();
  }, []);
  

  //fetching total sellers and membership 
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        // Fetch total sales from all sellers
        const sellersCollectionRef = collection(firestore, 'sellers');
        const sellersSnapshot = await getDocs(sellersCollectionRef);
        let totalSalesSum = 0;
        sellersSnapshot.forEach((sellerDoc) => {
          const sellerData = sellerDoc.data();
          totalSalesSum += sellerData.total_sales || 0;
        });

        // Fetch total number of sellers
        const totalSellers = sellersSnapshot.size;

        // Fetch total memberships from app_users collection
        const membershipsCollectionRef = collection(firestore, 'app_users');
        const membershipsSnapshot = await getDocs(membershipsCollectionRef);
        const totalMemberships = membershipsSnapshot.size;

        // Update total sales and total users state
        setTotalSales((prevTotalSales) => [
          { ...prevTotalSales[0], sale: totalSalesSum },
          ...prevTotalSales.slice(1), // No change for this week and this month sales
        ]);
        setTotalUsers([
          { head: 'Total Sellers', total: totalSellers },
          { head: 'Total Memberships', total: totalMemberships },
        ]);
      } catch (error) {
        console.error('Error fetching sales data:', error.message);
      }
    };

    fetchTotalUsers();
  }, []);

  return (
    <div className='p-2 m-3 bg-slate-100 lg:w-80v'>
      <div className='bg-white shadow-lg'>
        <div className='mt-5 flex w-auto bg-white justify-around p-3'>
          {totalSales.map((totalSale, index) => (
            <Card key={index} totalSales={totalSale} />
          ))}
        </div>
        <div className='mt-5 flex w-auto bg-white justify-evenly px-0 p-3'>
          {/* {totalUsers.map((totalUser, index) => (
            <TotalCard key={index} totalUser={totalUser} />
          ))} */}
        </div>
      </div>
      {/* <MembersDashboardChart /> */}
    </div>
  );
};

export default Dashboard;
