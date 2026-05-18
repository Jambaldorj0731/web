import { useState } from 'react';
import { Icon } from '../common/Icon';
import { MongolLandscape } from '../common/MongolLandscape';
import api from '../../services/api';
import { I18N } from '../../i18n/translations';

export const LoginPage = ({ onLogin, lang }) => {
  const t = (k) => I18N[lang]?.[k] || I18N.mn[k] || k;
  const [activeTab, setActiveTab] = useState('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Нэвтрэх
  const handleLogin = async () => {
    if (!phone || !password) {
      setError('Утасны дугаар, нууц үгээ оруулна уу');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { phone, password });
      localStorage.setItem('token', res.data.token);
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Нэвтрэхэд алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  // Бүртгүүлэх OTP илгээх
  const sendOtp = async () => {
    if (!phone) {
      setError('Утасны дугаараа оруулна уу');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register/send-otp', { phone });
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.error || 'Алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  // OTP баталгаажуулж, нууц үг тохируулах
  const verifyOtp = async () => {
    if (!otp) {
      setError('OTP кодоо оруулна уу');
      return;
    }
    if (!password) {
      setError('Нууц үгээ оруулна уу');
      return;
    }
    if (password !== confirmPassword) {
      setError('Нууц үг таарахгүй байна');
      return;
    }
    if (password.length < 6) {
      setError('Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register/verify', { phone, otp, password, fullName });
      localStorage.setItem('token', res.data.token);
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Бүртгэл үүсгэхэд алдаа');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setActiveTab('login');
    setStep('phone');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setOtp('');
    setFullName('');
    setError('');
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    background: 'rgba(255,255,255,.07)',
    border: '1.5px solid rgba(255,255,255,.1)',
    borderRadius: 14,
    fontFamily: 'Outfit, sans-serif',
    fontSize: 15,
    fontWeight: 500,
    color: '#F0F6FF',
    outline: 'none'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050A14', display: 'flex', alignItems: 'stretch' }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 420 }}>
        <MongolLandscape />
      </div>
      <div style={{ width: 480, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '52px 48px', background: '#050A14' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg,#2563EB,#1E40AF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Icon name="compass" size={24} />
          </div>
          <div>
            <div style={{ fontFamily: "'Noto Serif',serif", fontSize: 20, fontWeight: 700, color: '#F0F6FF' }}>Монгол Ондоошил</div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '2.5px', color: 'rgba(240,246,255,.4)' }}>Mongolian Identity</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, marginBottom: 32, borderBottom: '1px solid rgba(255,255,255,.1)' }}>
          <button onClick={() => { resetForm(); setActiveTab('login'); }} style={{ background: 'none', border: 'none', padding: '8px 0', fontSize: 16, fontWeight: 600, color: activeTab === 'login' ? '#60A5FA' : 'rgba(240,246,255,.5)', cursor: 'pointer', borderBottom: activeTab === 'login' ? '2px solid #60A5FA' : 'none' }}>Нэвтрэх</button>
          <button onClick={() => { resetForm(); setActiveTab('register'); }} style={{ background: 'none', border: 'none', padding: '8px 0', fontSize: 16, fontWeight: 600, color: activeTab === 'register' ? '#60A5FA' : 'rgba(240,246,255,.5)', cursor: 'pointer', borderBottom: activeTab === 'register' ? '2px solid #60A5FA' : 'none' }}>Бүртгүүлэх</button>
        </div>

        {error && <div style={{ color: '#EF4444', marginBottom: 16, fontSize: 14 }}>{error}</div>}

        {activeTab === 'login' && (
          <>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(240,246,255,.45)', display: 'block', marginBottom: 7 }}>Утасны дугаар</label>
              <input style={inputStyle} type="tel" placeholder="+976" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(240,246,255,.45)', display: 'block', marginBottom: 7 }}>Нууц үг</label>
              <input style={inputStyle} type="password" placeholder="******" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button onClick={handleLogin} disabled={loading} style={{ width: '100%', padding: 16, background: 'var(--blue)', border: 'none', borderRadius: 16, color: 'white', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Нэвтрэж байна...' : 'Нэвтрэх →'}
            </button>
            <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'rgba(240,246,255,.35)' }}>
              <span onClick={() => { resetForm(); setActiveTab('register'); }} style={{ color: '#60A5FA', cursor: 'pointer' }}>Бүртгүүлэх</span> эсвэл&nbsp;
              <span onClick={() => alert('Нууц үг сэргээх холбоос ирэх болно')} style={{ color: '#60A5FA', cursor: 'pointer' }}>Нууц үг мартсан</span>
            </div>
          </>
        )}

        {activeTab === 'register' && (
          <>
            {step === 'phone' && (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(240,246,255,.45)' }}>Утасны дугаар</label>
                  <input style={inputStyle} type="tel" placeholder="+976" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(240,246,255,.45)' }}>Нэр (заавал биш)</label>
                  <input style={inputStyle} type="text" placeholder="Таны нэр" value={fullName} onChange={e => setFullName(e.target.value)} />
                </div>
                <button onClick={sendOtp} disabled={loading} style={{ width: '100%', padding: 16, background: 'var(--blue)', border: 'none', borderRadius: 16, color: 'white', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Илгээж байна...' : 'Код илгээх →'}
                </button>
              </>
            )}
            {step === 'otp' && (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(240,246,255,.45)' }}>OTP код</label>
                  <input style={inputStyle} type="text" placeholder="123456" value={otp} onChange={e => setOtp(e.target.value)} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(240,246,255,.45)' }}>Нууц үг (6+ тэмдэгт)</label>
                  <input style={inputStyle} type="password" placeholder="******" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(240,246,255,.45)' }}>Нууц үг баталгаажуулах</label>
                  <input style={inputStyle} type="password" placeholder="Давтан оруулна уу" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </div>
                <button onClick={verifyOtp} disabled={loading} style={{ width: '100%', padding: 16, background: 'linear-gradient(135deg,var(--blue),#1E40AF)', border: 'none', borderRadius: 16, color: 'white', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Бүртгэж байна...' : 'Бүртгэл үүсгэх →'}
                </button>
                <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13 }}>
                  <span onClick={() => setStep('phone')} style={{ color: '#60A5FA', cursor: 'pointer' }}>← Буцах</span>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};