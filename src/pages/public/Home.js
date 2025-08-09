// src/pages/public/Home.js

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faHandPointer, faDownload } from '@fortawesome/free-solid-svg-icons';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { apiPublic } from '../../config/api';

function HomePage() {
  const [heroData, setHeroData] = useState(null);
  const [cronogramaData, setCronogramaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [heroRes, cronogramaRes] = await Promise.all([
          apiPublic.get('/api/paginas/slug/home-hero'),
          apiPublic.get('/api/paginas/slug/home-cronograma'),
        ]);
        setHeroData(heroRes.data);
        setCronogramaData(cronogramaRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados da página inicial:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <main style={{ padding: '40px', textAlign: 'center' }}><p>Carregando...</p></main>;
  }

  if (!heroData || !cronogramaData) {
    return (
      <main style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Oops! Não foi possível carregar a página.</h2>
        <p>Houve um problema de comunicação com o servidor. Por favor, tente novamente mais tarde.</p>
      </main>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Início - Coleta Seletiva de Assis Chateaubriand</title>
        <meta name="description" content="Página inicial com o cronograma da coleta e outras informações." />
      </Helmet>
      
      {heroData.midiaUrl && (
        <section id="hero">
          <img src={`${process.env.REACT_APP_API_URL}${heroData.midiaUrl}`} alt={heroData.titulo} />
        </section>
      )}

      {cronogramaData.midiaUrl && (
        <section id="cronograma" className="info-section">
          <div className="container">
            <h2>
              <FontAwesomeIcon icon={faCalendarDays} />
              {cronogramaData.titulo}
            </h2>
            <div className="cronograma-container" style={{textAlign: 'center'}}>
              <div dangerouslySetInnerHTML={{ __html: cronogramaData.conteudo }} />
              <div onClick={() => setOpen(true)} style={{cursor: 'pointer', maxWidth: '740px', margin: '20px auto'}}>
                <img src={`${process.env.REACT_APP_API_URL}${cronogramaData.midiaUrl}`} alt="Tabela com o cronograma semanal da coleta" />
              </div>
              <div className="zoom-hint">
                <FontAwesomeIcon icon={faHandPointer} />
                <span>Pince para ampliar</span>
              </div>
              <a href={`${process.env.REACT_APP_API_URL}${cronogramaData.midiaUrl}`} download="Cronograma_Coleta_Assis_Chateaubriand.png" className="download-button ripple">
                  <FontAwesomeIcon icon={faDownload} />
                  <span>Baixar Cronograma</span>
              </a>
            </div>
            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={[{ src: `${process.env.REACT_APP_API_URL}${cronogramaData.midiaUrl}`, alt: "Cronograma da Coleta Seletiva" }]}
            />
          </div>
        </section>
      )}
    </>
  );
}

export default HomePage;
