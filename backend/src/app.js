import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { limiter, authLimiter } from './middleware/rateLimit.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();
const app = express();

// Security
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '14mb' }));

// Rate limiting
app.use('/api', limiter);
app.use('/api/auth/login', authLimiter);

// ========== РОУТУУД ==========
app.use('/api', authRoutes);        // /api/auth/...
app.use('/api', userRoutes);        // /api/user/...
app.use('/api', lessonRoutes);      // /api/lessons/...
app.use('/api', quizRoutes);        // /api/quizzes/...
app.use('/api', leaderboardRoutes); // /api/leaderboard/...
app.use('/api', paymentRoutes);     // /api/payment/...
app.use('/api/admin', adminRoutes); // /api/admin/...

// Health check
app.get('/health', (req, res) => res.send('OK'));

// 404 болон error handler (хамгийн сүүлд)
app.use(notFound);
app.use(errorHandler);

export default app;
