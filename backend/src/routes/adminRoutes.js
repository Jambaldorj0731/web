import express from 'express';
import {
  getAllLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  getAllUsers,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Хандах эрхгүй' });
  next();
};

router.use(authMiddleware, adminOnly);

router.get('/lessons', getAllLessons);
router.post('/lessons', createLesson);
router.put('/lessons/:id', updateLesson);
router.delete('/lessons/:id', deleteLesson);
router.get('/users', getAllUsers);
router.get('/questions', getAllQuestions);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

export default router;
