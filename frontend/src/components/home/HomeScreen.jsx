import { useState, useEffect } from 'react';
import { Icon } from '../common/Icon';
import { useUserData } from '../../contexts/UserDataContext';

export const HomeScreen = ({ t, goTo, onRetry }) => {
  const { profile, modules, loading, error } = useUserData();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (loading) return <div style={{ padding: 28, textAlign: 'center' }}>🔄 Ачааллаж байна...</div>;
  if (error) {
    return (
      <div style={{ padding: 28, textAlign: 'center' }}>
        <div style={{ color: 'var(--red)', marginBottom: 16 }}>❌ {error}</div>
        <button onClick={onRetry} style={{ padding: '8px 20px', background: 'var(--blue)', border: 'none', borderRadius: 20, color: 'white', cursor: 'pointer' }}>Дахин оролдох</button>
      </div>
    );
  }
  if (!profile) return <div style={{ padding: 28, textAlign: 'center' }}>Мэдээлэл олдсонгүй</div>;

  const xpPct = Math.round((profile.xp / (profile.xp + profile.xp_to_next)) * 100);
  const h = new Date().getHours();
  const greetKey = h >= 5 && h < 12 ? 'greet.morning' : h >= 12 && h < 18 ? 'greet.afternoon' : 'greet.evening';
  const modColors = { m1: '#2563EB', m2: '#D97706', m3: '#059669', m4: '#7c3aed', m5: '#8B5CF6' };
  const displayName = profile.full_name || profile.short_name || 'Хэрэглэгч';

  return (
    <div style={{ padding: '28px 32px', maxWidth: '100%', width: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text3)' }}>{t(greetKey)}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)' }}>{displayName}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--orange-lt)', borderRadius: 20, padding: '8px 14px' }}>
          <Icon name="flame" size={18} style={{ color: 'var(--orange)' }} />
          <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--orange)' }}>{profile.streak_days}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--orange)' }}>{t('home.dayWord')}</span>
        </div>
      </div>

      {/* XP карт */}
      <div style={{ background: 'var(--card)', borderRadius: 20, padding: '18px 22px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14, border: '1px solid var(--border)' }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--amber-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--amber)' }}>
          <Icon name="zap" size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)' }}>{profile.rank_name} → {profile.next_rank}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--amber)' }}>{xpPct}%</span>
          </div>
          <div style={{ height: 8, background: 'var(--bg2)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${xpPct}%`, height: '100%', background: 'linear-gradient(90deg,var(--amber),var(--orange))', transition: 'width .6s' }} />
          </div>
        </div>
      </div>

      {/* Статистик */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { icon: 'flame', val: profile.streak_days, lbl: t('home.statDays'), color: 'var(--orange)', bg: 'var(--orange-lt)' },
          { icon: 'bar-chart-3', val: `#${profile.rank_position}`, lbl: t('home.statRank'), color: 'var(--blue)', bg: 'var(--blue-lt)' },
          { icon: 'badge-check', val: profile.badge_count, lbl: t('home.statBadges'), color: 'var(--green)', bg: 'var(--green-lt)' }
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--card)', borderRadius: 18, padding: '18px 16px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: s.color }}>
              <Icon name={s.icon} size={20} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>{s.val}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text3)' }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Ранк карт */}
      <div onClick={() => goTo('rank')} style={{ background: 'linear-gradient(135deg,var(--blue),#1E40AF)', borderRadius: 20, padding: '18px 22px', marginBottom: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,255,255,.6)' }}>{t('home.rankTag')}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{profile.rank_name}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)' }}>{profile.next_rank} хүртэл {profile.xp_to_next} XP</div>
        </div>
        <Icon name="award" size={36} style={{ color: 'rgba(255,255,255,.8)' }} />
        <span style={{ color: 'rgba(255,255,255,.6)', fontSize: 22 }}>›</span>
      </div>

      {/* Модулиуд */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{t('home.modulesTitle')}</span>
        <span onClick={() => goTo('lessons')} style={{ fontSize: 13, fontWeight: 600, color: 'var(--blue)', cursor: 'pointer' }}>{t('home.allLink')}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {modules.map(m => (
          <div key={m.id} onClick={() => goTo('lessons')} style={{ background: 'var(--card)', borderRadius: 18, padding: '18px 16px', cursor: 'pointer', transition: 'transform .2s', border: '1px solid var(--border)' }}>
            <div style={{ color: modColors[m.css_class] || 'var(--blue)', marginBottom: 10 }}><Icon name={m.icon} size={24} /></div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{m.title}</div>
            <div style={{ height: 6, background: 'var(--bg2)', borderRadius: 3, margin: '8px 0 6px' }}>
              <div style={{ width: `${m.progress}%`, height: '100%', background: modColors[m.css_class] || 'var(--blue)', borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text3)' }}>
              {m.progress > 0 ? `${m.progress}% · ${m.completed_lessons}/${m.total_lessons}` : 'Эхлэх'}
            </div>
          </div>
        ))}
      </div>

      {/* Долоо хоног */}
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: '28px 0 12px' }}>{t('home.weekTitle')}</div>
      <div style={{ background: 'var(--card)', borderRadius: 20, padding: '18px 22px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontWeight: 700, color: 'var(--orange)', flexWrap: 'wrap' }}>
          <Icon name="flame" size={16} /> {profile.streak_days} {t('home.weekStreak')}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {["Да","Мя","Лх","Пү","Ба","Бя","Ня"].map((d, i) => (
            <div key={d} style={{ textAlign: 'center', flex: '1 0 auto' }}>
              <div style={{ width: '100%', maxWidth: 44, height: 44, margin: '0 auto', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, background: i < 5 ? 'var(--green)' : i === 5 ? 'var(--amber)' : 'var(--bg2)', color: i < 5 ? 'white' : i === 5 ? 'white' : 'var(--text3)' }}>{i < 5 ? '✓' : i === 5 ? '!' : '—'}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', marginTop: 6 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};