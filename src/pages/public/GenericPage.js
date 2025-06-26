// src/pages/public/GenericPage.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
// 1. Importa o 'api' que tem a configuração do Axios
import api from '../../config/api';

function GenericPage({ slug }) { // Ele recebe o 'slug' da rota
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0); // Rola a página para o topo
    
    const fetchPageData = async () => {
      setLoading(true);
      try {
        // 2. Faz a chamada para a API da Mariáh usando o slug
        const response = await api.get(`/api/paginas/${slug}`);
        setPageData(response.data); // Salva os dados recebidos no estado
      } catch (error) {
        console.error(`Erro ao buscar dados da página ${slug}:`, error);
        setPageData(null); // Limpa os dados em caso de erro
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, [slug]); // Roda de novo se o slug mudar

  if (loading) {
    return <main className="container" style={{padding: '40px 15px', textAlign: 'center'}}><p>Carregando conteúdo...</p></main>;
  }

  if (!pageData) {
    return <main className="container" style={{padding: '40px 15px', textAlign: 'center'}}><p>Não foi possível carregar o conteúdo desta página.</p></main>;
  }

  // 3. Renderiza o conteúdo que veio da API
  return (
    <>
      <Helmet>
        <title>{pageData.titulo} - Coleta Seletiva</title>
      </Helmet>
      <main>
        <section className="info-section">
          <div className="container">
            {/* Usa o título vindo da API */}
            <h2>{pageData.titulo}</h2> 
            
            {/* Usa o conteúdo HTML vindo da API */}
            <div dangerouslySetInnerHTML={{ __html: pageData.conteudo }} />
            
            {/* Renderiza a mídia (imagem ou vídeo) se a URL existir */}
            {pageData.midiaUrl && (
              pageData.midiaUrl.includes('youtube.com') ? (
                <iframe
                  className="youtube-video"
                  src={pageData.midiaUrl}
                  title={pageData.titulo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <img src={`${process.env.REACT_APP_API_URL}${pageData.midiaUrl}`} alt={pageData.titulo} />
              )
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default GenericPage;