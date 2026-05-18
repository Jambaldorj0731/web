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
      setError(null);
      const [profileRes, modulesRes] = await Promise.all([
        api.get('/user/profile'),
        api.get('/user/modules')
      ]);
      setProfile(profileRes.data);
      setModules(modulesRes.data);
    } catch (err) {
      console.error('Fetch user data error:', err);
      setError(err.response?.data?.error || 'Хэрэглэгчийн мэдээлэл ачааллахад алдаа гарлаа');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
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