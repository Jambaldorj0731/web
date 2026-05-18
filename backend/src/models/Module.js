import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  icon: { type: String, default: 'dumbbell' },
  description: String,
  order: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: false },
  totalLessons: { type: Number, default: 0 },
  totalXp: { type: Number, default: 0 }
});

export default mongoose.model('Module', moduleSchema);