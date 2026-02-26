import PaymentTransaction from '../../models/PaymentTransaction.js';

export async function getAvailableBalance() {
  const result = await PaymentTransaction.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  return result[0]?.total || 0;
}
