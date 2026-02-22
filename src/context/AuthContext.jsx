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

    if (window.location.pathname !== '/signin') {
      window.location.assign('/signin');
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/users/me');
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

  const fetchCurrentUser = useCallback(async () => {
    if (!token) {
      return null;
    }

    try {
      const res = await api.get('/users/me');
      return res.data?.user || null;
    } catch (e) {
      console.error('Fetch current user error:', e);
      return null;
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [token]);

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
    console.log('AuthContext login payload:', payload);
    console.log('API_BASE_URL:', import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL);
    
    try {
      const res = await api.post('/auth/login', payload);
      console.log('AuthContext login response:', res.data);
      const nextToken = res.data?.token;
      if (nextToken) {
        localStorage.setItem(STORAGE_TOKEN_KEY, nextToken);
        setToken(nextToken);

        try {
          const profileRes = await api.get('/users/me');
          setUser(profileRes.data?.user || res.data?.user || null);
        } catch {
          setUser(res.data?.user || null);
        }

        toast.success('Welcome back');
      }
      return res.data;
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method
        }
      });
      throw error;
    }
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
      fetchProfile,
      fetchCurrentUser,
      logout,
      refreshProfile: fetchProfile,
    }),
    [token, user, loading, fetchProfile, fetchCurrentUser, register, login, googleLogin, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
