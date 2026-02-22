import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';

const AuthContext = createContext(null);

const STORAGE_TOKEN_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    setToken(null);
    setUser(null);

    if (window.location.pathname !== '/') {
      window.location.assign('/');
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/profile');
      setUser(res.data?.user || null);
    } catch (e) {
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      setToken(null);
      setUser(null);
      toast.error('Please sign in again.');

      if (import.meta.env.MODE !== 'production') {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const register = useCallback(async (payload) => {
    const res = await api.post('/auth/register', payload);
    const nextToken = res.data?.token;
    if (nextToken) {
      localStorage.setItem(STORAGE_TOKEN_KEY, nextToken);
      setToken(nextToken);

      try {
        const profileRes = await api.get('/auth/profile');
        setUser(profileRes.data?.user || res.data?.user || null);
      } catch {
        setUser(res.data?.user || null);
      }

      toast.success('Account created');
    }
    return res.data;
  }, []);

  const googleLogin = useCallback(async ({ idToken }) => {
    const res = await api.post('/auth/google', { idToken });
    const nextToken = res.data?.token;
    if (nextToken) {
      localStorage.setItem(STORAGE_TOKEN_KEY, nextToken);
      setToken(nextToken);

      try {
        const profileRes = await api.get('/auth/profile');
        setUser(profileRes.data?.user || res.data?.user || null);
      } catch {
        setUser(res.data?.user || null);
      }

      toast.success('Signed in with Google');
    }
    return res.data;
  }, []);

  const login = useCallback(async (payload) => {
    const res = await api.post('/auth/login', payload);
    const nextToken = res.data?.token;
    if (nextToken) {
      localStorage.setItem(STORAGE_TOKEN_KEY, nextToken);
      setToken(nextToken);

      try {
        const profileRes = await api.get('/auth/profile');
        setUser(profileRes.data?.user || res.data?.user || null);
      } catch {
        setUser(res.data?.user || null);
      }

      toast.success('Welcome back');
    }
    return res.data;
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: !!token,
      register,
      login,
      googleLogin,
      logout,
      refreshProfile: fetchProfile,
    }),
    [token, user, loading, register, login, googleLogin, logout, fetchProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
