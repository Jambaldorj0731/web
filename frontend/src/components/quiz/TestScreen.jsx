// frontend/src/components/quiz/TestScreen.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Icon } from '../common/Icon';
import { useUserData } from '../../contexts/UserDataContext';

const moduleMeta = {
  bukh: { name: 'Хүчит Бөх', icon: 'dumbbell', accent: '#3B82F6' },
  horse: { name: 'Хурдан Морь', icon: 'route', accent: '#22C55E' },
  livestock: { name: 'Таван Хошуу', icon: 'layers', accent: '#F59E0B' },
  dairy: { name: 'Цагаан Идээ', icon: 'droplets', accent: '#06B6D4' },
  ger: { name: 'Монгол Гэр', icon: 'home', accent: '#A855F7' }
};

export const TestScreen = ({ t, showToast, isVip, openPay }) => {
  const [currentModule, setCurrentModule] = useState('bukh');
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [alreadyTaken, setAlreadyTaken] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [timerActive, setTimerActive] = useState(false);
  const [vipBlocked, setVipBlocked] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const { refetch } = useUserData();

  useEffect(() => {
    const checkViewport = () => setIsNarrow(window.innerWidth <= 900);
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        setVipBlocked(false);
        const res = await api.get(`/quizzes/module/${currentModule}`);
        setQuiz(res.data.quiz);
        setQuestions(res.data.questions);
        setAlreadyTaken(Boolean(res.data.alreadyTaken));
        setAnswers({});
        setSubmitted(false);
        setResult(null);
        setCurrentIndex(0);
        setTimeLeft(res.data.quiz?.timeLimit || 600);
        setTimerActive(true);
      } catch (err) {
        if (err.response?.status === 403) {
          setVipBlocked(true);
          setQuestions([]);
          setTimerActive(false);
        } else {
          showToast('Шалгалт ачааллахад алдаа', 'err');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [currentModule]);

  useEffect(() => {
    if (submitted || alreadyTaken || !timerActive || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerActive(false);
          if (!submitted && !alreadyTaken) {
            showToast('Хугацаа дууссан!', 'err');
            setSubmitted(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timerActive, submitted, alreadyTaken]);

  const handleAnswer = (qid, idx) => {
    if (submitted || alreadyTaken) return;
    setAnswers(prev => ({ ...prev, [qid]: idx }));
  };

  const submitQuiz = async () => {
    if (Object.keys(answers).length !== questions.length) {
      showToast('Бүх асуултад хариулна уу', 'err');
      return;
    }
    if (alreadyTaken) {
      showToast('Та энэ шалгалтыг аль хэдийн өгсөн байна', 'err');
      return;
    }
    setSubmitting(true);
    const payload = {
      moduleSlug: currentModule,
      answers: Object.entries(answers).map(([questionId, selectedIndex]) => ({ questionId, selectedIndex }))
    };
    try {
      const res = await api.post('/quizzes/submit', payload);
      setResult(res.data);
      setSubmitted(true);
      setTimerActive(false);
      setAlreadyTaken(true);
      if (res.data.passed) {
        showToast(`Шалгалт амжилттай! +${res.data.xpEarned} XP`, 'ok');
        await refetch();
      } else {
        showToast('Шалгалт амжилтгүй. Дахин оролдоно уу', 'err');
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Алдаа гарлаа', 'err');
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQ = questions[currentIndex];
  if (loading) return <div style={{ padding: 28, textAlign: 'center' }}>🔄 Ачааллаж байна...</div>;

  const answeredPercent = questions.length ? Math.round((Object.keys(answers).length / questions.length) * 100) : 0;
  const selectedAnswer = currentQ ? answers[currentQ._id] : undefined;
  const currentMeta = moduleMeta[currentModule];
  const premiumQuizSlugs = ['horse', 'ger'];

  return (
    <div style={{ padding: isNarrow ? '18px 16px' : '32px clamp(20px, 4vw, 48px)', maxWidth: 1240, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--blue)', marginBottom: 8, textTransform: 'uppercase' }}>Мэдлэг шалгах</div>
        <div style={{ fontSize: 34, fontWeight: 900, color: 'var(--text)', lineHeight: 1.1 }}>Шалгалт</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : 'minmax(0, 1fr) 320px', gap: 28, alignItems: 'start' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,.18), var(--card))', borderRadius: 8, padding: isNarrow ? 16 : 22, marginBottom: 18, display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : 'auto minmax(0, 1fr) auto', alignItems: 'center', gap: 16, border: '1px solid var(--border)', boxShadow: '0 18px 48px rgba(2,8,23,.18)' }}>
            <div style={{ width: 54, height: 54, borderRadius: 8, background: 'rgba(59,130,246,.16)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59,130,246,.28)' }}>
              <Icon name="brain" size={30} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--text)' }}>{quiz?.title}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--blue)', background: 'rgba(59,130,246,.12)', border: '1px solid rgba(59,130,246,.25)', borderRadius: 999, padding: '5px 9px' }}>
                  {currentIndex + 1}/{questions.length}
                </span>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text2)', background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 999, padding: '5px 9px' }}>
                  {answeredPercent}% бөглөсөн
                </span>
              </div>
              <div style={{ height: 10, background: 'rgba(148,163,184,.16)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${answeredPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--blue), #60A5FA)', borderRadius: 999, transition: 'width .25s ease' }} />
              </div>
            </div>
            <div style={{ minWidth: 88, textAlign: 'center', padding: '10px 12px', borderRadius: 8, background: timeLeft < 60 ? 'rgba(239,68,68,.12)' : 'var(--bg1)', color: timeLeft < 60 ? 'var(--red)' : 'var(--text)', border: `1px solid ${timeLeft < 60 ? 'rgba(239,68,68,.25)' : 'var(--border)'}` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', marginBottom: 2 }}>Хугацаа</div>
              <div style={{ fontSize: 20, fontWeight: 900 }}>{formatTime(timeLeft)}</div>
            </div>
          </div>

          <div style={{ background: 'var(--card)', borderRadius: 8, padding: 28, border: '1px solid var(--border)', boxShadow: '0 18px 48px rgba(2,8,23,.16)' }}>
            {vipBlocked ? (
              <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                <div style={{ width: 72, height: 72, borderRadius: 8, margin: '0 auto 18px', background: 'rgba(245,158,11,.14)', color: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="lock" size={40} />
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: 24 }}>VIP шалгалт</h3>
                <p style={{ color: 'var(--text2)', margin: '0 0 20px' }}>Энэ ангиллын шалгалтыг өгөхийн тулд VIP эрх шаардлагатай.</p>
                <button onClick={openPay} style={{ padding: '12px 22px', borderRadius: 10, border: 'none', background: 'var(--blue)', color: '#fff', fontWeight: 900, cursor: 'pointer' }}>VIP авах</button>
              </div>
            ) : !currentQ ? (
              <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text2)' }}>Энэ ангилалд асуулт алга байна</div>
            ) : alreadyTaken && !submitted ? (
              <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                <div style={{ width: 72, height: 72, borderRadius: 8, margin: '0 auto 18px', background: 'rgba(34,197,94,.14)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="check-circle" size={42} />
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: 24 }}>Та энэ шалгалтыг аль хэдийн өгсөн байна</h3>
                <p style={{ color: 'var(--text2)', margin: 0 }}>Нэг модулийн шалгалтыг зөвхөн нэг удаа өгөх боломжтой.</p>
              </div>
            ) : !submitted ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--blue)', background: 'rgba(59,130,246,.12)', border: '1px solid rgba(59,130,246,.25)', borderRadius: 999, padding: '6px 10px' }}>АСУУЛТ {currentIndex + 1}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text3)' }}>{questions.length} асуултаас</span>
                </div>
                <div style={{ fontSize: isNarrow ? 22 : 26, fontWeight: 900, lineHeight: 1.3, marginBottom: 24, color: 'var(--text)' }}>{currentQ.text}</div>
                <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
                  {currentQ.options.map((opt, idx) => (
                    <button key={idx} onClick={() => handleAnswer(currentQ._id, idx)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '16px 18px', borderRadius: 8, background: selectedAnswer === idx ? 'linear-gradient(135deg, rgba(59,130,246,.22), rgba(59,130,246,.08))' : 'var(--bg1)', border: `1.5px solid ${selectedAnswer === idx ? 'var(--blue)' : 'var(--border)'}`, cursor: 'pointer', color: 'var(--text)', textAlign: 'left', boxShadow: selectedAnswer === idx ? '0 10px 28px rgba(59,130,246,.16)' : 'none', transition: 'border-color .18s ease, background .18s ease, box-shadow .18s ease' }}>
                      <div style={{ flex: '0 0 auto', width: 38, height: 38, borderRadius: 8, background: selectedAnswer === idx ? 'var(--blue)' : 'var(--card)', border: `1px solid ${selectedAnswer === idx ? 'var(--blue)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: selectedAnswer === idx ? 'white' : 'var(--text2)' }}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span style={{ flex: 1, fontSize: 16, fontWeight: 750, lineHeight: 1.35 }}>{opt}</span>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${selectedAnswer === idx ? 'var(--blue)' : 'var(--border)'}`, background: selectedAnswer === idx ? 'var(--blue)' : 'transparent', boxShadow: selectedAnswer === idx ? 'inset 0 0 0 4px white' : 'none' }} />
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {currentIndex < questions.length - 1 && (
                    <button onClick={nextQuestion} style={{ flex: 1, padding: '14px 18px', background: selectedAnswer === undefined ? 'var(--bg2)' : 'var(--blue)', color: selectedAnswer === undefined ? 'var(--text3)' : 'white', border: 'none', borderRadius: 8, fontWeight: 900, cursor: 'pointer' }}>Дараах</button>
                  )}
                  {currentIndex === questions.length - 1 && (
                    <button onClick={submitQuiz} disabled={submitting} style={{ flex: 1, padding: '14px 18px', background: 'linear-gradient(135deg,var(--blue),#1E40AF)', border: 'none', borderRadius: 8, color: 'white', fontWeight: 900, cursor: 'pointer', opacity: submitting ? 0.6 : 1 }}>
                      {submitting ? 'Илгээж байна...' : 'Дуусгах'}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '34px 16px' }}>
                <div style={{ width: 88, height: 88, borderRadius: 8, margin: '0 auto 18px', background: result.passed ? 'rgba(34,197,94,.14)' : 'rgba(239,68,68,.12)', color: result.passed ? 'var(--green)' : 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={result.passed ? 'check-circle' : 'x-circle'} size={48} />
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 18 }}>Үр дүн</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, maxWidth: 380, margin: '0 auto' }}>
                  <div style={{ background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 8, padding: 14 }}><div style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 800 }}>Оноо</div><div style={{ fontSize: 22, fontWeight: 900 }}>{result.score} / {result.totalPoints}</div></div>
                  <div style={{ background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 8, padding: 14 }}><div style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 800 }}>Хувь</div><div style={{ fontSize: 22, fontWeight: 900 }}>{Math.round(result.percent)}%</div></div>
                </div>
                <div style={{ marginTop: 18, fontSize: 18, fontWeight: 900, color: result.passed ? 'var(--green)' : 'var(--red)' }}>
                  {result.passed ? '✅ Амжилттай' : '❌ Амжилтгүй'}
                </div>
                {result.passed && <div style={{ marginTop: 8, color: 'var(--text2)', fontWeight: 700 }}>+{result.xpEarned} XP нэмэгдлээ</div>}
              </div>
            )}
          </div>
        </div>

        <aside style={{ position: isNarrow ? 'static' : 'sticky', top: 24 }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 18, boxShadow: '0 18px 48px rgba(2,8,23,.12)' }}>
            <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 14 }}>Ангилал</div>
            <div style={{ display: 'grid', gap: 10 }}>
              {Object.entries(moduleMeta).map(([slug, meta]) => {
              const active = currentModule === slug;
              const requiresVip = premiumQuizSlugs.includes(slug) && !isVip;
              return (
                <div key={slug} onClick={() => { if (!submitting) setCurrentModule(slug); }}
                  style={{ background: active ? 'rgba(59,130,246,.12)' : 'var(--bg1)', borderRadius: 8, padding: '13px 14px', cursor: 'pointer', border: `1.5px solid ${active ? 'var(--blue)' : 'var(--border)'}`, opacity: submitting ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: active ? 'var(--blue)' : 'var(--card)', color: active ? 'white' : meta.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${active ? 'var(--blue)' : 'var(--border)'}` }}>
                    <Icon name={meta.icon} size={21} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 900, color: 'var(--text)' }}>{meta.name}</span>
                      {requiresVip && <Icon name="lock" size={13} style={{ color: 'var(--amber)' }} />}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: active ? 'var(--blue)' : requiresVip ? 'var(--amber)' : 'var(--text3)', marginTop: 2 }}>{requiresVip ? 'VIP' : active ? 'Сонгосон' : 'Шалгалт'}</div>
                  </div>
                </div>
              );
            })}
            </div>
            <div style={{ marginTop: 16, padding: 14, borderRadius: 8, background: 'var(--bg1)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text3)', marginBottom: 4 }}>Одоогийн ангилал</div>
              <div style={{ fontSize: 15, fontWeight: 900 }}>{currentMeta.name}</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
