const payoutSchema = new mongoose.Schema({
  week: { type: Number, required: true }, // week number of year
  year: { type: Number, required: true },
  totalRevenue: Number,
  distributions: [{
    accountName: String,      // e.g., 'Owner FNB', 'African Bank', 'AI FNB', 'Reserve FNB'
    bankDetails: Object,
    percentage: Number,
    amount: Number,
    status: { type: String, enum: ['pending', 'paid', 'failed'] },
    paidAt: Date,
  }],
  reserveAccumulated: Number, // running total of 10% never paid
});
