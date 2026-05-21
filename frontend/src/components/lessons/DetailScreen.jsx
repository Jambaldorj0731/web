import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Icon } from '../common/Icon';
import { useUserData } from '../../contexts/UserDataContext';
import DOMPurify from 'dompurify';

export const DetailScreen = ({ t, goBack, lessonId, openPay }) => {
  const [lesson, setLesson] = useState(null);
  const [vipBlocked, setVipBlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const { refetch } = useUserData();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await api.get(`/lessons/${lessonId}`);
        setLesson(res.data);
      } catch (err) {
        if (err.response?.status === 403) setVipBlocked(true);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (lessonId) fetchLesson();
  }, [lessonId]);

  const completeLesson = async () => {
    setCompleting(true);
    try {
      await api.post(`/lessons/complete/${lessonId}`);
      await refetch();
      goBack();
    } catch (err) {
      if (err.response?.status === 403) openPay();
      console.error(err);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <div style={{ padding: 28, textAlign: 'center' }}>🔄 Ачааллаж байна...</div>;
  if (vipBlocked) {
    return (
      <div style={{ padding: '28px 32px', maxWidth: 760, margin: '0 auto' }}>
        <div onClick={goBack} style={{ fontSize: 14, fontWeight: 600, color: 'var(--blue)', cursor: 'pointer', marginBottom: 20 }}>
          <Icon name="arrow-left" size={16} /> {t('lesson.back')}
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 34, textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: 12, margin: '0 auto 18px', background: 'rgba(245,158,11,.14)', color: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="lock" size={38} />
          </div>
          <h2 style={{ margin: '0 0 8px' }}>VIP хичээл</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 20 }}>Энэ хичээлийг үзэхийн тулд VIP эрх идэвхжүүлнэ үү.</p>
          <button onClick={openPay} style={{ padding: '12px 22px', borderRadius: 10, border: 'none', background: 'var(--blue)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>VIP авах</button>
        </div>
      </div>
    );
  }
  if (!lesson) return <div style={{ padding: 28, textAlign: 'center' }}>Хичээл олдсонгүй</div>;

  // XSS-ээс хамгаалах
  const sanitizedContent = DOMPurify.sanitize(lesson.content || lesson.description || 'Агуулга бэлтгэгдээгүй байна.');

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900, margin: '0 auto' }}>
      <div onClick={goBack} style={{ fontSize: 14, fontWeight: 600, color: 'var(--blue)', cursor: 'pointer', marginBottom: 20 }}>
        <Icon name="arrow-left" size={16} /> {t('lesson.back')}
      </div>

      <div style={{ background: 'linear-gradient(135deg, var(--blue), #1E40AF)', borderRadius: 24, padding: '32px 28px', marginBottom: 28, color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ width: 70, height: 70, borderRadius: 20, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="dumbbell" size={36} />
          </div>
          <div>
            <div style={{ fontSize: 14, opacity: 0.8 }}>{lesson.moduleSlug} · {lesson.level} шат</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>{lesson.title}</h1>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        <span style={{ background: 'var(--blue-lt)', color: 'var(--blue)', padding: '6px 14px', borderRadius: 40, fontSize: 13, fontWeight: 600 }}>
          <Icon name="clock" size={14} /> {lesson.durationMin} мин
        </span>
        <span style={{ background: 'var(--green-lt)', color: 'var(--green)', padding: '6px 14px', borderRadius: 40, fontSize: 13, fontWeight: 600 }}>
          <Icon name="zap" size={14} /> +{lesson.xpReward} XP
        </span>
      </div>

      {lesson.videoUrl && (
        <div style={{ marginBottom: 28, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <iframe
            width="100%"
            height="400"
            src={lesson.videoUrl}
            title={lesson.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      <div style={{ background: 'var(--card)', borderRadius: 24, padding: '28px', border: '1px solid var(--border)', marginBottom: 28 }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 18, color: 'var(--text)' }}>
          <Icon name="book-open" size={20} style={{ color: 'var(--blue)' }} /> Хичээлийн агуулга
        </h3>
        <div
          style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text2)' }}
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </div>

      <button
        onClick={completeLesson}
        disabled={completing}
        style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, var(--blue), #1E40AF)', border: 'none', borderRadius: 20, color: 'white', fontSize: 16, fontWeight: 700, cursor: completing ? 'not-allowed' : 'pointer', opacity: completing ? 0.6 : 1 }}
        onMouseEnter={e => { if (!completing) e.currentTarget.style.transform = 'scale(1.02)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {completing ? 'Дуусгаж байна...' : `Хичээлийг дуусгах → +${lesson.xpReward} XP`}
      </button>
    </div>
  );
};
