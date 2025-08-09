import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../config/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verifica e carrega o usuário ao iniciar
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo')); // Usar 'userInfo' como definido no login
        if (userInfo && userInfo.token) {
          // Não há rota /api/auth/me no backend fornecido.
          // A validação do token e o carregamento do usuário serão feitos
          // com base nas informações do localStorage e na resposta do login.
          setUser(userInfo);
        }
      } catch (error) {
        console.error('Falha ao carregar usuário do localStorage:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login com tratamento de erros
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      const { data } = await api.post('/api/auth/login', { email, password });
      
      // O backend já retorna _id, nome, email, token e needsPasswordChange
      const userInfo = {
        _id: data._id,
        nome: data.nome,
        email: data.email,
        token: data.token,
        needsPasswordChange: data.needsPasswordChange // <-- Adicionado aqui
      };

      setUser(userInfo);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      // Redireciona com base na flag needsPasswordChange
      if (data.needsPasswordChange) {
        navigate('/admin/change-password');
      } else {
        navigate('/admin/dashboard');
      }

      return { success: true, user: userInfo };
    } catch (error) {
      console.error('Erro no login:', error);
      throw error; // Propaga o erro para o AdminLogin.js
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Logout seguro
  const logout = useCallback(() => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/admin/login'); // Redireciona para login
  }, [navigate]);

  // Verifica permissões (opcional, se você tiver roles)
  const hasPermission = useCallback((requiredRole) => {
    if (!user) return false;
    // Adapte para seu sistema de roles, se houver
    // Exemplo: return user.role === requiredRole;
    return true; // Ou sua lógica de permissão
  }, [user]);

  const authValue = {
    user,
    loading,
    login,
    logout,
    hasPermission,
    isAuthenticated: !!user,
    setUser // Adicionado para permitir atualização do user após mudança de senha
  };

  return (
    <AuthContext.Provider value={authValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
