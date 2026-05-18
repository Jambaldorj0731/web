import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Icon } from '../common/Icon';

export const TestScreen = ({ t, showToast }) => {
  const [currentModule, setCurrentModule] = useState('bukh');
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/quizzes/module/${currentModule}`);
        setQuiz(res.data.quiz);
        setQuestions(res.data.questions);
        setAnswers({});
        setSubmitted(false);
        setResult(null);
        setCurrentIndex(0);
      } catch (err) {
        showToast('Шалгалт ачааллахад алдаа', 'err');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [currentModule]);

  const handleAnswer = (qid, idx) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qid]: idx }));
  };

  const submitQuiz = async () => {
    if (Object.keys(answers).length !== questions.length) {
      showToast('Бүх асуултад хариулна уу', 'err');
      return;
    }
    const payload = {
      moduleSlug: currentModule,
      answers: Object.entries(answers).map(([questionId, selectedIndex]) => ({ questionId, selectedIndex }))
    };
    try {
      const res = await api.post('/quizzes/submit', payload);
      setResult(res.data);
      setSubmitted(true);
      if (res.data.passed) showToast('Шалгалт амжилттай! +100 XP', 'ok');
      else showToast('Шалгалт амжилтгүй. Дахин оролдоно уу', 'err');
    } catch (err) {
      showToast('Алдаа гарлаа', 'err');
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const currentQ = questions[currentIndex];
  if (loading) return <div style={{ padding: 28 }}>Шалгалт бэлтгэж байна...</div>;
  if (!questions.length) return <div style={{ padding: 28 }}>Асуулт олдсонгүй</div>;

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Шалгалт</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
        <div>
          <div style={{ background: 'var(--card)', borderRadius: 18, padding: '18px 22px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14, border: '1px solid var(--border)' }}>
            <Icon name="brain" size={28} style={{ color: 'var(--blue)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{quiz?.title} · {currentIndex + 1}/{questions.length}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue)' }}>{Math.round((Object.keys(answers).length / questions.length) * 100)}%</span>
              </div>
              <div style={{ height: 8, background: 'var(--bg2)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg,var(--blue),var(--blue2))' }} />
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--card)', borderRadius: 20, padding: '24px', border: '1px solid var(--border)' }}>
            {!submitted ? (
              <>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)', marginBottom: 12 }}>АСУУЛТ {currentIndex + 1} / {questions.length}</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{currentQ.text}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  {currentQ.options.map((opt, idx) => (
                    <div key={idx} onClick={() => handleAnswer(currentQ._id, idx)}
                      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 14, background: answers[currentQ._id] === idx ? 'var(--blue-lt)' : 'var(--bg1)', border: `1.5px solid ${answers[currentQ._id] === idx ? 'var(--blue)' : 'var(--border)'}`, cursor: 'pointer' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: answers[currentQ._id] === idx ? 'var(--blue)' : 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white' }}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span style={{ fontWeight: 500 }}>{opt}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {currentIndex < questions.length - 1 && (
                    <button onClick={nextQuestion} style={{ flex: 1, padding: '12px', background: 'var(--bg2)', border: 'none', borderRadius: 14, fontWeight: 700, cursor: 'pointer' }}>Дараах</button>
                  )}
                  {currentIndex === questions.length - 1 && (
                    <button onClick={submitQuiz} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg,var(--blue),#1E40AF)', border: 'none', borderRadius: 14, color: 'white', fontWeight: 700, cursor: 'pointer' }}>Дуусгах</button>
                  )}
                </div>
              </>
            ) : (
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Үр дүн</div>
                <div>Оноо: {result.score} / {result.totalPoints}</div>
                <div>Хувь: {result.percent}%</div>
                <div style={{ marginTop: 12, fontSize: 16, fontWeight: 700, color: result.passed ? 'var(--green)' : 'var(--red)' }}>
                  {result.passed ? '✅ Амжилттай' : '❌ Амжилтгүй'}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Ангилал</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {['bukh','horse','livestock','dairy'].map(slug => {
              const names = { bukh: 'Хүчит Бөх', horse: 'Хурдан Морь', livestock: 'Таван Хошуу', dairy: 'Цагаан Идээ' };
              const icons = { bukh: 'dumbbell', horse: 'route', livestock: 'layers', dairy: 'droplets' };
              return (
                <div key={slug} onClick={() => { setCurrentModule(slug); }}
                  style={{ background: 'var(--card)', borderRadius: 16, padding: '16px 12px', textAlign: 'center', cursor: 'pointer', border: currentModule === slug ? '2px solid var(--blue)' : '1px solid var(--border)' }}>
                  <Icon name={icons[slug]} size={24} />
                  <div style={{ fontWeight: 700, marginTop: 8 }}>{names[slug]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};