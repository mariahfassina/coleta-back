import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import './Admin.css'; // Reutiliza o CSS do AdminLogin

function ChangePasswordPage() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (newPassword !== confirmNewPassword) {
      setError('A nova senha e a confirmação não coincidem.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      // Ajuste a URL base conforme sua configuração
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

      await axios.post(
        `${API_URL}/api/auth/change-password`,
        { currentPassword, newPassword },
        config
       );

      setSuccess('Senha alterada com sucesso! Redirecionando...');
      
      // Atualiza o estado do usuário no contexto para refletir a mudança
      if (user) {
        const updatedUser = { ...user, needsPasswordChange: false };
        setUser(updatedUser);
        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      }
      
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao alterar a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-background">
      <Helmet>
        <title>Alterar Senha - Painel Administrativo</title>
      </Helmet>
      <div className="login-container">
        <h2>Alterar Senha</h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Por motivos de segurança, você deve alterar sua senha antes de continuar.
        </p>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message" style={{ color: 'green' }}>{success}</p>}
        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label htmlFor="currentPassword">Senha Atual</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Nova Senha</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword">Confirmar Nova Senha</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Alterando...' : 'Alterar Senha'}
          </button>
        </form>
        <button 
          onClick={logout} 
          className="btn-login" 
          style={{ 
            marginTop: '15px', 
            backgroundColor: '#dc3545',
            border: '1px solid #dc3545'
          }}
        >
          Sair
        </button>
      </div>
    </div>
  );
}

export default ChangePasswordPage;
