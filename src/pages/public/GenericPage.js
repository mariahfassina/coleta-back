import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { apiPublic } from '../../config/api';

function GenericPage({ slug }) {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const { data } = await apiPublic.get(`/api/paginas/slug/${slug}`);
        if (data && data.titulo && data.conteudo) {
          setPageData(data);
        } else {
          setPageData(null);
        }
      } catch (error) {
        console.error(`Erro ao buscar a página ${slug}:`, error);
        setPageData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>;
  }

  if (!pageData) {
    return (
      <section className="info-section" style={{ textAlign: 'center' }}>
        <h2>Página não encontrada</h2>
        <p>O conteúdo que você está procurando não pôde ser carregado.</p>
      </section>
    );
  }

  return (
    <>
      <Helmet>
        <title>{pageData?.titulo || 'Página'} - Coleta Seletiva</title>
      </Helmet>
      <section className="info-section">
        <div className="container">
          <h2>{pageData?.titulo || 'Sem título'}</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: pageData?.conteudo || '<p>Conteúdo não disponível.</p>',
            }}
          />
          {pageData?.midiaUrl && (
            pageData.midiaUrl.includes('youtube.com') ? (
              <iframe
                className="youtube-video"
                src={pageData.midiaUrl}
                title={pageData.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <img
                src={`${process.env.REACT_APP_API_URL}${pageData.midiaUrl}`}
                alt={pageData.titulo}
              />
            )
          )}
        </div>
      </section>
    </>
  );
}

export default GenericPage;
