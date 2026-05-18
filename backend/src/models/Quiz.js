import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  moduleSlug: { type: String, ref: 'Module', required: true },
  title: String,
  timeLimit: Number,
  passingScore: { type: Number, default: 70 },
  isPremium: { type: Boolean, default: false }
});

export default mongoose.model('Quiz', quizSchema);