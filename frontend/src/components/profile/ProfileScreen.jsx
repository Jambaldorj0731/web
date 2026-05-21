// frontend/src/components/profile/ProfileScreen.jsx
import { useEffect, useState } from 'react';
import { useUserData } from '../../contexts/UserDataContext';
import api from '../../services/api';
import { Icon } from '../common/Icon';

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '11px 12px',
  borderRadius: 10,
  border: '1px solid var(--border)',
  background: 'var(--card)',
  color: 'var(--text)',
  outline: 'none'
};

const sectionCardStyle = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: 18
};

export const ProfileScreen = ({ t, settings, updateSettings, showToast, isVip, sub, openPay, goTo, onLogout }) => {
  const { profile, loading, error, refetch } = useUserData();
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState({ fullName: '', shortName: '', avatarUrl: '' });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const checkViewport = () => setIsNarrow(window.innerWidth <= 900);
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  if (loading) return <div style={{ padding: 28, textAlign: 'center' }}>🔄 Ачааллаж байна...</div>;
  if (error) return <div style={{ padding: 28, textAlign: 'center', color: 'var(--red)' }}>❌ {error}</div>;
  if (!profile) return <div style={{ padding: 28, textAlign: 'center' }}>Мэдээлэл олдсонгүй</div>;

  // Тэмдгүүдийн зөв нэрс
  const badges = [
    { icon: 'dumbbell', label: 'Залуу бөх', earned: profile.xp >= 100 },
    { icon: 'flame', label: `${profile.streak_days} Өдөр`, earned: profile.streak_days >= 14 },
    { icon: 'route', label: 'Туслах уяач', earned: profile.xp >= 500 },
    { icon: 'star', label: 'Шилдэг Хариулт', earned: profile.badge_count >= 5 },
    { icon: 'book', label: 'Уран Бичигч', earned: profile.xp >= 1000 },
    { icon: 'home', label: 'Гэр баригч', earned: false },
    { icon: 'crown', label: 'Улсын Аварга', earned: profile.rank_name === 'Улсын Аварга' || profile.rank_name === 'Дархан Аварга' },
    { icon: 'trophy', label: 'Дархан Аварга', earned: profile.rank_name === 'Дархан Аварга' }
  ];

  const vipLbl = isVip
    ? (sub?.plan === 'yearly' ? 'VIP · жилийн багц' : 'VIP · сарын багц') + ' · дуусах: ' + new Date(sub.expiresAt).toLocaleDateString('mn-MN')
    : (settings.language === 'en' ? 'From ₮9,900/mo' : '₮9,900/сар');

  const handleUpdateName = async () => {
    try {
      await api.put('/user/profile', editName);
      showToast('Нэр амжилттай шинэчлэгдлээ', 'ok');
      setEditMode(false);
      refetch();
    } catch (err) {
      showToast(err.response?.data?.error || 'Алдаа', 'err');
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Зөвхөн зураг файл оруулна уу', 'err');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('Зураг 10MB-аас бага байх ёстой', 'err');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setEditName(prev => ({ ...prev, avatarUrl: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('Шинэ нууц үг таарахгүй байна', 'err');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast('Нууц үг 6-аас дээш тэмдэгт байх ёстой', 'err');
      return;
    }
    try {
      await api.put('/user/change-password', { oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword });
      showToast('Нууц үг солигдлоо', 'ok');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.response?.data?.error || 'Алдаа', 'err');
    }
  };

  return (
    <div style={{ padding: isNarrow ? '18px 16px' : '28px 32px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>{t('profile.title')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : 'minmax(260px, 300px) minmax(0, 1fr)', gap: 24 }}>
        {/* Зүүн тал: профайл карт */}
        <div>
          <div style={{ background: 'var(--card)', borderRadius: 24, padding: '28px 22px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'var(--blue-lt)', border: '3px solid var(--blue-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', overflow: 'hidden' }}>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Icon name="circle-user-round" size={40} />
              )}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{profile.full_name || profile.short_name}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--blue)', marginBottom: 20 }}>{profile.rank_name} · #{profile.rank_position}</div>
            <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
              <div><div style={{ fontSize: 20, fontWeight: 800 }}>{profile.xp}</div><div style={{ fontSize: 12, color: 'var(--text3)' }}>XP</div></div>
              <div><div style={{ fontSize: 20, fontWeight: 800 }}>{profile.streak_days}</div><div style={{ fontSize: 12, color: 'var(--text3)' }}>Өдөр</div></div>
              <div><div style={{ fontSize: 20, fontWeight: 800 }}>{profile.badge_count}</div><div style={{ fontSize: 12, color: 'var(--text3)' }}>Тэмдэг</div></div>
            </div>

            <div style={{ marginTop: 20 }}>
              {!editMode ? (
                <button onClick={() => { setEditName({ fullName: profile.full_name || '', shortName: profile.short_name || '', avatarUrl: profile.avatar_url || '' }); setEditMode(true); }} style={{ width: '100%', padding: 10, background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
                   Профайл засварлах
                </button>
              ) : (
                <div style={{ marginTop: 12 }}>
                  <div style={{ width: 76, height: 76, borderRadius: '50%', overflow: 'hidden', background: 'var(--bg1)', border: '2px solid var(--border)', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {editName.avatarUrl ? <img src={editName.avatarUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Icon name="circle-user-round" size={34} />}
                  </div>
                  <label style={{ display: 'block', width: '100%', boxSizing: 'border-box', padding: '9px 10px', marginBottom: 8, borderRadius: 8, background: 'var(--bg1)', border: '1px solid var(--border)', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                    Зураг оруулах
                    <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                  </label>
                  {editName.avatarUrl && <button type="button" onClick={() => setEditName({ ...editName, avatarUrl: '' })} style={{ width: '100%', padding: 8, marginBottom: 8, background: 'var(--bg2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer' }}>Зураг арилгах</button>}
                  <input type="text" value={editName.fullName} onChange={(e) => setEditName({ ...editName, fullName: e.target.value })} placeholder="Бүтэн нэр" style={{ ...inputStyle, marginBottom: 8 }} />
                  <input type="text" value={editName.shortName} onChange={(e) => setEditName({ ...editName, shortName: e.target.value })} placeholder="Товч нэр" style={{ ...inputStyle, marginBottom: 8 }} />
                  <button onClick={handleUpdateName} style={{ marginRight: 8, padding: '6px 12px', background: 'var(--green)', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Хадгалах</button>
                  <button onClick={() => setEditMode(false)} style={{ padding: '6px 12px', background: 'var(--bg2)', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Цуцлах</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Баруун тал */}
        <div>
          {/* Тэмдгүүд */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, marginBottom: 14 }}>{t('profile.badgesTitle')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: isNarrow ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4,1fr)', gap: 12 }}>
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

          {/* Тохиргоо */}
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
                <><span style={{ fontSize: 13, color: 'var(--text3)' }}>{row.val}</span><span style={{ fontSize: 18, color: 'var(--text3)' }}>›</span></>
              )}
            </div>
          ))}

          {/* Нууц үг солих хэсэг */}
          <div style={{ ...sectionCardStyle, marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="lock" size={17} /></div>
              <h4 style={{ margin: 0 }}>Нууц үг солих</h4>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              <input type="password" autoComplete="current-password" placeholder="Хуучин нууц үг" value={passwordData.oldPassword} onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} style={inputStyle} />
              <input type="password" autoComplete="new-password" placeholder="Шинэ нууц үг" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} style={inputStyle} />
              <input type="password" autoComplete="new-password" placeholder="Шинэ нууц үг давтах" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} style={inputStyle} />
              <button onClick={handleChangePassword} style={{ width: '100%', boxSizing: 'border-box', padding: 11, background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>Нууц үг солих</button>
            </div>
          </div>

          <div style={{ marginTop: 4 }}>
            {[
              { icon: 'medal', label: t('nav.legends'), val: '1 нээлттэй', valColor: 'var(--green)', action: () => goTo('legends') },
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
