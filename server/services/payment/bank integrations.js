// Manual EFT instruction generation
export function generateEFTInstruction(amount, accountDetails) {
  return {
    bank: accountDetails.bank,
    accountName: accountDetails.accountName,
    accountNumber: accountDetails.accountNumber,
    reference: `PAY-${Date.now()}`,
    amount
  };
}
