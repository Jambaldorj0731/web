import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [profileRes, modulesRes] = await Promise.all([
        api.get('/user/profile'),
        api.get('/user/modules')
      ]);
      setProfile(profileRes.data);
      setModules(modulesRes.data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.error || 'Мэдээлэл ачааллахад алдаа');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location = '/';
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return (
    <UserDataContext.Provider value={{ profile, modules, loading, error, refetch }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);