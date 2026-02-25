const paymentTransactionSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  currency: { type: String, enum: ['ZAR', 'USD', 'EUR', 'BTC', 'USDT', ...] },
  gateway: { type: String, enum: ['payfast', 'paypal', 'stripe', 'crypto'] },
  status: String,
  reference: String,
  metadata: Object,
});
