import mongoose from 'mongoose';
import Lesson from '../models/Lesson.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';
import { hasActiveSubscription } from '../utils/subscription.js';

export const getLessonsByModule = async (req, res) => {
  const { moduleSlug } = req.params;
  const lessons = await Lesson.find({ moduleSlug, isActive: true }).sort('order');
  const progresses = await Progress.find({ userId: req.user._id });
  const isVip = await hasActiveSubscription(req.user._id);
  const completedMap = new Map(progresses.filter(p => p.completed).map(p => [p.lessonId.toString(), p]));

  const result = lessons.map(lesson => {
    const completed = completedMap.has(lesson._id.toString());
    let status = 'locked';
    if (completed) status = 'done';
    else if (lesson.isPremium && !isVip) status = 'vip_locked';
    else if (!lesson.requiredLessonId || completedMap.has(lesson.requiredLessonId.toString())) status = 'active';
    return {
      _id: lesson._id,
      name: lesson.title,
      meta: `${lesson.durationMin} мин · ${lesson.level} шат`,
      stars: completed ? (completedMap.get(lesson._id.toString()).starsEarned || 3) : null,
      status,
      isPremium: lesson.isPremium,
      xpReward: lesson.xpReward
    };
  });
  res.json({ moduleSlug, lessons: result });
};

export const getLessonById = async (req, res) => {
  const { id } = req.params;
  // ID-ийн бүтцийг шалгах (24 hex тэмдэгт)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Буруу ID формат' });
  }
  const lesson = await Lesson.findById(id).select('-__v');
  if (!lesson) return res.status(404).json({ error: 'Хичээл олдсонгүй' });
  if (lesson.isPremium && !(await hasActiveSubscription(req.user._id))) {
    return res.status(403).json({ error: 'Энэ хичээл VIP эрх шаардлагатай' });
  }
  const progress = await Progress.findOne({ userId: req.user._id, lessonId: id });
  res.json({ ...lesson.toObject(), completed: progress?.completed || false });
};

export const completeLesson = async (req, res) => {
  const { lessonId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(lessonId)) {
    return res.status(400).json({ error: 'Буруу ID формат' });
  }
  const userId = req.user._id;
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) return res.status(404).json({ error: 'Хичээл олдсонгүй' });
  if (lesson.isPremium && !(await hasActiveSubscription(userId))) {
    return res.status(403).json({ error: 'Энэ хичээл VIP эрх шаардлагатай' });
  }
  const existing = await Progress.findOne({ userId, lessonId });
  if (existing?.completed) return res.status(400).json({ error: 'Аль хэдийн дууссан' });
  const xpEarned = lesson.xpReward;
  await Progress.findOneAndUpdate(
    { userId, lessonId },
    { completed: true, completedAt: new Date(), xpEarned, starsEarned: 3 },
    { upsert: true }
  );
  await User.findByIdAndUpdate(userId, { $inc: { totalXp: xpEarned, streakDays: 1 }, lastActiveDate: new Date() });
  res.json({ success: true, xpEarned });
};
