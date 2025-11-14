import express from 'express';
import passport from '../config/passport.js';
import { login, register, googleCallback, getCurrentUser } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Email/Password authentication
router.post('/login', login);
router.post('/register', register);

// Get current user
router.get('/me', authenticateToken, getCurrentUser);

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);

export default router;