import User from '../models/User.js';
import Progress from '../models/Progress.js';
import Lesson from '../models/Lesson.js';
import Module from '../models/Module.js';
import { getRankProgress } from '../utils/ranks.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');
    const { currentRank, nextRank, xpToNext } = getRankProgress(user.totalXp);
    if (user.rankName !== currentRank) {
      user.rankName = currentRank;
      await user.save();
    }
    res.json({
      id: user._id,
      full_name: user.fullName,
      short_name: user.shortName,
      avatar_url: user.avatarUrl,
      rank_name: currentRank,
      rank_position: user.rankPosition,
      xp: user.totalXp,
      streak_days: user.streakDays,
      badge_count: user.badgeCount,
      next_rank: nextRank,
      xp_to_next: xpToNext,
      phone: user.phone,
      role: user.role            // ✅ ЭНЭ МӨР ЗААВАЛ
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserModules = async (req, res) => {
  try {
    const modules = await Module.find().sort('order');
    const progresses = await Progress.find({ userId: req.user._id });
    const completedLessonIds = progresses.filter(p => p.completed).map(p => p.lessonId.toString());

    const modulesWithProgress = await Promise.all(modules.map(async (mod) => {
      const lessons = await Lesson.find({ moduleSlug: mod.slug });
      const total = lessons.length;
      const completed = lessons.filter(l => completedLessonIds.includes(l._id.toString())).length;
      const progress = total ? Math.round((completed / total) * 100) : 0;
      return {
        id: mod._id,
        slug: mod.slug,
        title: mod.title,
        icon: mod.icon,
        css_class: `m${mod.order}`,
        progress,
        completed_lessons: completed,
        total_lessons: total
      };
    }));
    res.json(modulesWithProgress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, shortName, avatarUrl } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'Хэрэглэгч олдсонгүй' });
    if (fullName !== undefined) user.fullName = fullName;
    if (shortName !== undefined) user.shortName = shortName;
    if (avatarUrl !== undefined) {
      if (avatarUrl && !String(avatarUrl).startsWith('data:image/')) {
        return res.status(400).json({ error: 'Зөвхөн зураг файл оруулна уу' });
      }
      if (avatarUrl && String(avatarUrl).length > 14 * 1024 * 1024) {
        return res.status(400).json({ error: 'Зураг хэт том байна. 10MB-аас бага зураг оруулна уу' });
      }
      user.avatarUrl = avatarUrl;
    }
    await user.save();
    res.json({ message: 'Профайл амжилттай шинэчлэгдлээ', user: { fullName: user.fullName, shortName: user.shortName, avatarUrl: user.avatarUrl } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'Хэрэглэгч олдсонгүй' });
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return res.status(400).json({ error: 'Хуучин нууц үг буруу байна' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Нууц үг амжилттай солигдлоо' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
