import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createEmailCampaign,
  getEmailCampaigns,
  scheduleSocialPost,
} from '../controllers/marketingController.js';

const router = express.Router();

router.route('/email').post(protect, createEmailCampaign).get(protect, getEmailCampaigns);
router.route('/social').post(protect, scheduleSocialPost);

export default router;
