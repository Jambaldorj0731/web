import { useUserData } from '../../contexts/UserDataContext';
import { Icon } from '../common/Icon';

export const ProfileScreen = ({ t, settings, updateSettings, showToast, isVip, sub, openPay, goTo, onLogout }) => {
  const { profile, loading, error } = useUserData();

  if (loading) return <div style={{ padding: 28, textAlign: 'center' }}>🔄 Ачааллаж байна...</div>;
  if (error) return <div style={{ padding: 28, textAlign: 'center', color: 'var(--red)' }}>❌ {error}</div>;
  if (!profile) return <div style={{ padding: 28, textAlign: 'center' }}>Мэдээлэл олдсонгүй</div>;

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

  const vipLbl = isVip
    ? (sub?.plan === 'yearly' ? 'VIP · жилийн багц' : 'VIP · сарын багц') + ' · дуусах: ' + new Date(sub.expiresAt).toLocaleDateString('mn-MN')
    : (settings.language === 'en' ? 'From ₮9,900/mo' : '₮9,900/сар');

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>{t('profile.title')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
        {/* Зүүн тал: профайл карт */}
        <div>
          <div style={{ background: 'var(--card)', borderRadius: 24, padding: '28px 22px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--blue-lt)', border: '3px solid var(--blue-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Icon name="circle-user-round" size={40} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{profile.full_name || profile.short_name}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--blue)', marginBottom: 20 }}>{profile.rank_name} · #{profile.rank_position}</div>
            <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
              <div><div style={{ fontSize: 20, fontWeight: 800 }}>{profile.xp}</div><div style={{ fontSize: 12, color: 'var(--text3)' }}>XP</div></div>
              <div><div style={{ fontSize: 20, fontWeight: 800 }}>{profile.streak_days}</div><div style={{ fontSize: 12, color: 'var(--text3)' }}>Өдөр</div></div>
              <div><div style={{ fontSize: 20, fontWeight: 800 }}>{profile.badge_count}</div><div style={{ fontSize: 12, color: 'var(--text3)' }}>Тэмдэг</div></div>
            </div>
          </div>
        </div>

        {/* Баруун тал: тэмдгүүд, тохиргоо */}
        <div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, marginBottom: 14 }}>{t('profile.badgesTitle')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
              {badges.map((b, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: b.earned ? 'var(--blue-lt)' : 'var(--bg1)', border: `2px solid ${b.earned ? 'var(--blue-md)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', color: b.earned ? 'var(--blue)' : 'var(--text3)', opacity: b.earned ? 1 : 0.45 }}>
                    <Icon name={b.icon} size={22} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: b.earned ? 'var(--text2)' : 'var(--text3)' }}>{b.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontWeight: 700, marginBottom: 14 }}>{t('profile.settingsTitle')}</div>
          {[
            { icon: 'moon', label: t('settings.darkMode'), val: settings.theme === 'dark' ? t('settings.darkOn') : t('settings.darkOff'), action: () => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' }), toggle: true, on: settings.theme === 'dark' },
            { icon: 'bell', label: t('settings.notifications'), val: settings.notifications ? t('settings.notifyOn') : t('settings.notifyOff'), action: () => { updateSettings({ notifications: !settings.notifications }); showToast(settings.notifications ? t('toast.notifyOff') : t('toast.notifyOn'), 'info'); }, toggle: true, on: settings.notifications },
            { icon: 'globe', label: t('settings.language'), val: settings.language === 'en' ? t('settings.langEn') : t('settings.langMn'), action: () => { updateSettings({ language: settings.language === 'en' ? 'mn' : 'en' }); showToast(t('toast.languageSaved'), 'ok'); } }
          ].map((row, i) => (
            <div key={i} onClick={row.action} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, background: 'var(--card)', border: '1px solid var(--border)', cursor: 'pointer', marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={row.icon} size={17} /></div>
              <span style={{ flex: 1, fontWeight: 600 }}>{row.label}</span>
              {row.toggle ? (
                <div style={{ width: 36, height: 20, background: row.on ? 'var(--blue)' : 'var(--bg2)', borderRadius: 10, border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', padding: 2 }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'white', transform: row.on ? 'translateX(16px)' : 'none', transition: 'transform .3s' }} />
                </div>
              ) : (
                <><span style={{ fontSize: 13, color: 'var(--text3)' }}>{row.val}</span><span style={{ fontSize: 18 }}>›</span></>
              )}
            </div>
          ))}

          <div style={{ marginTop: 4 }}>
            {[
              { icon: 'medal', label: t('nav.legends'), val: t('profile.legendOpen'), valColor: 'var(--green)', action: () => goTo('legends') },
              { icon: 'gem', label: t('profile.vip'), val: vipLbl, valColor: isVip ? 'var(--green)' : 'var(--blue)', action: openPay },
              { icon: 'log-out', label: t('profile.logout'), val: '', valColor: 'var(--red)', action: onLogout }
            ].map((row, i) => (
              <div key={i} onClick={row.action} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, background: 'var(--card)', border: '1px solid var(--border)', cursor: 'pointer', marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: i === 2 ? 'var(--red)' : 'var(--text2)' }}><Icon name={row.icon} size={17} /></div>
                <span style={{ flex: 1, fontWeight: 600, color: i === 2 ? 'var(--red)' : 'var(--text)' }}>{row.label}</span>
                {row.val && <span style={{ fontSize: 13, fontWeight: 600, color: row.valColor }}>{row.val}</span>}
                <span style={{ fontSize: 18, color: 'var(--text3)' }}>›</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};