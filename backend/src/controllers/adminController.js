import Lesson from '../models/Lesson.js';
import User from '../models/User.js';
import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';

export const getAllLessons = async (req, res) => {
  const lessons = await Lesson.find().sort('order');
  res.json(lessons);
};

export const createLesson = async (req, res) => {
  const lesson = new Lesson({ ...req.body, isPremium: Boolean(req.body.isPremium) });
  await lesson.save();
  res.status(201).json(lesson);
};

export const updateLesson = async (req, res) => {
  const { id } = req.params;
  const lesson = await Lesson.findByIdAndUpdate(id, { ...req.body, isPremium: Boolean(req.body.isPremium) }, { new: true });
  res.json(lesson);
};

export const deleteLesson = async (req, res) => {
  const { id } = req.params;
  await Lesson.findByIdAndDelete(id);
  res.json({ message: 'Устгагдлаа' });
};

export const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

export const getAllQuestions = async (req, res) => {
  const quizzes = await Quiz.find().sort('moduleSlug');
  const quizById = new Map(quizzes.map(quiz => [quiz._id.toString(), quiz]));
  const questions = await Question.find().sort({ createdAt: -1 });

  res.json(questions.map(question => {
    const data = question.toObject();
    const quiz = quizById.get(question.quizId.toString());
    return {
      ...data,
      moduleSlug: quiz?.moduleSlug || '',
      quizTitle: quiz?.title || '',
      isPremium: Boolean(quiz?.isPremium)
    };
  }));
};

export const createQuestion = async (req, res) => {
  const { moduleSlug, quizTitle, text, options, correctOptionIndex, explanation, points, isPremium } = req.body;
  const cleanOptions = Array.isArray(options) ? options.map(opt => String(opt).trim()).filter(Boolean) : [];

  if (!moduleSlug || !text || cleanOptions.length < 2) {
    return res.status(400).json({ error: 'Модуль, асуулт, хамгийн багадаа 2 сонголт шаардлагатай' });
  }

  const correctIndex = Number(correctOptionIndex);
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= cleanOptions.length) {
    return res.status(400).json({ error: 'Зөв хариултын дугаар буруу байна' });
  }

  const quiz = await Quiz.findOneAndUpdate(
    { moduleSlug },
    {
      $set: { isPremium: Boolean(isPremium) },
      $setOnInsert: {
        moduleSlug,
        title: quizTitle || `${moduleSlug} шалгалт`,
        passingScore: 70
      }
    },
    { upsert: true, new: true }
  );

  const question = await Question.create({
    quizId: quiz._id,
    text,
    options: cleanOptions,
    correctOptionIndex: correctIndex,
    explanation,
    points: Number(points) || 10
  });

  res.status(201).json({ ...question.toObject(), moduleSlug: quiz.moduleSlug, quizTitle: quiz.title });
};

export const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { moduleSlug, quizTitle, text, options, correctOptionIndex, explanation, points, isPremium } = req.body;
  const cleanOptions = Array.isArray(options) ? options.map(opt => String(opt).trim()).filter(Boolean) : [];

  if (!moduleSlug || !text || cleanOptions.length < 2) {
    return res.status(400).json({ error: 'Модуль, асуулт, хамгийн багадаа 2 сонголт шаардлагатай' });
  }

  const correctIndex = Number(correctOptionIndex);
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= cleanOptions.length) {
    return res.status(400).json({ error: 'Зөв хариултын дугаар буруу байна' });
  }

  const quiz = await Quiz.findOneAndUpdate(
    { moduleSlug },
    {
      $set: { isPremium: Boolean(isPremium) },
      $setOnInsert: {
        moduleSlug,
        title: quizTitle || `${moduleSlug} шалгалт`,
        passingScore: 70
      }
    },
    { upsert: true, new: true }
  );

  const question = await Question.findByIdAndUpdate(
    id,
    {
      quizId: quiz._id,
      text,
      options: cleanOptions,
      correctOptionIndex: correctIndex,
      explanation,
      points: Number(points) || 10
    },
    { new: true }
  );

  if (!question) return res.status(404).json({ error: 'Асуулт олдсонгүй' });
  res.json({ ...question.toObject(), moduleSlug: quiz.moduleSlug, quizTitle: quiz.title });
};

export const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  await Question.findByIdAndDelete(id);
  res.json({ message: 'Асуулт устгагдлаа' });
};
