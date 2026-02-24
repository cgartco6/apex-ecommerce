import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useGetSalesDataQuery } from '../../store/api/dashboardApi'; // RTK Query example

const SalesChart = () => {
  const { data, isLoading } = useGetSalesDataQuery();
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (data) {
      setChartData({
        labels: data.labels, // e.g., ['Mon', 'Tue', ...]
        datasets: [
          {
            label: 'Sales ($)',
            data: data.values,
            borderColor: 'var(--primary)',
            backgroundColor: 'rgba(42, 92, 143, 0.2)',
            tension: 0.4,
          },
        ],
      });
    }
  }, [data]);

  if (isLoading) return <div>Loading chart...</div>;

  return <Line data={chartData} />;
};

export default SalesChart;
