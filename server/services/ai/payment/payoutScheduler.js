import cron from 'node-cron';
import Payout from '../../models/Payout.js';
import { getRevenueForWeek } from '../../utils/revenue.js';
import { transferToBank } from './bankIntegrations.js';

cron.schedule('0 0 * * 0', async () => { // every Sunday
  const { week, year } = getCurrentWeekYear();
  const totalRevenue = await getRevenueForWeek(week, year);
  if (totalRevenue === 0) return;

  const distributions = [
    { account: 'owner_fnb', percentage: 35 },
    { account: 'african_bank', percentage: 15 },
    { account: 'ai_fnb', percentage: 20 },
    { account: 'reserve_fnb', percentage: 20 },
    // 10% is not distributed – it accumulates in reserve
  ];

  let distributedTotal = 0;
  const payout = new Payout({
    week, year, totalRevenue,
    distributions: [],
    reserveAccumulated: 0,
  });

  for (const d of distributions) {
    const amount = (totalRevenue * d.percentage) / 100;
    distributedTotal += amount;
    // Perform bank transfer
    const result = await transferToBank(d.account, amount);
    payout.distributions.push({
      accountName: d.account,
      bankDetails: getBankDetails(d.account),
      percentage: d.percentage,
      amount,
      status: result.success ? 'paid' : 'failed',
      paidAt: result.success ? new Date() : null,
    });
  }

  // 10% goes to reserve (accumulated)
  const reserveAdd = totalRevenue * 0.10;
  const previousReserve = await getPreviousReserveTotal();
  payout.reserveAccumulated = previousReserve + reserveAdd;
  await payout.save();

  // Update global reserve balance
  await updateReserveBalance(payout.reserveAccumulated);
});
