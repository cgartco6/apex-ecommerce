import { spawn } from 'child_process';
import AIModelVersion from '../../models/AIModelVersion.js';
import { evaluateModel } from './evaluator.js';
import { trainModel } from './trainer.js';

const agents = {}; // active agent processes

// Monitor all models hourly
setInterval(async () => {
  const models = await AIModelVersion.find({ status: 'active' });
  for (const model of models) {
    const score = await evaluateModel(model);
    if (score < model.threshold) {
      // Trigger retraining
      trainModel(model.type, model.trainingData);
      // Spawn a new agent with updated weights
      spawnAgent(model.type, model.newVersion);
    }
  }
}, 60 * 60 * 1000);

function spawnAgent(type, version) {
  // Kill old agent if exists
  if (agents[type]) agents[type].kill();
  const agent = spawn('python', [`agents/${type}_v${version}.py`]);
  agents[type] = agent;
}
