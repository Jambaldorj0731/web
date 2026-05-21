import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import User from '../models/User.js';
import Badge from '../models/Badge.js';

dotenv.config();
connectDB();

const seed = async () => {
  try {
    // 1. Модулиуд
    const modules = [
      { slug: 'bukh', title: 'Хүчит Бөх', icon: 'dumbbell', order: 1, description: 'Монгол бөхийн түүх, мэх, цол, ёс заншил' },
      { slug: 'horse', title: 'Хурдан Морь', icon: 'route', order: 2, description: 'Монгол адууны үүлдэр, уралдааны соёл, айраг' },
      { slug: 'livestock', title: 'Таван Хошуу', icon: 'layers', order: 3, description: 'Адуу, үхэр, тэмээ, хонь, ямаа – таван эрдэнэ' },
      { slug: 'dairy', title: 'Цагаан Идээ', icon: 'droplets', order: 4, description: 'Сүүн бүтээгдэхүүний төрөл, хийх арга, ач холбогдол' },
      { slug: 'ger', title: 'Монгол Гэр', icon: 'home', order: 5, description: 'Гэрийн бүтэц, хээ угалз, нүүдэлчдийн орон зай' }
    ];
    if (await Module.countDocuments() === 0) {
      await Module.insertMany(modules);
    }

    // 2. Хичээлүүд (модуль тус бүрт 4-5)
    const lessonsData = [
      // --- Бөх ---
      { moduleSlug: 'bukh', title: 'Монгол бөхийн гарал үүсэл', description: 'Бөхийн түүх, хадны зураг, 7000 жилийн замнал', content: 'Дундговь аймгийн Өлзийт сумын Дэл хөнжлийн ууланд монгол бөхийн барилдаанаар наадам хийж байсан хадны зураг олдсон байна. Энэ зураг хүрлийн үеийн дурсгалд холбогдож байгаагаас үзэхэд 7,000- 11,000 жилийн өмнөх үед хамаарах ба хамгийн багаар бодоход 7,000 жилийн өмнө монгол бөх байсан гэсэн үг юм.', durationMin: 12, level: 'Анхан', xpReward: 60, order: 1 },
      { moduleSlug: 'bukh', title: '64 мэхийн ангилал', description: 'Дотор мэх, гадаад мэх, хар мэх', content: 'Ачих, бусгах, гуд татах ...', durationMin: 15, level: 'Дунд', xpReward: 80, order: 2 },
      { moduleSlug: 'bukh', title: 'Цол, чимэг, зодог', description: 'Начин, харцага, заан, арслан, аварга цолны чимэг, зодогны бэлгэдэл', content: 'Цолны эрэмбэ, улаан зодог, хөх шуудаг...', durationMin: 10, level: 'Анхан', xpReward: 50, order: 3 },
      { moduleSlug: 'bukh', title: 'Алдарт бөхчүүд', description: 'Дархан аварга Б.Бат-Эрдэнэ, Х.Баянмөнх, Ж.Мөнхбат нарын амжилт', content: 'Нийт 11 түрүү, 10 түрүү...', durationMin: 8, level: 'Дунд', xpReward: 70, order: 4 },
      // --- Морь ---
      { moduleSlug: 'horse', title: 'Монгол адууны үүлдэр, онцлог', description: 'Тахиас гаралтай, хагас зэрлэг, тэсвэр хатуужил', content: 'Монгол адуу жижиг биетэй, дэл сүүл урт, тахгүй явах чадвартай...', durationMin: 12, level: 'Анхан', xpReward: 60, order: 1 },
      { moduleSlug: 'horse', title: 'Айраг исгэх урлал', description: 'Гүүний сүүгээр айраг хийх журам', content: 'Сааж, хөхүүлж, хутгаж, исгэх...', durationMin: 14, level: 'Дунд', xpReward: 80, order: 2 },
      { moduleSlug: 'horse', title: 'Морины уралдааны соёл', description: 'Наадам, хурдан морины бэлтгэл, уяа сойлго', content: 'Хурдан морийг хүүхэд унуулна, 35 км зайд давхилна...', durationMin: 10, level: 'Ахисан', xpReward: 100, order: 3, isPremium: true },
      { moduleSlug: 'horse', title: 'Морины нас, шинж', description: 'Унага, даага, үрээ, хязаалан, соёолон гэх мэт', content: 'Шүдээр нас тогтоох, хурдны шинж чанар...', durationMin: 8, level: 'Анхан', xpReward: 50, order: 4 },
      // --- Таван хошуу ---
      { moduleSlug: 'livestock', title: 'Таван хошуу мал ба тэдгээрийн ач холбогдол', description: 'Адуу, үхэр, тэмээ, хонь, ямаа – таван эрдэнэ', content: 'Тэдгээрийн мах, сүү, ноос, арьс, тээврийн хэрэгсэл...', durationMin: 15, level: 'Анхан', xpReward: 70, order: 1 },
      { moduleSlug: 'livestock', title: 'Монгол малын үүлдэр, омог', description: 'Тэс адуу, Галшар адуу, Сарлаг, Хайнаг, ноолуурын ямаа', content: 'Монголд 4.8 сая адуу, 5.4 сая үхэр, 29.4 сая хонь, 24.6 сая ямаа, 0.47 сая тэмээ...', durationMin: 12, level: 'Дунд', xpReward: 80, order: 2 },
      { moduleSlug: 'livestock', title: 'Төлийн нэршил ба мал маллах ёс', description: 'Унага, даага, ботго, тугал, хурга, ишиг', content: 'Эцэг мал, эх мал, төл мал, хөхүүлэх, саах, хоноглуулах...', durationMin: 10, level: 'Анхан', xpReward: 60, order: 3 },
      { moduleSlug: 'livestock', title: 'Нүүдлийн соёл ба бэлчээр', description: 'Босоо, хэвтээ нүүдэл, зуслан, өвөлжөө', content: 'Говь, тал, хээр, уул, ойн бүсэд мал сүргийг бэлчээрлүүлэх...', durationMin: 14, level: 'Ахисан', xpReward: 90, order: 4, isPremium: true },
      // --- Цагаан идээ ---
      { moduleSlug: 'dairy', title: 'Цагаан идээний төрөл ангилал', description: 'Сүү, тараг, айраг, өрөм, ааруул, ээзгий, бяслаг, шар тос, цагаан тос...', content: 'Таван хошуу малын сүү, ямаа, хонь, үхэр, гүү, ингэний сүүний ялгаа...', durationMin: 18, level: 'Анхан', xpReward: 80, order: 1 },
      { moduleSlug: 'dairy', title: 'Айраг, тараг бүрэх арга', description: 'Гүүний сүүг хөхүүлж, хутгаж айраг хийх, сүүнд хөрөнгө хольж тараг бүрэх', content: 'Айраг исгэх, тарагны хөрөнгө, бүлээн байдал...', durationMin: 12, level: 'Дунд', xpReward: 70, order: 2 },
      { moduleSlug: 'dairy', title: 'Өрөм, ааруул, ээзгий хийх урлал', description: 'Сүү хөөрүүлж өрөм авах, аарц буцалгаж ааруул тавих, ээдмийг хатаах', content: 'Аарцыг уутанд хийж шүүх, хэвэнд оруулах, хатаах...', durationMin: 15, level: 'Ахисан', xpReward: 100, order: 3, isPremium: true },
      { moduleSlug: 'dairy', title: 'Цагаан идээний ач холбогдол', description: 'Шим тэжээл, эмийн чанар, хэрэглээ', content: 'Кальциар баялаг, дархлаа дэмжих, хүүхдийн өсөлт, яс шүдний бэхжилт...', durationMin: 10, level: 'Анхан', xpReward: 60, order: 4 },
      // --- Монгол гэр ---
      { moduleSlug: 'ger', title: 'Гэрийн бүтэц, хийц', description: 'Хана, тооно, унь, хаалга, багана, эсгий бүрээс, оосор бүч', content: 'Гэрийн яс мод, эсгий, хялгас дээс, угсралтын дараалал...', durationMin: 14, level: 'Анхан', xpReward: 70, order: 1 },
      { moduleSlug: 'ger', title: 'Монгол гэрийн хээ угалз', description: 'Угалз, эвэр хээ, өлзий, алхан хээ, өнгөний бэлгэдэл', content: 'Улаан өнгө нарны дулаан, ногоон уньны цээж тайвшруулах...', durationMin: 12, level: 'Дунд', xpReward: 80, order: 2 },
      { moduleSlug: 'ger', title: 'Гэр цагийн үүрэг гүйцэтгэх нь', description: 'Тооноор нарны туяа, 12 жилийн хуваарь, 12 цаг', content: 'Хулгана, үхэр, бар, туулай... гэсэн 12 амьтны нэрээр цагийг тэмдэглэх...', durationMin: 10, level: 'Ахисан', xpReward: 90, order: 3, isPremium: true },
      { moduleSlug: 'ger', title: 'Гэрийн доторх горим ёс', description: 'Хоймор, эзэгтэй тал, эзэн тал, галын голомт', content: 'Баруун тал эрэгтэй, зүүн тал эмэгтэй, галын голомт гэр бүлийн бэлгэдэл...', durationMin: 8, level: 'Анхан', xpReward: 50, order: 4 }
    ];
    if (await Lesson.countDocuments() === 0) {
      await Lesson.insertMany(lessonsData);
    }
    await Lesson.updateMany(
      {
        title: {
          $in: [
            'Морины уралдааны соёл',
            'Нүүдлийн соёл ба бэлчээр',
            'Өрөм, ааруул, ээзгий хийх урлал',
            'Гэр цагийн үүрэг гүйцэтгэх нь'
          ]
        }
      },
      { $set: { isPremium: true } }
    );

    // 3. Шалгалтын асуултууд (модуль бүрд 5-6 асуулт)
    if (await Quiz.countDocuments() === 0 && await Question.countDocuments() === 0) {
    // Бөх
    const bukhQuiz = await Quiz.create({ moduleSlug: 'bukh', title: 'Бөхийн мэдлэгийн шалгалт', passingScore: 70 });
    await Question.insertMany([
      { quizId: bukhQuiz._id, text: 'Монгол бөхийн дээд цол аль вэ?', options: ['Улсын заан', 'Улсын арслан', 'Дархан аварга', 'Даян аварга'], correctOptionIndex: 2, points: 20 },
      { quizId: bukhQuiz._id, text: 'Бөхийн зодог ямар өнгөтэй байдаг вэ?', options: ['Хөх', 'Улаан', 'Ногоон', 'Шар'], correctOptionIndex: 1, points: 20 },
      { quizId: bukhQuiz._id, text: 'Аль нь бөхийн мэх вэ?', options: ['Айраг', 'Дэгээдэх', 'Хээ угалз', 'Хана'], correctOptionIndex: 1, points: 20 },
      { quizId: bukhQuiz._id, text: 'Хэдэн мэх бүртгэгдсэн бэ?', options: ['45', '64', '72', '88'], correctOptionIndex: 1, points: 20 },
      { quizId: bukhQuiz._id, text: 'Шуудангийн өнгө ямар бэлгэдэлтэй вэ?', options: ['Гал голомт', 'Тэнгэр', 'Ус', 'Газар'], correctOptionIndex: 0, points: 20 }
    ]);

    // Морь
    const horseQuiz = await Quiz.create({ moduleSlug: 'horse', title: 'Морь, айрагны соёл', passingScore: 70, isPremium: true });
    await Question.insertMany([
      { quizId: horseQuiz._id, text: 'Гүүний сүүгээр юу хийдэг вэ?', options: ['Айраг', 'Тараг', 'Өрөм', 'Ааруул'], correctOptionIndex: 0, points: 20 },
      { quizId: horseQuiz._id, text: 'Адууны 3 наст эрийг юу гэж нэрлэдэг вэ?', options: ['Унага', 'Даага', 'Үрээ', 'Байдас'], correctOptionIndex: 2, points: 20 },
      { quizId: horseQuiz._id, text: 'Монгол адууны онцлог аль нь вэ?', options: ['Тахтай', 'Жижиг биетэй', 'Зөвхөн ногоо иднэ', 'Хурдан'], correctOptionIndex: 1, points: 20 },
      { quizId: horseQuiz._id, text: 'Айраг ямар аминдэмээр баялаг вэ?', options: ['А', 'С', 'D', 'B12'], correctOptionIndex: 1, points: 20 }
    ]);

    // Таван хошуу
    const liveQuiz = await Quiz.create({ moduleSlug: 'livestock', title: 'Таван хошуу мал', passingScore: 70 });
    await Question.insertMany([
      { quizId: liveQuiz._id, text: 'Монголын таван хошуу малд аль нь орох вэ?', options: ['Адуу, үхэр, тэмээ, хонь, ямаа', 'Адуу, үхэр, буга, хонь, ямаа', 'Адуу, тэмээ, сарлаг, хонь, ямаа'], correctOptionIndex: 0, points: 20 },
      { quizId: liveQuiz._id, text: 'Хонины төлийг юу гэх вэ?', options: ['Тугал', 'Хурга', 'Ишиг', 'Ботго'], correctOptionIndex: 1, points: 20 },
      { quizId: liveQuiz._id, text: 'Аймгийн хэмжээнд бод малд аль нь хамаарах вэ?', options: ['Хонь', 'Ямаа', 'Адуу', 'Тахиа'], correctOptionIndex: 2, points: 20 },
      { quizId: liveQuiz._id, text: 'Монголд хамгийн олон тоогоор бүртгэгддэг мал аль нь?', options: ['Адуу', 'Үхэр', 'Хонь', 'Ямаа'], correctOptionIndex: 2, points: 20 }
    ]);

    // Цагаан идээ
    const dairyQuiz = await Quiz.create({ moduleSlug: 'dairy', title: 'Цагаан идээний урлал', passingScore: 70 });
    await Question.insertMany([
      { quizId: dairyQuiz._id, text: 'Айраг ямар малын сүүгээр хийдэг вэ?', options: ['Үхрийн', 'Хонины', 'Гүүний', 'Ямааны'], correctOptionIndex: 2, points: 20 },
      { quizId: dairyQuiz._id, text: 'Өрөм авахын тулд сүүг юу хийх вэ?', options: ['Хөөрүүлэх', 'Исгэх', 'Хөргөх', 'Шүүх'], correctOptionIndex: 0, points: 20 },
      { quizId: dairyQuiz._id, text: 'Ааруул хийх түүхий эд юу вэ?', options: ['Тараг', 'Аарц', 'Сүү', 'Ээзгий'], correctOptionIndex: 1, points: 20 },
      { quizId: dairyQuiz._id, text: 'Цагаан идээний гол ач холбогдол?', options: ['Кальцийн эх үүсвэр', 'Уургийн эх үүсвэр', 'Дархлаа дэмжих', 'Бүгд'], correctOptionIndex: 3, points: 20 }
    ]);

    // Гэр
    const gerQuiz = await Quiz.create({ moduleSlug: 'ger', title: 'Монгол гэр', passingScore: 70, isPremium: true });
    await Question.insertMany([
      { quizId: gerQuiz._id, text: 'Гэрийн дээд хэсгийг юу гэж нэрлэдэг вэ?', options: ['Тооно', 'Хана', 'Унь', 'Багана'], correctOptionIndex: 0, points: 20 },
      { quizId: gerQuiz._id, text: 'Гэрийн ханыг ямар материалаар хийдэг вэ?', options: ['Мод', 'Төмөр', 'Хуванцар', 'Чулуу'], correctOptionIndex: 0, points: 20 },
      { quizId: gerQuiz._id, text: 'Гэр доторхи эрэгтэй хүний талыг юу гэдэг вэ?', options: ['Хоймор', 'Баруун тал', 'Зүүн тал', 'Гал голомт'], correctOptionIndex: 1, points: 20 },
      { quizId: gerQuiz._id, text: 'Монгол гэрийг бүрэх эсгийг юу гэдэг вэ?', options: ['Дээвэр', 'Туурга', 'Цаваг', 'Өрх'], correctOptionIndex: 1, points: 20 }
    ]);
    }
    await Quiz.updateMany({ moduleSlug: { $in: ['horse', 'ger'] } }, { $set: { isPremium: true } });

    // 4. Демо хэрэглэгчид. Бодит бүртгэлтэй хэрэглэгчдийг seed дахин ажиллуулахад устгахгүй.
    const demoUser = await User.findOne({ phone: '+97699999999' });
    if (!demoUser) {
      await User.create({
        phone: '+97699999999',
        password: '1234demo',
        fullName: 'Т. Жамбалдорж',
        shortName: 'Жамбалдорж',
        rankName: 'Аймгийн Арслан',
        totalXp: 1240,
        streakDays: 14,
        badgeCount: 8,
        rankPosition: 23
      });
    }

    const adminUser = await User.findOne({ phone: '+97688888888' });
    if (!adminUser) {
      await User.create({
        phone: '+97688888888',
        password: 'admin123',
        fullName: 'Админ хэрэглэгч',
        shortName: 'Админ',
        totalXp: 0,
        streakDays: 0,
        badgeCount: 0,
        rankName: 'Админ',
        role: 'admin'
      });
    } else if (adminUser.role !== 'admin') {
      adminUser.role = 'admin';
      adminUser.rankName = adminUser.rankName || 'Админ';
      await adminUser.save();
    }

    console.log('✅ Seed completed: Modules, Lessons, Quizzes, Demo user created.');
    process.exit();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
