import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import User from '../models/User.js';

dotenv.config();

const modules = [
  { slug: 'bukh', title: 'Хүчит Бөх', icon: 'dumbbell', order: 1, description: 'Монгол бөхийн түүх, мэх, цол, ёс заншил' },
  { slug: 'horse', title: 'Хурдан Морь', icon: 'route', order: 2, description: 'Монгол адуу, уралдаан, айрагны соёл' },
  { slug: 'livestock', title: 'Таван Хошуу', icon: 'layers', order: 3, description: 'Нүүдэлчин ахуйн таван эрдэнэ' },
  { slug: 'dairy', title: 'Цагаан Идээ', icon: 'droplets', order: 4, description: 'Сүүн бүтээгдэхүүн, хийх арга, хэрэглээ' },
  { slug: 'ger', title: 'Монгол Гэр', icon: 'home', order: 5, description: 'Гэрийн бүтэц, доторх ёс, бэлгэдэл' }
];

const lessons = [
  { moduleSlug: 'bukh', title: 'Монгол бөхийн гарал үүсэл', description: 'Бөхийн түүх, хадны зураг, наадмын уламжлал', content: 'Монгол бөх нь наадам, эрийн гурван наадам, цол чимэгтэй салшгүй холбоотой уламжлалт спорт юм.', durationMin: 12, level: 'Анхан', xpReward: 60, order: 1 },
  { moduleSlug: 'horse', title: 'Монгол адууны онцлог', description: 'Тэсвэр хатуужил, уралдаан, уяа сойлго', content: 'Монгол адуу жижиг биетэй боловч холын зам, эрс тэс уур амьсгалд тэсвэртэй гэдгээрээ онцлог.', durationMin: 12, level: 'Анхан', xpReward: 60, order: 1 },
  { moduleSlug: 'livestock', title: 'Таван хошуу мал', description: 'Адуу, үхэр, тэмээ, хонь, ямааны ач холбогдол', content: 'Таван хошуу мал нь нүүдэлчдийн хоол хүнс, хувцас, тээвэр, ахуйн үндсэн эх үүсвэр байсаар ирсэн.', durationMin: 15, level: 'Анхан', xpReward: 70, order: 1 },
  { moduleSlug: 'dairy', title: 'Цагаан идээний төрөл', description: 'Сүү, тараг, айраг, ааруул, өрөм', content: 'Цагаан идээ нь шим тэжээлтэйгээс гадна зочломтгой зан, баяр ёслолын чухал хэсэг юм.', durationMin: 10, level: 'Анхан', xpReward: 60, order: 1 },
  { moduleSlug: 'ger', title: 'Монгол гэрийн бүтэц', description: 'Хана, тооно, унь, багана, эсгий бүрээс', content: 'Монгол гэр нь нүүдлийн амьдралд тохирсон, хурдан барьж буулгах боломжтой сууц юм.', durationMin: 14, level: 'Анхан', xpReward: 70, order: 1 }
];

const quizzes = [
  {
    moduleSlug: 'bukh',
    title: 'Бөхийн мэдлэгийн шалгалт',
    questions: [
      { text: 'Монгол бөхийн дээд цол аль вэ?', options: ['Улсын заан', 'Улсын арслан', 'Дархан аварга', 'Даян аварга'], correctOptionIndex: 2 }
    ]
  },
  {
    moduleSlug: 'horse',
    title: 'Морь, айрагны соёл',
    questions: [
      { text: 'Гүүний сүүгээр юу хийдэг вэ?', options: ['Айраг', 'Тараг', 'Өрөм', 'Ааруул'], correctOptionIndex: 0 }
    ]
  },
  {
    moduleSlug: 'livestock',
    title: 'Таван хошуу мал',
    questions: [
      { text: 'Таван хошуу малд аль нь орох вэ?', options: ['Адуу, үхэр, тэмээ, хонь, ямаа', 'Адуу, буга, тэмээ, хонь, ямаа', 'Адуу, тахиа, тэмээ, хонь, ямаа'], correctOptionIndex: 0 }
    ]
  },
  {
    moduleSlug: 'dairy',
    title: 'Цагаан идээний урлал',
    questions: [
      { text: 'Ааруул хийх түүхий эд юу вэ?', options: ['Тараг', 'Аарц', 'Сүү', 'Ээзгий'], correctOptionIndex: 1 }
    ]
  },
  {
    moduleSlug: 'ger',
    title: 'Монгол гэр',
    questions: [
      { text: 'Гэрийн дээд хэсгийг юу гэж нэрлэдэг вэ?', options: ['Тооно', 'Хана', 'Унь', 'Багана'], correctOptionIndex: 0 }
    ]
  }
];

const upsertBy = (Model, filterKey, items) =>
  Promise.all(items.map((item) =>
    Model.updateOne(
      { [filterKey]: item[filterKey] },
      { $set: item },
      { upsert: true }
    )
  ));

const seedQuizzes = async () => {
  for (const quizData of quizzes) {
    const quiz = await Quiz.findOneAndUpdate(
      { moduleSlug: quizData.moduleSlug },
      { $set: { moduleSlug: quizData.moduleSlug, title: quizData.title, passingScore: 70, isPremium: false } },
      { new: true, upsert: true }
    );

    await Question.deleteMany({ quizId: quiz._id });
    await Question.insertMany(
      quizData.questions.map((question) => ({
        quizId: quiz._id,
        points: 20,
        ...question
      }))
    );
  }
};

const seedAdmin = async () => {
  const admin = await User.findOne({ phone: '+97688888888' });
  if (!admin) {
    await User.create({
      phone: '+97688888888',
      password: 'admin123',
      fullName: 'Админ хэрэглэгч',
      shortName: 'Админ',
      rankName: 'Админ',
      role: 'admin'
    });
    return;
  }

  admin.role = 'admin';
  admin.rankName = admin.rankName || 'Админ';
  await admin.save();
};

const seed = async () => {
  let exitCode = 0;
  try {
    await connectDB();
    await upsertBy(Module, 'slug', modules);
    await upsertBy(Lesson, 'title', lessons);
    await seedQuizzes();
    await seedAdmin();
    console.log('Seed completed: base DB data is ready.');
  } catch (err) {
    console.error('Seed error:', err);
    exitCode = 1;
  } finally {
    await mongoose.connection.close();
    process.exit(exitCode);
  }
};

seed();
