import express from 'express';
import { getProfile, getUserModules } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Анхаар: энд /user гэж давхардахгүй, учир нь app.js дотор /api/user аль хэдийн заагдсан
router.get('/user/profile', authMiddleware, getProfile);
router.get('/user/modules', authMiddleware, getUserModules);

export default router;