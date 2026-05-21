import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Хэт олон хүсэлт илгээсэн. Хэсэг хугацааны дараа дахин оролдоно уу.' }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: { error: 'Нэвтрэх оролдлого хэт олон байна. 15 минутын дараа дахин оролдоно уу.' }
});