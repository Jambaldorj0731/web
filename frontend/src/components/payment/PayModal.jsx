import { useState } from 'react';
import { Icon } from '../common/Icon';

export const PayModal = ({ open, onClose, t, onConfirm }) => {
  const [plan, setPlan] = useState('yearly');
  const [method, setMethod] = useState('qpay');
  const [loading, setLoading] = useState(false);

  const confirm = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => { onConfirm(plan, method); setLoading(false); onClose(); }, 1600);
  };

  if (!open) return null;

  // Стилүүдэд CSS хувьсагч (var(--text), var(--text2)) ашигласан
  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{ position: 'fixed', inset: 0, zIndex: 10050, background: 'rgba(15,23,42,.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'var(--card)', borderRadius: 24, maxWidth: 440, width: '100%', padding: '28px 26px 22px', position: 'relative', boxShadow: 'var(--sh-lg)', border: '1px solid var(--border)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 14, width: 36, height: 36, border: 'none', borderRadius: 10, background: 'var(--bg1)', color: 'var(--text2)', fontSize: 22, cursor: 'pointer' }}>×</button>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 10 }}>
          <Icon name="gem" size={16} /> VIP Pro
        </div>

        {/* Гарчиг – өнгө нь темийн текстээр дамжина */}
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>{t('pay.title')}</h2>
        <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 20 }}>{t('pay.lead')}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
          {[
            { key: 'monthly', name: t('pay.planMonth'), price: '₮9,900', note: t('pay.perMonth') },
            { key: 'yearly', name: t('pay.planYear'), price: '₮99,000', note: t('pay.perYear'), tag: t('pay.saveTag') }
          ].map(p => (
            <button key={p.key} onClick={() => setPlan(p.key)} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, padding: '14px', borderRadius: 14, border: `2px solid ${plan === p.key ? 'var(--blue)' : 'var(--border)'}`, background: plan === p.key ? 'var(--blue-lt)' : 'var(--bg1)', cursor: 'pointer' }}>
              {p.tag && <span style={{ position: 'absolute', top: -9, right: 10, fontSize: 9, fontWeight: 800, background: 'var(--amber)', color: 'white', padding: '4px 8px', borderRadius: 20 }}>{p.tag}</span>}
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text3)' }}>{p.name}</span>
              {/* Үнийн дүн – темийн өнгөөр */}
              <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{p.price}</span>
              <span style={{ fontSize: 11, color: 'var(--text2)' }}>{p.note}</span>
            </button>
          ))}
        </div>

        <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 10, color: 'var(--text3)' }}>{t('pay.methodLabel')}</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {[['qpay', 'smartphone', 'QPay'], ['card', 'landmark', t('pay.bankCard')]].map(([key, ic, label]) => (
            <button key={key} onClick={() => setMethod(key)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 12, border: `1.5px solid ${method === key ? 'var(--blue)' : 'var(--border)'}`, background: method === key ? 'var(--blue-lt)' : 'var(--bg1)', fontSize: 12, fontWeight: 700, color: method === key ? 'var(--blue)' : 'var(--text2)', cursor: 'pointer' }}>
              <Icon name={ic} size={14} /> {label}
            </button>
          ))}
        </div>

        <button disabled={loading} onClick={confirm} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,var(--blue),#1E40AF)', border: 'none', borderRadius: 14, color: 'white', fontWeight: 800, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.65 : 1 }}>
          {loading ? t('pay.processing') : t('pay.payBtn')}
        </button>
        <p style={{ marginTop: 14, fontSize: 11, textAlign: 'center', color: 'var(--text3)' }}>{t('pay.disclaimer')}</p>
      </div>
    </div>
  );
};