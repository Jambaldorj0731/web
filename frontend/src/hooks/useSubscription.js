import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useSubscription() {
  const [sub, setSub] = useState(null);
  const [isVip, setIsVip] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    try {
      const res = await api.get('/payment/status');
      setSub(res.data);
      setIsVip(res.data.active);
    } catch (err) {
      setSub(null);
      setIsVip(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSub = useCallback(async (data) => {
    await api.post('/payment/subscribe', data);
    await fetchSubscription();
  }, [fetchSubscription]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchSubscription();
    else setLoading(false);
  }, [fetchSubscription]);

  return [sub, isVip, saveSub, loading];
}