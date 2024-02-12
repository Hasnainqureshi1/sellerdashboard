import React from 'react';
import { Line} from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
const SalesAnalytic = () => {
  // Dummy sales data (replace with actual data from API or state)
  const salesData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Sales',
        data: [1000, 1500, 1200, 1800, 2000, 2500, 2200],
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
        <Line data={salesData}
          
        />
      </div>
    </div>
  );
};

export default SalesAnalytic;
