import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createPaymentIntent(amount, currency) {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
  });
}
