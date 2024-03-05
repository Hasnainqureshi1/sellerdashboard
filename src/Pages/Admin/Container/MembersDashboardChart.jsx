import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js'; // Import required chart types
Chart.register(...registerables);
// import { fetchSellerDataByMonth, fetchSellerDataByYear } from './your-api-calls'; // Replace with your API calls

const MembersDashboardChart = () => {
  
  const [monthlyData, setMonthlyData] = useState({
   labels: [],
   datasets: [
     {
       label: 'Monthly Memberships',
       data: [],
       fill: false,
       fillColor:[],
       borderColor: 'rgb(75, 192, 192)',
       tension: 0,
     },
   ],
 } );
  const [transformedMonthData, setTransformedMonthData] = useState({
   labels: [],
   datasets: [
     {
       label: 'Monthly Memberships',
       data: [],
       fill: false,
       fillColor:[],
       borderColor: 'rgb(75, 192, 192)',
       tension: 0,
     },
   ],
 });
  useEffect(() => {
    const fetchData = async () => {
     const monthData = {
      'Jan': 34,
      'Feb': 34,
      'March': 22,
      'April': 26,
      'May': 41,
      'June': 16,
      'July': 46,
      'Aug': 10,
      'Sep': 17,
      'Oct': 40,
      'Nov': 42,
      'Dec': 13
    };
    
    const yearData = {
      '2023': 190,
      '2024': 138
    };
     
    setTransformedMonthData({
     labels: Object.keys(monthData),
     datasets: [
       {
         label: ' Sellers Joined',
         data: Object.values(monthData), // Updated data
         fill: false,
         fillColor: ["rgba(0,10,220,0.5)","rgba(220,0,10,0.5)","rgba(220,0,0,0.5)","rgba(120,250,120,0.5)" ],
            strokeColor: "rgba(220,220,220,0.8)", 
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
         tension: 0,
       },
     ],
   });
    setMonthlyData({
     labels: Object.keys(monthData),
     datasets: [
       {
         label: ' Membership Joined',
         data: Object.values(monthData), // Updated data
         fill: false,
         fillColor: ["rgba(0,10,220,0.5)","rgba(220,0,10,0.5)","rgba(220,0,0,0.5)","rgba(120,250,120,0.5)" ],
            strokeColor: "rgba(220,220,220,0.8)", 
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
         tension: 0,
       },
     ],
   });
 

      // Check if data is fetched successfully before setting state
      
    };

    fetchData();
  }, []);
  const salesData = {
   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
   datasets: [
     {
       label: 'Monthly Memberships',
       data:[1000, 1500, 1200, 1800, 2000, 2500, 2200],
       fill: false, // Remove fill if you don't want the area under the line filled
       borderColor: 'rgb(75, 192, 192)', // Customize border color
       tension: 0, // Remove line curve if you prefer a straight line
     },
   ],
 };
  const monthlyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        title: { display: true, text: 'Month' },
      },
      y: {
        title: { display: true, text: 'Number of Sellers Joined' },
      },
    },
  };

  const yearlyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        title: { display: true, text: 'Year' },
      },
      y: {
        title: { display: true, text: 'Number of Sellers Joined' },
      },
    },
  };

  return (
    <div className="mt-8">
 
      <div className="grid grid-cols-1 gap-4">
        {/* Monthly chart */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold mb-2"> Membership Joins</h3>
          <Bar data={monthlyData}  />
        </div>

        {/* Yearly chart */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold mb-2"> Seller Joins</h3>
       

          <Line data={transformedMonthData}  />
     
        </div>
      </div>
    </div>
  );
};

export default MembersDashboardChart;
