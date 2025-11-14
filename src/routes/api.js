import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import {
  getAllSettings,
  getPublicSettings,
  getSetting,
  createSetting,
  updateSetting,
  deleteSetting
} from '../controllers/settingsController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Dashboard routes
router.get('/dashboard/stats', authenticateToken, getDashboardStats);

// Settings routes
router.get('/settings', authenticateToken, requireAdmin, getAllSettings);
router.get('/settings/public', getPublicSettings); // Public, no auth required
router.get('/settings/:key', authenticateToken, requireAdmin, getSetting);
router.post('/settings', authenticateToken, requireAdmin, createSetting);
router.put('/settings/:key', authenticateToken, requireAdmin, updateSetting);
router.delete('/settings/:key', authenticateToken, requireAdmin, deleteSetting);

export default router;