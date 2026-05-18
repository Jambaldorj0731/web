import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  completed: { type: Boolean, default: false },
  completedAt: Date,
  starsEarned: { type: Number, default: 0 },
  xpEarned: { type: Number, default: 0 }
});

progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });
export default mongoose.model('Progress', progressSchema);