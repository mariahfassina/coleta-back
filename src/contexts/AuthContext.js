// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    const userInfo = localStorage.getItem('user_info');
    if (token && userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('user_token', data.token);
      const userInfo = { nome: data.nome, email: data.email };
      localStorage.setItem('user_info', JSON.stringify(userInfo));
      setUser(userInfo);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_info');
    setUser(null);
  };

  const authValue = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};