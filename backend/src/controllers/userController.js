import User from '../models/User.js';
import Progress from '../models/Progress.js';
import Lesson from '../models/Lesson.js';
import Module from '../models/Module.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');
    const xpForNextRank = 2000;
    const xpToNext = Math.max(0, xpForNextRank - user.totalXp);
    const nextRank = user.totalXp >= 2000 ? 'Улсын Аварга' : 'Аймгийн Арслан';
    res.json({
      id: user._id,
      full_name: user.fullName,
      short_name: user.shortName,
      rank_name: user.rankName,
      rank_position: user.rankPosition,
      xp: user.totalXp,
      streak_days: user.streakDays,
      badge_count: user.badgeCount,
      next_rank: nextRank,
      xp_to_next: xpToNext,
      phone: user.phone
    });
  } catch (err) {
    console.error(err);
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
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};