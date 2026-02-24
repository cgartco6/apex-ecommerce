import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalUsers = await User.countDocuments();

  const totalRevenueResult = await Order.aggregate([
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  const totalRevenue = totalRevenueResult[0]?.total || 0;

  // Recent orders
  const recentOrders = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name');

  // Sales for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const salesData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        dailySales: { $sum: '$totalPrice' },
      },
    },
  ]);

  const salesMap = salesData.reduce((acc, item) => {
    acc[item._id] = item.dailySales;
    return acc;
  }, {});

  const chartLabels = last7Days;
  const chartValues = last7Days.map(day => salesMap[day] || 0);

  res.json({
    totalOrders,
    totalProducts,
    totalUsers,
    totalRevenue,
    recentOrders,
    chartLabels,
    chartValues,
  });
});

export { getDashboardStats };
