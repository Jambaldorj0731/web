import express from 'express';
import { getLeaderboard } from '../controllers/leaderboardController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Зам: /api/leaderboard
router.get('/leaderboard', authMiddleware, getLeaderboard);

export default router;