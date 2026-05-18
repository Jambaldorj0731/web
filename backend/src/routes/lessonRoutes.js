import express from 'express';
import { getLessonsByModule, getLessonById, completeLesson } from '../controllers/lessonController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/lessons/module/:moduleSlug', authMiddleware, getLessonsByModule);
router.get('/lessons/:id', authMiddleware, getLessonById);
router.post('/lessons/complete/:lessonId', authMiddleware, completeLesson);

export default router;