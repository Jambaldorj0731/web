import Subscription from '../models/Subscription.js';

export const hasActiveSubscription = async (userId) => {
  const sub = await Subscription.findOne({ userId, status: 'active' }).sort('-startDate');
  return Boolean(sub && sub.expireDate > new Date());
};
