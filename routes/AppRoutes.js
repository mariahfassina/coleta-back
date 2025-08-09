// src/routes/AppRoutes.js

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import HomePage from '../pages/public/Home';
import GenericPage from '../pages/public/GenericPage';
import NotFoundPage from '../pages/public/NotFoundPage';

import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import EditPage from '../pages/admin/EditPage';
import ChangePasswordPage from '../src/pages/admin/ChangePasswordPage'; // <-- Importe o novo componente

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/como-separar/como-fazer" element={<GenericPage slug="como-fazer-separacao" />} />
      <Route path="/como-separar/residuos" element={<GenericPage slug="quais-residuos" />} />
      <Route path="/como-separar/porque-separar" element={<GenericPage slug="porque-separar" />} />
      <Route path="/quemsomos" element={<GenericPage slug="quem-somos" />} />
      <Route path="/total-coletado" element={<GenericPage slug="total-coletado-grafico" />} />
      <Route path="/contato" element={<GenericPage slug="contato" />} />
      
      <Route path="/login" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Rotas Protegidas */}
      <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
      <Route path="/admin/paginas/edit/:id" element={<PrivateRoute><EditPage /></PrivateRoute>} />
      <Route path="/admin/change-password" element={<PrivateRoute><ChangePasswordPage /></PrivateRoute>} /> {/* <-- Nova Rota */}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
