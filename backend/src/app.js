import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Бүх роутуудыг холбох
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', lessonRoutes);
app.use('/api', quizRoutes);
app.use('/api', leaderboardRoutes);   // ✅ энэ мөр байх ёстой
app.use('/api', paymentRoutes);

app.get('/health', (req, res) => res.send('OK'));

app.use(notFound);
app.use(errorHandler);

export default app;