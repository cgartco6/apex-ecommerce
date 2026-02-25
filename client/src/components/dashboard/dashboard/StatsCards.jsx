import React from 'react';

const StatsCards = ({ stats }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
      <div className="stat-card">
        <h3>Total Orders</h3>
        <p>{stats.totalOrders}</p>
      </div>
      <div className="stat-card">
        <h3>Total Products</h3>
        <p>{stats.totalProducts}</p>
      </div>
      <div className="stat-card">
        <h3>Total Users</h3>
        <p>{stats.totalUsers}</p>
      </div>
      <div className="stat-card">
        <h3>Total Revenue</h3>
        <p>${stats.totalRevenue.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default StatsCards;
