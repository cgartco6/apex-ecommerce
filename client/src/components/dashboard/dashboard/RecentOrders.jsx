import React from 'react';

const RecentOrders = ({ orders }) => {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th>Total</th>
          <th>Paid</th>
          <th>Delivered</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order._id}>
            <td>{order._id}</td>
            <td>{order.user?.name}</td>
            <td>${order.totalPrice}</td>
            <td>{order.isPaid ? 'Yes' : 'No'}</td>
            <td>{order.isDelivered ? 'Yes' : 'No'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RecentOrders;
