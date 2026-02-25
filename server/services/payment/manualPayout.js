import Payout from '../../models/Payout.js';
import { sendEmail } from '../../utils/email.js';

export async function processManualPayout(payoutId) {
  const payout = await Payout.findById(payoutId);
  if (!payout) return;

  for (const dist of payout.distributions) {
    if (dist.status === 'pending') {
      // Generate payment instruction
      const instruction = `
        Please pay R${dist.amount} to:
        Bank: ${dist.bankDetails.bank}
        Account Name: ${dist.bankDetails.accountName}
        Account Number: ${dist.bankDetails.accountNumber}
        Branch Code: ${dist.bankDetails.branchCode}
        Reference: PAYOUT-${payout.week}-${payout.year}
      `;
      // Email the instruction to the owner (or to the bank if they have a payment portal)
      await sendEmail('owner@example.com', 'Payout Instruction', instruction);
      dist.status = 'instruction_sent';
    }
  }
  await payout.save();
                      }
