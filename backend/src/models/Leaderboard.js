import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  period: { type: String, enum: ['weekly', 'monthly', 'alltime'], required: true },
  xpGained: { type: Number, default: 0 },
  rank: Number,
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Leaderboard', leaderboardSchema);