import React, { useEffect, useState } from 'react';
import Card from './Container/Card';
import TotalCard from './Container/TotalCard';
import MembersDashboardChart from './Container/MembersDashboardChart';
import { getFirestore, collection, getDocs, query, where, doc, getDoc, Timestamp } from 'firebase/firestore';
 
import { firestore } from '../../firebase/config';

const Dashboard = () => {
  const [totalSales, setTotalSales] = useState([
    { head: 'Total Market Sales', sale: 0 },
    { head: 'This Week Market Sales', sale: 0 },
    { head: 'This Month Market Sales', sale: 0 },
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
  

  return (
    <div className='p-2 m-3 bg-slate-100 lg:w-80v'>
      <div className='bg-white shadow-lg'>
        <div className='mt-5 flex w-auto bg-white justify-around p-3'>
          {totalSales.map((totalSale, index) => (
            <Card key={index} totalSales={totalSale} />
          ))}
        </div>
        <div className='mt-5 flex w-auto bg-white justify-evenly px-0 p-3'>
          {totalUsers.map((totalUser, index) => (
            <TotalCard key={index} totalUser={totalUser} />
          ))}
        </div>
      </div>
      <MembersDashboardChart />
    </div>
  );
};

export default Dashboard;
