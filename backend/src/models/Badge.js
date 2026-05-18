import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  icon: { type: String, default: 'star' },
  description: String,
  xpBonus: Number
});

export default mongoose.model('Badge', badgeSchema);