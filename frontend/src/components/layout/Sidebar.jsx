import { Icon } from '../common/Icon';

const NAV_ITEMS = [
  { id: 'home', icon: 'layout-dashboard', labelKey: 'nav.home' },
  { id: 'lessons', icon: 'map', labelKey: 'nav.lessons' },
  { id: 'test', icon: 'clipboard-check', labelKey: 'nav.test' },
  { id: 'legends', icon: 'mic-2', labelKey: 'nav.legends' },
  { id: 'rank', icon: 'trophy', labelKey: 'nav.rank' },
  { id: 'profile', icon: 'circle-user-round', labelKey: 'nav.profile' }
];

export const Sidebar = ({ cur, goTo, settings, updateSettings, t, onLogout, isAdmin = false, isMobileLayout = false }) => {
  const collapsed = settings.sidebarCollapsed;
  const sidebarWidth = collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar)';

  // Админ бол нэмэлт цэс
  const navItems = isAdmin
    ? [...NAV_ITEMS, { id: 'admin', icon: 'shield', labelKey: 'nav.admin' }]
    : NAV_ITEMS;

  return (
    <nav style={isMobileLayout ? {
      position: 'fixed',
      left: 10,
      right: 10,
      bottom: 10,
      zIndex: 100,
      background: 'rgba(24,32,48,.94)',
      border: '1px solid var(--border)',
      borderRadius: 18,
      boxShadow: 'var(--sh-lg)',
      backdropFilter: 'blur(12px)',
      padding: 8
    } : {
      width: sidebarWidth,
      flexShrink: 0,
      background: 'var(--card)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 100,
      transition: 'width .28s cubic-bezier(.4,0,.2,1)',
      overflow: 'hidden'
    }}>
      {/* Toggle button */}
      {!isMobileLayout && <div onClick={() => updateSettings({ sidebarCollapsed: !collapsed })}
        style={{
          position: 'absolute', top: 20, right: -13, width: 26, height: 26,
          background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          fontSize: 11, color: 'var(--text3)', boxShadow: 'var(--sh-sm)', zIndex: 101,
          transition: 'background .2s,color .2s,transform .28s',
          transform: collapsed ? 'rotate(180deg)' : 'none', userSelect: 'none'
        }}>‹</div>}

      {/* Brand */}
      {!isMobileLayout && <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '20px 13px 18px', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap', overflow: 'hidden', minHeight: 68 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg,#2563EB,#1E40AF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white' }}>
          <Icon name="compass" size={18} />
        </div>
        {!collapsed && <div>
          <div style={{ fontFamily: "'Noto Serif',serif", fontSize: 14, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>Монгол Ондоошил</div>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text3)' }}>Mongolian Identity</div>
        </div>}
      </div>}

      {/* Navigation items */}
      <div style={isMobileLayout ? { display: 'grid', gridTemplateColumns: `repeat(${Math.min(navItems.length, 6)}, minmax(0, 1fr))`, gap: 4 } : { flex: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map(item => (
          <div key={item.id} onClick={() => goTo(item.id)}
            style={{
              display: isMobileLayout && item.id === 'admin' ? 'none' : 'flex', alignItems: 'center', gap: 12,
              padding: isMobileLayout ? '9px 4px' : collapsed ? '11px 0' : '11px 12px', borderRadius: 12, cursor: 'pointer', transition: 'all .2s',
              color: cur === item.id ? 'var(--blue)' : 'var(--text2)',
              background: cur === item.id ? 'var(--blue-lt)' : 'transparent', fontWeight: 600, fontSize: isMobileLayout ? 10 : 13,
              whiteSpace: 'nowrap', justifyContent: 'center', flexDirection: isMobileLayout ? 'column' : 'row', minWidth: 0
            }}
            onMouseEnter={e => { if (cur !== item.id) { e.currentTarget.style.background = 'var(--bg1)'; e.currentTarget.style.color = 'var(--text)'; } }}
            onMouseLeave={e => { if (cur !== item.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text2)'; } }}>
            <span style={{ width: 24, textAlign: 'center', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={item.icon} size={18} />
            </span>
            {(!collapsed || isMobileLayout) && <span style={isMobileLayout ? { overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' } : undefined}>{t(item.labelKey)}</span>}
          </div>
        ))}
      </div>

      {/* Footer */}
      {!isMobileLayout && <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)' }}>
        <div onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '10px 0' : '10px 12px', borderRadius: 12, cursor: 'pointer', justifyContent: collapsed ? 'center' : 'flex-start', marginBottom: 4 }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <Icon name={settings.theme === 'dark' ? 'moon' : 'sun'} size={18} style={{ color: 'var(--text2)' }} />
          {!collapsed && <>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', flex: 1 }}>{t('settings.darkMode')}</span>
            <div style={{ width: 36, height: 20, background: settings.theme === 'dark' ? 'var(--blue)' : 'var(--bg2)', borderRadius: 10, border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', padding: 2, transition: 'background .3s' }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'white', transform: settings.theme === 'dark' ? 'translateX(16px)' : 'none', transition: 'transform .3s' }} />
            </div>
          </>}
        </div>

        <div onClick={() => goTo('profile')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '10px 0' : '10px 12px', borderRadius: 12, cursor: 'pointer', justifyContent: collapsed ? 'center' : 'flex-start' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--blue-lt)', border: '2px solid var(--blue-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--blue)' }}>
            <Icon name="circle-user-round" size={18} />
          </div>
          {!collapsed && <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Профайл</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)' }}>Дэлгэрэнгүй</div>
          </div>}
        </div>
      </div>}
    </nav>
  );
};
