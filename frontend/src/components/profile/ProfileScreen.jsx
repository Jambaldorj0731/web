import { useUserData } from '../../contexts/UserDataContext';
import { Icon } from '../common/Icon';

export const ProfileScreen = ({ t, settings, updateSettings, showToast, isVip, sub, openPay, goTo, onLogout }) => {
  const { profile, loading, error } = useUserData();

  if (loading) return <div style={{ padding: 28, textAlign: 'center' }}>🔄 Ачааллаж байна...</div>;
  if (error) return <div style={{ padding: 28, textAlign: 'center', color: 'var(--red)' }}>❌ {error}</div>;
  if (!profile) return <div style={{ padding: 28, textAlign: 'center' }}>Мэдээлэл олдсонгүй</div>;

  // Тэмдгүүдийг бодит өгөгдлөөр тооцоолох
  const badges = [
    { icon: 'dumbbell', label: 'Бөхийн Шавь', earned: profile.xp >= 100 },
    { icon: 'flame', label: `${profile.streak_days} Хоног`, earned: profile.streak_days >= 14 },
    { icon: 'route', label: 'Уяачийн Нөхөр', earned: profile.xp >= 500 },
    { icon: 'star', label: 'Шилдэг Хариулт', earned: profile.badge_count >= 5 },
    { icon: 'star', label: 'Уран Бичигч', earned: profile.xp >= 1000 },
    { icon: 'trophy', label: 'Гэр Барьсан', earned: false },
    { icon: 'crown', label: 'Улсын Аварга', earned: profile.rank_name === 'Улсын Аварга' || profile.rank_name === 'Дархан Аварга' },
    { icon: 'trophy', label: 'Дархан Аварга', earned: profile.rank_name === 'Дархан Аварга' }
  ];

  const xpToNext = profile.xp_to_next;
  const xpPercent = Math.round((profile.xp / (profile.xp + xpToNext)) * 100);

  const vipLbl = isVip
    ? (sub?.plan === 'yearly' ? 'VIP · жилийн багц' : 'VIP · сарын багц') + ' · дуусах: ' + new Date(sub.expiresAt).toLocaleDateString('mn-MN')
    : (settings.language === 'en' ? 'From ₮9,900/mo' : '₮9,900/сар');

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>{t('profile.title')}</div>

      {/* Хэрэглэгчийн карт */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 32 }}>
        <div style={{ background: 'var(--card)', borderRadius: 24, padding: '24px', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--blue-lt)', border: '3px solid var(--blue-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Icon name="circle-user-round" size={50} style={{ color: 'var(--blue)' }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{profile.full_name || profile.short_name}</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--blue)', marginBottom: 8 }}>{profile.rank_name} · #{profile.rank_position}</div>
          <div style={{ fontSize: 13, color: 'var(--text2)' }}>{profile.phone}</div>
        </div>

        {/* Ранк болон XP прогрес */}
        <div style={{ background: 'var(--card)', borderRadius: 24, padding: '24px', border: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>🏆 {t('home.rankTag')}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--blue)' }}>{profile.rank_name}</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12 }}>{profile.next_rank} хүртэл {xpToNext} XP</div>
          <div style={{ height: 8, background: 'var(--bg2)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ width: `${xpPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--blue), var(--blue2))', borderRadius: 10 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text3)' }}>{profile.xp} XP</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text3)' }}>{xpPercent}%</span>
          </div>
        </div>

        {/* Статистик */}
        <div style={{ background: 'var(--card)', borderRadius: 24, padding: '24px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--blue)' }}>{profile.xp}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>XP</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--amber)' }}>{profile.streak_days}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>Өдөр</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--green)' }}>{profile.badge_count}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>Тэмдэг</div>
          </div>
        </div>
      </div>

      {/* Тэмдгүүд (Badges) – Grid хэлбэрээр */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>{t('profile.badgesTitle')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 16 }}>
          {badges.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: b.earned ? 'var(--blue-lt)' : 'var(--bg1)', padding: '10px 14px', borderRadius: 16, border: `1px solid ${b.earned ? 'var(--blue-md)' : 'var(--border)'}`, opacity: b.earned ? 1 : 0.5 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: b.earned ? 'var(--blue)' : 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Icon name={b.icon} size={18} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: b.earned ? 'var(--text)' : 'var(--text3)' }}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Тохиргооны хэсэг */}
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>{t('profile.settingsTitle')}</div>
      <div style={{ background: 'var(--card)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 24 }}>
        {[
          { icon: 'moon', label: t('settings.darkMode'), val: settings.theme === 'dark' ? t('settings.darkOn') : t('settings.darkOff'), action: () => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' }), toggle: true, on: settings.theme === 'dark' },
          { icon: 'bell', label: t('settings.notifications'), val: settings.notifications ? t('settings.notifyOn') : t('settings.notifyOff'), action: () => { updateSettings({ notifications: !settings.notifications }); showToast(settings.notifications ? t('toast.notifyOff') : t('toast.notifyOn'), 'info'); }, toggle: true, on: settings.notifications },
          { icon: 'globe', label: t('settings.language'), val: settings.language === 'en' ? t('settings.langEn') : t('settings.langMn'), action: () => { updateSettings({ language: settings.language === 'en' ? 'mn' : 'en' }); showToast(t('toast.languageSaved'), 'ok'); } }
        ].map((row, i) => (
          <div key={i} onClick={row.action} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', cursor: 'pointer', background: 'var(--card)', transition: 'background .2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--card)'}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={row.icon} size={18} /></div>
            <span style={{ flex: 1, fontWeight: 600 }}>{row.label}</span>
            {row.toggle ? (
              <div style={{ width: 44, height: 24, background: row.on ? 'var(--blue)' : 'var(--bg2)', borderRadius: 30, display: 'flex', alignItems: 'center', padding: '2px', transition: 'all .2s' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', transform: row.on ? 'translateX(20px)' : 'translateX(0)', transition: 'transform .2s' }} />
              </div>
            ) : (
              <><span style={{ fontSize: 14, color: 'var(--text3)' }}>{row.val}</span><Icon name="chevron-right" size={16} style={{ color: 'var(--text3)' }} /></>
            )}
          </div>
        ))}
      </div>

      {/* Нэмэлт үйлдлүүд */}
      <div style={{ marginTop: 4 }}>
        {[
          { icon: 'medal', label: t('nav.legends'), val: '1 нээлттэй', valColor: 'var(--green)', action: () => goTo('legends') },
          { icon: 'gem', label: t('profile.vip'), val: vipLbl, valColor: isVip ? 'var(--green)' : 'var(--blue)', action: openPay },
          { icon: 'log-out', label: t('profile.logout'), val: '', valColor: 'var(--red)', action: onLogout }
        ].map((row, i) => (
          <div key={i} onClick={row.action} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderRadius: 14, background: 'var(--card)', border: '1px solid var(--border)', cursor: 'pointer', marginBottom: 12, transition: 'background .2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--card)'}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: i === 2 ? 'var(--red)' : 'var(--text2)' }}><Icon name={row.icon} size={18} /></div>
            <span style={{ flex: 1, fontWeight: 600, color: i === 2 ? 'var(--red)' : 'var(--text)' }}>{row.label}</span>
            {row.val && <span style={{ fontSize: 13, fontWeight: 600, color: row.valColor }}>{row.val}</span>}
            <Icon name="chevron-right" size={16} style={{ color: 'var(--text3)' }} />
          </div>
        ))}
      </div>
    </div>
  );
};