// src/pages/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '../../components/admin/AdminLayout';
import './Admin.css';

function AdminDashboard() {
  const [paginas, setPaginas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaginas = async () => {
      try {
        const { data } = await api.get('/api/paginas/admin'); // Usa a rota de admin para listar
        setPaginas(data);
      } catch (error) {
        console.error("Erro ao buscar páginas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPaginas();
  }, []);

  return (
    <AdminLayout>
      <Helmet>
        <title>Dashboard - Painel Administrativo</title>
      </Helmet>
      <div className="admin-content">
        <h1>Gerenciar Conteúdo do Site</h1>
        <p>Selecione uma página ou seção abaixo para editar seu conteúdo, textos e imagens.</p>
        
        {loading ? (
          <p>Carregando páginas gerenciáveis...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título da Seção / Página</th>
                <th>Identificador (Slug)</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginas.map((pagina) => (
                <tr key={pagina._id}>
                  <td>{pagina.titulo}</td>
                  <td>{pagina.slug}</td>
                  <td>
                    <Link to={`/admin/paginas/edit/${pagina._id}`} className="btn-edit">
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;