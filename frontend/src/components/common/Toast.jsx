export const Toast = ({ msg, type, visible }) => {
  const colors = { ok: '#059669', err: '#DC2626', info: '#2563EB' };
  return (
    <div style={{
      position: 'fixed',
      bottom: 28,
      left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : 60}px)`,
      opacity: visible ? 1 : 0,
      transition: 'all .3s',
      zIndex: 9999,
      background: colors[type] || '#374151',
      color: 'white',
      padding: '10px 22px',
      borderRadius: 12,
      fontWeight: 600,
      fontSize: 14,
      boxShadow: '0 4px 20px rgba(0,0,0,.2)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none'
    }}>
      {msg}
    </div>
  );
};