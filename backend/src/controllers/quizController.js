import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import User from '../models/User.js';
import { hasActiveSubscription } from '../utils/subscription.js';

export const getQuizByModule = async (req, res) => {
  const { moduleSlug } = req.params;
  const quiz = await Quiz.findOne({ moduleSlug });
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  if (quiz.isPremium && !(await hasActiveSubscription(req.user._id))) {
    return res.status(403).json({ error: 'Энэ шалгалт VIP эрх шаардлагатай', requiresVip: true });
  }
  const questions = await Question.find({ quizId: quiz._id }).select('-correctOptionIndex');
  res.json({ quiz, questions });
};

export const submitQuiz = async (req, res) => {
  const { moduleSlug, answers = [] } = req.body;
  const quiz = await Quiz.findOne({ moduleSlug });
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  if (quiz.isPremium && !(await hasActiveSubscription(req.user._id))) {
    return res.status(403).json({ error: 'Энэ шалгалт VIP эрх шаардлагатай', requiresVip: true });
  }
  const questions = await Question.find({ quizId: quiz._id });
  if (questions.length === 0) return res.status(400).json({ error: 'Энэ шалгалтад асуулт алга байна' });
  let score = 0;
  const results = [];
  for (const q of questions) {
    const userAnswer = answers.find(a => a.questionId === q._id.toString());
    const isCorrect = userAnswer && userAnswer.selectedIndex === q.correctOptionIndex;
    if (isCorrect) score += q.points;
    results.push({ questionId: q._id, correct: isCorrect, correctIndex: q.correctOptionIndex, explanation: q.explanation });
  }
  const totalPoints = questions.reduce((s, q) => s + q.points, 0);
  const percent = (score / totalPoints) * 100;
  const passed = percent >= quiz.passingScore;
  const xpEarned = passed ? 100 : 0;
  if (passed) {
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalXp: xpEarned } });
  }
  res.json({ score, totalPoints, percent, passed, xpEarned, results });
};
