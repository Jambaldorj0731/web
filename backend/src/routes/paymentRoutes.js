import express from 'express';
import { createSubscription, getSubscription } from '../controllers/paymentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/payment/subscribe', authMiddleware, createSubscription);
router.get('/payment/status', authMiddleware, getSubscription);

export default router;