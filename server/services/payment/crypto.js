import Coinpayments from 'coinpayments';

const client = new Coinpayments({
  key: process.env.COINPAYMENTS_PUBLIC_KEY,
  secret: process.env.COINPAYMENTS_PRIVATE_KEY
});

export async function createCryptoTransaction(amount, currency) {
  return await client.createTransaction({
    amount,
    currency1: 'USD',
    currency2: currency,
    buyer_email: 'customer@example.com'
  });
}
