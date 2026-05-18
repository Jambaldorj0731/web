import express from 'express';
import { getQuizByModule, submitQuiz } from '../controllers/quizController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/quizzes/module/:moduleSlug', authMiddleware, getQuizByModule);
router.post('/quizzes/submit', authMiddleware, submitQuiz);

export default router;