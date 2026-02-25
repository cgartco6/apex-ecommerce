export async function negotiate(projectDetails, clientMessage) {
  const basePrice = projectDetails.basePrice;
  const minPrice = basePrice * 0.8;
  const maxDiscount = 0.2;
  // Use RL to decide counteroffer based on client sentiment, history
  const counter = basePrice * (1 - Math.random() * maxDiscount); // placeholder
  return { offer: counter, validUntil: Date.now() + 86400000 };
}
