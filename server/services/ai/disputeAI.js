export async function evaluateDispute(disputeId) {
  const dispute = await Dispute.findById(disputeId).populate('project');
  const chatLog = await getChatLog(dispute.client);
  const prompt = `Dispute: ${dispute.reason}\nEvidence: ${dispute.evidence}\nChat: ${chatLog}\nSuggest resolution.`;
  const aiSuggestion = await callLLM(prompt);
  // Apply rules: if within policy, auto-resolve; else flag for human
  return aiSuggestion;
}
