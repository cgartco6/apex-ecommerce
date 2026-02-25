import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesChart = ({ labels, values }) => {
  const data = {
    labels,
    datasets: [
      {
        label: 'Sales ($)',
        data: values,
        borderColor: 'var(--primary)',
        backgroundColor: 'rgba(42, 92, 143, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
  };

  return <Line data={data} options={options} />;
};

export default SalesChart;
