// src/pages/admin/EditPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/api'; // Usa a api privada por padrão
import AdminLayout from '../../components/admin/AdminLayout';
import { Helmet } from 'react-helmet-async';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Admin.css';

function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [midiaUrl, setMidiaUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const { data } = await api.get(`/api/paginas/${id}`);
        setTitulo(data.titulo);
        setConteudo(data.conteudo);
        setMidiaUrl(data.midiaUrl || '');
      } catch (error) {
        console.error("Erro ao buscar dados da página:", error);
        alert('Não foi possível carregar os dados para edição.');
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, [id]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMidiaUrl(data.image);
      alert('Imagem enviada! Clique em "Salvar Alterações" para confirmar.');
    } catch (error) {
      alert('Erro ao enviar imagem.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/api/paginas/${id}`, { titulo, conteudo, midiaUrl });
      alert('Página atualizada com sucesso!');
      navigate('/admin/dashboard');
    } catch (error) {
      alert('Erro ao salvar as alterações.');
      setSaving(false);
    }
  };

  if (loading) {
    return <AdminLayout><p>Carregando editor...</p></AdminLayout>;
  }

  return (
    <AdminLayout>
      <Helmet><title>Editando: {titulo}</title></Helmet>
      <div className="admin-content">
        <h1>Editando: "{titulo}"</h1>
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="titulo">Título da Seção</label>
            <input type="text" id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          </div>
          
          <div className="form-group">
            <label>Conteúdo Principal</label>
            <ReactQuill theme="snow" value={conteudo} onChange={setConteudo} />
          </div>

          <div className="form-group">
            <label htmlFor="midia">Mídia (URL da Imagem/Vídeo)</label>
            {/* ✅ CÓDIGO CORRETO AQUI */}
            {midiaUrl && (
              <div className="media-preview">
                {midiaUrl.includes('youtube') ? <p>Vídeo: {midiaUrl}</p> : <img src={`${process.env.REACT_APP_API_URL}${midiaUrl}`} alt="Prévia da imagem atual" />}
              </div>
            )}
            <input type="text" value={midiaUrl} onChange={(e) => setMidiaUrl(e.target.value)} placeholder="Cole uma URL de vídeo ou envie uma imagem abaixo" />
            
            <label htmlFor="upload" style={{ marginTop: '15px', display: 'block' }}>Substituir por nova imagem:</label>
            <input type="file" id="upload" onChange={handleUpload} />
          </div>

          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default EditPage;