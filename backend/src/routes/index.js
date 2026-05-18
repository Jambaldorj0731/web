import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import lessonRoutes from './lessonRoutes.js';
import quizRoutes from './quizRoutes.js';
import leaderboardRoutes from './leaderboardRoutes.js';
import paymentRoutes from './paymentRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/lessons', lessonRoutes);
router.use('/quizzes', quizRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/payment', paymentRoutes);

export default router;