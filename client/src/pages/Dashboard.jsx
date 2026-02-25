import React from 'react';
import { useGetDashboardStatsQuery } from '../store/api/dashboardApi';
import StatsCards from '../components/dashboard/StatsCards';
import SalesChart from '../components/dashboard/SalesChart';
import RecentOrders from '../components/dashboard/RecentOrders';

const Dashboard = () => {
  const { data, isLoading, error } = useGetDashboardStatsQuery();

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading dashboard</div>;

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <StatsCards stats={data} />
      <div style={{ marginTop: '2rem' }}>
        <h2>Sales (Last 7 Days)</h2>
        <SalesChart labels={data.chartLabels} values={data.chartValues} />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <h2>Recent Orders</h2>
        <RecentOrders orders={data.recentOrders} />
      </div>
    </div>
  );
};

export default Dashboard;
