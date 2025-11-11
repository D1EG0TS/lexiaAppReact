import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { api } from '../api/client';
import { onUnauthorized } from './authEvents';
import { getToken, setToken, deleteToken } from '../utils/tokenStorage';

export type Role = 'user' | 'admin';
export type User = { id: number; email: string; full_name: string; role: Role };

type AuthContextType = {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { email: string; full_name: string; password: string; role?: Role }) => Promise<User>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<User | null>;
  isAdmin: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      const stored = await getToken();
      if (stored) {
        setTokenState(stored);
        try {
          const me = await fetchMe();
          if (me) setUser(me);
        } catch (e) {}
      }
      setLoading(false);
    };
    init();

    const unsubscribe = onUnauthorized(async () => {
      await logout();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);
      params.append('grant_type', 'password');
      params.append('scope', '');
      const { data } = await axios.post(`${api.defaults.baseURL}/auth/login`, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const access_token = data?.access_token;
      if (access_token) {
        await setToken(access_token);
        setTokenState(access_token);
        const me = await fetchMe();
        if (me) setUser(me);
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: { email: string; full_name: string; password: string; role?: Role }) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', payload);
      return data as User;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await deleteToken();
    setTokenState(null);
    setUser(null);
  };

  const fetchMe = async (): Promise<User | null> => {
    try {
      const { data } = await api.get('/users/me');
      return data as User;
    } catch (e) {
      return null;
    }
  };

  const isAdmin = () => user?.role === 'admin';

  const value = useMemo(
    () => ({ token, user, loading, login, register, logout, fetchMe, isAdmin }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};