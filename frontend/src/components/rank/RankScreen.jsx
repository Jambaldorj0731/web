import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Icon } from '../common/Icon';

export const RankScreen = ({ t }) => {
  const [period, setPeriod] = useState('alltime');
  const [users, setUsers] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isNarrow, setIsNarrow] = useState(false);

  const periods = [
    { value: 'weekly', label: 'Долоо хоног' },
    { value: 'monthly', label: 'Сар' },
    { value: 'alltime', label: 'Бүгд' }
  ];

  useEffect(() => {
    fetchLeaderboard();
  }, [period, page, search]);

  useEffect(() => {
    const checkViewport = () => setIsNarrow(window.innerWidth <= 760);
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/leaderboard?period=${period}&page=${page}&limit=20&search=${search}`);
      setUsers(res.data.users);
      setMyRank(res.data.myRank);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const getDisplayName = (user) => {
    return user.shortName || user.fullName || user.phone || 'Хэрэглэгч';
  };

  if (loading && users.length === 0) {
    return <div style={{ padding: 28, textAlign: 'center' }}>🔄 Ачааллаж байна...</div>;
  }

  return (
    <div style={{ padding: isNarrow ? '18px 16px' : '28px 32px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{t('rank.pageTitle')}</h1>
        <p style={{ color: 'var(--text3)', fontSize: 14 }}>{t('rank.pageSub')}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 8, background: 'var(--bg1)', borderRadius: 40, padding: 4, overflowX: 'auto', maxWidth: '100%' }}>
          {periods.map(p => (
            <button
              key={p.value}
              onClick={() => { setPeriod(p.value); setPage(1); }}
              style={{
                padding: '8px 20px',
                borderRadius: 32,
                border: 'none',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                background: period === p.value ? 'var(--blue)' : 'transparent',
                color: period === p.value ? 'white' : 'var(--text2)'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg1)', borderRadius: 40, padding: '4px 16px', width: isNarrow ? '100%' : 'auto' }}>
          <Icon name="search" size={16} style={{ color: 'var(--text3)' }} />
          <input
            type="text"
            placeholder="Хэрэглэгч хайх..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ background: 'transparent', border: 'none', padding: '8px 0', outline: 'none', fontSize: 14, color: 'var(--text)', width: isNarrow ? '100%' : 200 }}
          />
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, var(--blue-lt), var(--bg1))', borderRadius: 20, padding: '16px 24px', marginBottom: 24, border: `1px solid var(--blue-md)` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 18 }}>
              {myRank || '?'}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)' }}>{t('rank.myRankTag')}</div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>#{myRank || '—'}</div>
            </div>
          </div>
          <div style={{ fontSize: 14, color: 'var(--text3)' }}>✨ Нийт хэрэглэгч: {users.length ? users[0]?.rank + (users.length - 1) : '—'}</div>
        </div>
      </div>

      <div style={{ background: 'var(--card)', borderRadius: 24, overflowX: 'auto', border: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 60px 1fr 120px 100px', background: 'var(--bg1)', padding: '14px 20px', fontWeight: 700, fontSize: 13, color: 'var(--text2)', borderBottom: '1px solid var(--border)' }}>
          <div>Байр</div>
          <div></div>
          <div>Хэрэглэгч</div>
          <div>XP</div>
          <div>Цол</div>
        </div>
        <div>
          {users.map((user) => (
            <div
              key={user._id}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 60px 1fr 120px 100px',
                alignItems: 'center',
                padding: '14px 20px',
                borderBottom: '1px solid var(--border)',
                background: user._id === myRank?._id ? 'var(--blue-lt)' : 'transparent'
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--amber)' }}>{getMedal(user.rank) || `#${user.rank}`}</div>
              <div>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, color: 'var(--text2)' }}>
                  {getDisplayName(user).charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{getDisplayName(user)}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>🔥 {user.streakDays || 0} өдөр</div>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--blue)' }}>{user.totalXp}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>🏅 {user.badgeCount || 0} тэмдэг</div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, background: 'var(--bg2)', padding: '4px 12px', borderRadius: 20, textAlign: 'center' }}>{user.rankName}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card)', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>← Өмнөх</button>
          <span style={{ padding: '8px 16px', background: 'var(--blue-lt)', borderRadius: 8, fontWeight: 700 }}>{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card)', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}>Дараах →</button>
        </div>
      )}
    </div>
  );
};
