import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

const otpStore = new Map();

// ---------------------------
// 1. Нэвтрэх
// ---------------------------
export const login = async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ error: 'Утасны дугаар, нууц үгээ оруулна уу' });
  }
  const user = await User.findOne({ phone });
  if (!user) {
    return res.status(404).json({ error: 'Бүртгэл олдсонгүй' });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Нууц үг буруу байна' });
  }
  const token = generateToken(user._id);
  res.json({ token, user: { id: user._id, phone: user.phone, fullName: user.fullName, xp: user.totalXp } });
};

// ---------------------------
// 2. Бүртгүүлэх OTP илгээх
// ---------------------------
export const sendRegisterOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Утасны дугаар шаардлагатай' });
  // Бүртгэлтэй эсэхийг шалгах
  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return res.status(400).json({ error: 'Энэ дугаар аль хэдийн бүртгэлтэй байна. Нэвтрэх хэсэгт ороно уу.' });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(phone, otp);
  console.log(`📱 Бүртгүүлэх OTP for ${phone}: ${otp}`);
  res.json({ message: 'OTP илгээгдлээ', demoOtp: otp });
};

// ---------------------------
// 3. OTP баталгаажуулж, шинэ хэрэглэгч үүсгэх (ЗӨВХӨН БАЙХГҮЙ ҮЕД)
// ---------------------------
export const verifyRegisterOtp = async (req, res) => {
  const { phone, otp, password, fullName } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Нууц үг шаардлагатай' });
  }
  const storedOtp = otpStore.get(phone);
  if (!storedOtp || storedOtp !== otp) {
    return res.status(400).json({ error: 'OTP код буруу байна' });
  }
  otpStore.delete(phone);

  // Дахин шалгах: энэ хооронд өөр хүсэлтээр хэрэглэгч үүсээгүй эсэх
  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return res.status(400).json({ error: 'Энэ дугаар аль хэдийн бүртгэлтэй байна.' });
  }

  // Шинэ хэрэглэгч үүсгэх
  const user = await User.create({
    phone,
    password,
    fullName: fullName || 'Шинэ хэрэглэгч',
    shortName: fullName ? fullName.charAt(0) : 'Х',
    totalXp: 0,
    streakDays: 0,
    rankName: 'Сумын Заан',
    badgeCount: 0
  });
  const token = generateToken(user._id);
  res.json({ token, user: { id: user._id, phone: user.phone, fullName: user.fullName, xp: user.totalXp } });
};

// ---------------------------
// 4. Нууц үг сэргээх (сонголт)
// ---------------------------
export const sendResetOtp = async (req, res) => {
  const { phone } = req.body;
  const user = await User.findOne({ phone });
  if (!user) return res.status(404).json({ error: 'Бүртгэл олдсонгүй' });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(phone, otp);
  console.log(`🔐 Нууц үг сэргээх OTP for ${phone}: ${otp}`);
  res.json({ message: 'Нууц үг сэргээх код илгээгдлээ' });
};

export const resetPassword = async (req, res) => {
  const { phone, otp, newPassword } = req.body;
  const storedOtp = otpStore.get(phone);
  if (!storedOtp || storedOtp !== otp) {
    return res.status(400).json({ error: 'OTP код буруу' });
  }
  otpStore.delete(phone);
  const user = await User.findOne({ phone });
  if (!user) return res.status(404).json({ error: 'Хэрэглэгч олдсонгүй' });
  user.password = newPassword;
  await user.save();
  res.json({ message: 'Нууц үг амжилттай шинэчлэгдлээ' });
};