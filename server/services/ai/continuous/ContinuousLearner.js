import AICore from '../core/index.js';
import Interaction from '../../models/Interaction.js';

class ContinuousLearner {
  async ingestInteraction(interaction) {
    await Interaction.create(interaction);
    // If batch size reached, trigger retraining
    const count = await Interaction.countDocuments({ learned: false });
    if (count >= 100) {
      await this.retrain();
    }
  }

  async retrain() {
    const interactions = await Interaction.find({ learned: false });
    await AICore.learnFromInteraction(interactions);
    await Interaction.updateMany({ learned: false }, { learned: true });
  }
}
