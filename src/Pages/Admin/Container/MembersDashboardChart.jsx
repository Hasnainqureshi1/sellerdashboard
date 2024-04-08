import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { firestore } from '../../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
 
import { Chart, registerables } from 'chart.js'; // Import required chart types
  
Chart.register(...registerables);
const MembersDashboardChart = () => {
  const [monthlyData, setMonthlyData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Sellers Joined',
        data: [],
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      const sellersCollection = collection(firestore, 'sellers');
      const appUsersCollection = collection(firestore, 'app_users');

      const [sellersQuerySnapshot, appUsersQuerySnapshot] = await Promise.all([
        getDocs(sellersCollection),
        getDocs(appUsersCollection),
      ]);

      const sellersData = Array.from({ length: 12 }, () => 0);
      const appUsersData = Array.from({ length: 12 }, () => 0);

      sellersQuerySnapshot.forEach((sellerDoc) => {
        const sellerData = sellerDoc.data();
        const joinedMonth = new Date(sellerData.date.seconds * 1000).getMonth();
        if (joinedMonth >= 0 && joinedMonth <= 11) {
          sellersData[joinedMonth]++;
        }
      });

      appUsersQuerySnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        console.log(userData);
        const joinedMonth = new Date(userData.date.seconds * 1000).getMonth();
        if (joinedMonth >= 0 && joinedMonth <= 11) {
          appUsersData[joinedMonth]++;
        }
      });

      setMonthlyData({
        labels: months,
        datasets: [
          {
            label: 'Sellers Joined',
            data: sellersData,
            backgroundColor: 'rgba(0, 123, 255, 0.5)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1,
          },
          {
            label: 'App Users Joined',
            data: appUsersData,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      });
    };

    fetchData();
  }, [monthlyData]);

  const monthlyChartOptions = {
    scales: {
      x: {
        title: { display: true, text: 'Month' },
      },
      y: {
        title: { display: true, text: 'Number of Joinings' },
      },
    },
  };

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 gap-4">
        {/* Monthly chart */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold mb-2">Monthly Joins</h3>
          <Bar data={monthlyData} options={monthlyChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default MembersDashboardChart;
