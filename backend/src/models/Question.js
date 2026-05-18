import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  text: String,
  options: [String],
  correctOptionIndex: Number,
  explanation: String,
  points: { type: Number, default: 10 }
});

export default mongoose.model('Question', questionSchema);