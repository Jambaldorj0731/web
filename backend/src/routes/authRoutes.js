import express from 'express';
import { login, sendRegisterOtp, verifyRegisterOtp, sendResetOtp, resetPassword } from '../controllers/authController.js';

const router = express.Router();

// Нэвтрэх
router.post('/auth/login', login);

// Бүртгүүлэх OTP
router.post('/auth/register/send-otp', sendRegisterOtp);
router.post('/auth/register/verify', verifyRegisterOtp);

// Нууц үг сэргээх
router.post('/auth/reset/send-otp', sendResetOtp);
router.post('/auth/reset/verify', resetPassword);

export default router;