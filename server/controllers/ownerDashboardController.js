import RevenueTarget from '../models/RevenueTarget.js';
import ImpulseBuyer from '../models/ImpulseBuyer.js';
import Order from '../models/Order.js';

export const getRevenueStats = async (req, res) => {
  const today = new Date().setHours(0,0,0,0);
  const revenueToday = await Order.aggregate([
    { $match: { createdAt: { $gte: today } } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);
  const totalRevenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]);
  const targets = await RevenueTarget.find({ endDate: { $gte: new Date() } });
  const impulseBuyers = await ImpulseBuyer.countDocuments({ purchaseAt: { $gte: today } });
  res.json({ revenueToday: revenueToday[0]?.total || 0, totalRevenue: totalRevenue[0]?.total || 0, targets, impulseBuyers });
};
