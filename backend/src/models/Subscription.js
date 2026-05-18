import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['monthly', 'yearly'], required: true },
  status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
  startDate: { type: Date, default: Date.now },
  expireDate: { type: Date, required: true },
  paymentMethod: String,
  autoRenew: { type: Boolean, default: false }
});

export default mongoose.model('Subscription', subscriptionSchema);