import User from '../models/User.js';

export const getLeaderboard = async (req, res) => {
  try {
    const { period = 'alltime', page = 1, limit = 20, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    let dateFilter = {};
    const now = new Date();
    if (period === 'weekly') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      dateFilter = { lastActiveDate: { $gte: weekAgo } };
    } else if (period === 'monthly') {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      dateFilter = { lastActiveDate: { $gte: monthAgo } };
    }

    let searchFilter = {};
    if (search && search.trim()) {
      searchFilter = {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { shortName: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const query = { ...dateFilter, ...searchFilter };
    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .sort({ totalXp: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('fullName shortName totalXp rankName streakDays badgeCount phone lastActiveDate');

    const usersWithRank = users.map((user, idx) => ({
      ...user.toObject(),
      rank: skip + idx + 1
    }));

    const myXp = req.user.totalXp;
    const myRank = await User.countDocuments({ totalXp: { $gt: myXp } }) + 1;

    res.json({
      users: usersWithRank,
      myRank,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Серверийн алдаа гарлаа' });
  }
};