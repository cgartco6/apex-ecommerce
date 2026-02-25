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
export const getSARSDeadlines = async (req, res) => {
  // In production, you could fetch from SARS API or maintain a database
  // For now, return hardcoded 2026 deadlines based on official sources [citation:1][citation:6]
  const deadlines = [
    {
      date: '2026-01-19',
      type: 'Provisional Tax',
      description: 'Final date for submitting Personal Income Tax returns for provisional taxpayers'
    },
    {
      date: '2026-02-25',
      type: 'VAT (if applicable)',
      description: 'VAT return and payment deadline (last business day of month)'
    },
    {
      date: '2026-06-30',
      type: 'Provisional Tax',
      description: 'First provisional tax payment deadline'
    },
    {
      date: '2026-09-30',
      type: 'Provisional Tax',
      description: 'Second provisional tax payment deadline'
    }
  ];
  
  res.json(deadlines);
};
