// src/components/admin/AdminLayout.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './AdminLayout.css'; // Criaremos a seguir

function AdminLayout({ children }) {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('user_info'));

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_info');
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3>Painel Coleta</h3>
        <nav>
          <NavLink to="/admin/dashboard" end>Dashboard</NavLink>
        </nav>
        <div className="sidebar-footer">
          {userInfo && <p>Olá, {userInfo.nome}</p>}
          <button onClick={handleLogout}>Sair</button>
        </div>
      </aside>
      <main className="admin-main-content">{children}</main>
    </div>
  );
}

export default AdminLayout;