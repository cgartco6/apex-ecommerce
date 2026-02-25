import DesignProject from '../models/DesignProject.js';
import { generateDesign, aiReview } from '../services/ai/designAI.js';

export const createDesignProject = async (req, res) => {
  const project = await DesignProject.create({ ...req.body, client: req.user._id });
  // Trigger AI generation asynchronously
  generateDesignAsync(project._id);
  res.status(201).json(project);
};

async function generateDesignAsync(projectId) {
  const project = await DesignProject.findById(projectId);
  const designs = await generateDesign(project.description, project.style);
  // Run AI quality checks
  const reviewed = await Promise.all(designs.map(async d => {
    const review = await aiReview(d.url);
    d.qualityScore = review.score;
    return d;
  }));
  project.generatedDesigns = reviewed;
  project.status = 'quality_review';
  await project.save();
                                     }
