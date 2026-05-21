import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  moduleSlug: { type: String, ref: 'Module', required: true },
  title: { type: String, required: true },
  description: String,
  content: String,
  durationMin: { type: Number, default: 10 },
  level: { type: String, enum: ['Анхан', 'Дунд', 'Ахисан'], default: 'Анхан' },
  xpReward: { type: Number, default: 50 },
  order: { type: Number, default: 0 },
  requiredLessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', default: null },
  starsMax: { type: Number, default: 3 },
  isPremium: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
});

export default mongoose.model('Lesson', lessonSchema);
