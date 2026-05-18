import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Icon } from '../common/Icon';

export const LessonsScreen = ({ t, goTo, showToast }) => {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all modules
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await api.get('/user/modules');
        setModules(res.data);
        if (res.data.length > 0) {
          setSelectedModule(res.data[0]);
        } else {
          showToast('Модуль олдсонгүй. Seed хийсэн эсэхээ шалгана уу.', 'err');
        }
      } catch (err) {
        console.error(err);
        showToast('Модуль ачааллахад алдаа гарлаа', 'err');
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  // Fetch lessons when selected module changes
  useEffect(() => {
    if (!selectedModule) return;
    const fetchLessons = async () => {
      try {
        const res = await api.get(`/lessons/module/${selectedModule.slug}`);
        setLessons(res.data.lessons);
      } catch (err) {
        console.error(err);
        showToast('Хичээл ачааллахад алдаа гарлаа', 'err');
      }
    };
    fetchLessons();
  }, [selectedModule]);

  const nodeBorder = {
    done: 'none',
    active: '2px solid var(--blue)',
    locked: '2px solid var(--border)'
  };

  if (loading) {
    return <div style={{ padding: 28, textAlign: 'center' }}>🌀 Ачааллаж байна...</div>;
  }

  if (modules.length === 0) {
    return <div style={{ padding: 28, textAlign: 'center' }}>Модуль олдсонгүй. Админд хандана уу.</div>;
  }

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>{t('lessons.pageTitle')}</div>

      {/* Module tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
        {modules.map(mod => (
          <button
            key={mod.slug}
            onClick={() => setSelectedModule(mod)}
            style={{
              padding: '8px 20px',
              borderRadius: 40,
              border: 'none',
              background: selectedModule?.slug === mod.slug ? 'var(--blue)' : 'var(--bg1)',
              color: selectedModule?.slug === mod.slug ? 'white' : 'var(--text2)',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Icon name={mod.icon} size={16} />
            {mod.title}
          </button>
        ))}
      </div>

      {/* Module description */}
      {selectedModule && selectedModule.description && (
        <div style={{ background: 'var(--bg1)', borderRadius: 16, padding: '12px 20px', marginBottom: 24 }}>
          <Icon name="info" size={16} style={{ marginRight: 8, verticalAlign: 'middle', color: 'var(--blue)' }} />
          <span style={{ fontSize: 14, color: 'var(--text2)' }}>{selectedModule.description}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        {/* Lessons list */}
        <div>
          {/* Island card */}
          <div style={{ background: 'var(--card)', borderRadius: 20, padding: '18px 22px', marginBottom: 20, border: '2px solid var(--blue)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Icon name={selectedModule?.icon || 'compass'} size={32} style={{ color: 'var(--blue)' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{selectedModule?.title} арал</div>
                <div style={{ fontSize: 13, color: 'var(--text3)' }}>{selectedModule?.total_lessons} хичээл</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: 'var(--blue)' }}>
                <Icon name="unlock" size={14} /> Нээлттэй
              </div>
            </div>
          </div>

          {/* Lessons nodes */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            {lessons.map((lesson, idx) => (
              <div key={lesson._id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div
                  onClick={() => {
                    if (lesson.status !== 'locked') {
                      goTo('detail', { lessonId: lesson._id });
                    } else {
                      showToast('Өмнөх хичээлийг дуусгана уу', 'err');
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '12px 20px',
                    borderRadius: 16,
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    width: '100%',
                    maxWidth: 480,
                    cursor: lesson.status === 'locked' ? 'not-allowed' : 'pointer',
                    opacity: lesson.status === 'locked' ? 0.65 : 1,
                    transition: 'transform .15s, box-shadow .15s',
                    boxShadow: 'var(--sh-sm)',
                    alignSelf: idx % 2 === 0 ? 'flex-start' : 'flex-end'
                  }}
                  onMouseEnter={e => {
                    if (lesson.status !== 'locked') {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = 'var(--sh-md)';
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = 'var(--sh-sm)';
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: lesson.status === 'done' ? 'var(--green)' : lesson.status === 'active' ? 'var(--blue-lt)' : 'var(--bg2)',
                      border: nodeBorder[lesson.status],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: lesson.status === 'done' ? 'white' : lesson.status === 'active' ? 'var(--blue)' : 'var(--text3)',
                      fontWeight: 700,
                      fontSize: 16
                    }}
                  >
                    {lesson.status === 'done' ? '✓' : <Icon name={selectedModule?.icon || 'dumbbell'} size={18} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{lesson.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{lesson.meta}</div>
                    <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
                      {lesson.stars
                        ? [...Array(lesson.stars)].map((_, i) => <Icon key={i} name="star" size={12} style={{ color: 'var(--amber)' }} />)
                        : <span style={{ fontSize: 12, color: 'var(--text3)' }}>—</span>}
                    </div>
                  </div>
                </div>
                {idx < lessons.length - 1 && (
                  <div style={{ width: 2, height: 20, background: lesson.status === 'done' ? 'var(--green)' : 'var(--border)', margin: '2px 0' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar info panel */}
        <div style={{ position: 'sticky', top: 28, height: 'fit-content' }}>
          <div style={{ background: 'var(--card)', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--sh-lg)' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--blue), #1E40AF)', padding: '28px 22px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Icon name={selectedModule?.icon || 'compass'} size={30} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', fontWeight: 600 }}>{selectedModule?.title} · Дунд шат</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'white', lineHeight: 1.3 }}>{selectedModule?.title} сурах</div>
              </div>
            </div>
            <div style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                {[['clock', '20 мин', 'blue'], ['zap', '+80 XP', 'green'], ['flame', 'Халуун', 'amber']].map(([ic, l, c]) => (
                  <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: `var(--${c}-lt)`, color: `var(--${c})`, border: `1px solid var(--${c}-md, var(--border))` }}>
                    <Icon name={ic} size={12} /> {l}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 16 }}>
                {selectedModule?.description || `${selectedModule?.title} модулийн хичээлүүдээр дамжуулан мэдлэгээ дээшлүүлээрэй.`}
              </p>
              <button
                onClick={() => goTo('lessons')}
                style={{ width: '100%', padding: '12px 0', background: 'linear-gradient(135deg, var(--blue), #1E40AF)', border: 'none', borderRadius: 12, color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,.35)' }}
              >
                Дэлгэрэнгүй →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};