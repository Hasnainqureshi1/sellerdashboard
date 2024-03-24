import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../../firebase/config';
 

const SalesAnalytic = ({sellerId}) => {
  const [monthlySales, setMonthlySales] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
         
        console.log(sellerId);
        // Fetch sales data for the specific seller monthly
        const ordersCollectionRef = collection(firestore, 'orders');
        const ordersQuery = query(
          ordersCollectionRef,
          where('seller_id', '==', sellerId)
        );

        const ordersSnapshot = await getDocs(ordersQuery);
        const monthlySalesData = Array(12).fill(0); // Initialize monthly sales array

        ordersSnapshot.forEach((orderDoc) => {
          const orderData = orderDoc.data();
          console.log(orderData);
          const orderMonth = new Date(orderData.order_date.seconds * 1000).getMonth();
          
          monthlySalesData[orderMonth] += orderData.sold_price || 0;
        });

        setMonthlySales(monthlySalesData);

      } catch (error) {
        console.error('Error fetching sales data:', error.message);
      }
    };

    fetchSalesData();
  }, []);

  // Create labels for the months
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Construct sales data for the chart
  const salesData = {
    labels: months,
    datasets: [
      {
        label: 'Sales',
        data: monthlySales,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0,
      },
    ],
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg mt-4">
      <h2 className="text-2xl font-semibold mb-4">Sales Analytics</h2>
      <div className="flex justify-center flex-col">
        <Line data={salesData} />
      </div>
    </div>
  );
};

export default SalesAnalytic;
