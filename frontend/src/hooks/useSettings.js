import { useState, useCallback } from 'react';

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem('mongolOndooshil.settings');
      return Object.assign(
        { theme: 'light', notifications: true, language: 'mn', sidebarCollapsed: false },
        raw ? JSON.parse(raw) : {}
      );
    } catch {
      return { theme: 'light', notifications: true, language: 'mn', sidebarCollapsed: false };
    }
  });

  const updateSettings = useCallback((patch) => {
    setSettings(prev => {
      const next = { ...prev, ...patch };
      localStorage.setItem('mongolOndooshil.settings', JSON.stringify(next));
      return next;
    });
  }, []);

  return [settings, updateSettings];
}