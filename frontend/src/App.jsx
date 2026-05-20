import { useState, useEffect, useCallback, useRef } from 'react';
import { useSettings } from './hooks/useSettings';
import { useSubscription } from './hooks/useSubscription';
import { UserDataProvider, useUserData } from './contexts/UserDataContext';
import api from './services/api';
import { LoginPage } from './components/auth/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { HomeScreen } from './components/home/HomeScreen';
import { LessonsScreen } from './components/lessons/LessonsScreen';
import { DetailScreen } from './components/lessons/DetailScreen';
import { TestScreen } from './components/quiz/TestScreen';
import { LegendsScreen } from './components/legends/LegendsScreen';
import { RankScreen } from './components/rank/RankScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { PayModal } from './components/payment/PayModal';
import { Toast } from './components/common/Toast';
import { I18N } from './i18n/translations';

function AppContent() {
  const [settings, updateSettings] = useSettings();
  const [sub, isVip, saveSub] = useSubscription();
  const [loggedIn, setLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [cur, setCur] = useState('home');
  const [prev, setPrev] = useState(null);
  const [payOpen, setPayOpen] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: '', visible: false });
  const toastTimer = useRef(null);
  const { profile, modules, loading, error, refetch } = useUserData();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  const showToast = useCallback((msg, type) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, type, visible: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2400);
  }, []);

  const t = useCallback((key) => {
    const lang = settings.language === 'en' ? 'en' : 'mn';
    return I18N[lang]?.[key] || I18N.mn[key] || key;
  }, [settings.language]);

  const goTo = useCallback((id, params = {}) => {
    setPrev(cur);
    setCur(id);
    if (params.lessonId) {
      window.sessionStorage.setItem('currentLessonId', params.lessonId);
    }
    window.scrollTo(0, 0);
  }, [cur]);

  const handleLogin = async (user) => {
    setLoggedIn(true);
    await refetch();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setCur('home');
    showToast(t('toast.loggedOut'), 'info');
  };

  const confirmPay = async (plan, method) => {
    await saveSub({ plan, method });
    showToast(t('pay.success'), 'ok');
  };

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} lang={settings.language} />;
  }

  const sidebarWidth = settings.sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar)';
  const lessonIdFromStorage = window.sessionStorage.getItem('currentLessonId');

  const screens = {
    home: <HomeScreen t={t} goTo={goTo} onRetry={refetch} />,
    lessons: <LessonsScreen t={t} goTo={goTo} showToast={showToast} />,
    detail: <DetailScreen t={t} goBack={() => goTo(prev || 'lessons')} lessonId={lessonIdFromStorage} />,
    test: <TestScreen t={t} showToast={showToast} />,
    legends: <LegendsScreen showToast={showToast} isVip={isVip} openPay={() => setPayOpen(true)} />,
    rank: <RankScreen t={t} />,
    profile: <ProfileScreen t={t} settings={settings} updateSettings={updateSettings} showToast={showToast} isVip={isVip} sub={sub} openPay={() => setPayOpen(true)} goTo={goTo} onLogout={logout} />
  };

  return (
    <>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
        <Sidebar cur={cur} goTo={goTo} settings={settings} updateSettings={updateSettings} t={t} onLogout={logout} />
        <main style={{ marginLeft: sidebarWidth, flex: 1, minHeight: '100vh', transition: 'margin-left .28s cubic-bezier(.4,0,.2,1)', overflowX: 'hidden' }}>
          {loading && cur === 'home' ? <div style={{ padding: 28, textAlign: 'center' }}>🔄 Ачааллаж байна...</div> : screens[cur] || screens.home}
        </main>
      </div>
      <PayModal open={payOpen} onClose={() => setPayOpen(false)} t={t} onConfirm={confirmPay} />
      <Toast msg={toast.msg} type={toast.type} visible={toast.visible} />
    </>
  );
}

export default function App() {
  return (
    <UserDataProvider>
      <AppContent />
    </UserDataProvider>
  );
}