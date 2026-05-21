import express from 'express';
import { getProfile, getUserModules, updateProfile, changePassword } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/user/profile', authMiddleware, getProfile);
router.get('/user/modules', authMiddleware, getUserModules);
router.put('/user/profile', authMiddleware, updateProfile);
router.put('/user/change-password', authMiddleware, changePassword);

export default router;   // <-- ЭНЭ МӨР ЗААВАЛ БАЙХ ЁСТОЙ