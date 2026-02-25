import AICoreInterface from './AICoreInterface.js';

export default class AGIStub extends AICoreInterface {
  async understandQuery(query, context) {
    // In future, this will call a real AGI API.
    // For now, return a placeholder message.
    return {
      message: "AGI not yet available. This is a stub response.",
      confidence: 0,
    };
  }
  // ... other stubs
}
