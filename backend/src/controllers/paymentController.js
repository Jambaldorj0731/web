import Subscription from '../models/Subscription.js';

export const createSubscription = async (req, res) => {
  const { plan, method } = req.body;
  const userId = req.user._id;
  const now = new Date();
  const expireDate = new Date();
  if (plan === 'monthly') expireDate.setMonth(expireDate.getMonth() + 1);
  else expireDate.setFullYear(expireDate.getFullYear() + 1);

  await Subscription.updateMany({ userId, status: 'active' }, { status: 'cancelled' });
  const subscription = await Subscription.create({
    userId,
    plan,
    status: 'active',
    startDate: now,
    expireDate,
    paymentMethod: method
  });
  res.json({ success: true, subscription });
};

export const getSubscription = async (req, res) => {
  const sub = await Subscription.findOne({ userId: req.user._id, status: 'active' }).sort('-startDate');
  const isVip = sub && sub.expireDate > new Date();
  res.json({ active: isVip, plan: sub?.plan, expiresAt: sub?.expireDate });
};