import CurrentAIImplementation from './CurrentAIImplementation.js';
import AGIStub from './AGIStub.js';

const config = {
  useAGI: process.env.USE_AGI === 'true', // toggle via env
};

let instance;
if (config.useAGI) {
  instance = new AGIStub();
} else {
  instance = new CurrentAIImplementation();
}

export default instance;
