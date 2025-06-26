// src/pages/public/Home.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faHandPointer } from '@fortawesome/free-solid-svg-icons';
import api from '../../config/api';

function HomePage() {
  const [heroData, setHeroData] = useState(null);
  const [cronogramaData, setCronogramaData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [heroRes, cronogramaRes] = await Promise.all([
          api.get('/api/paginas/home-hero'),
          api.get('/api/paginas/home-cronograma'),
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
    return <main className="container" style={{padding: '40px 15px', textAlign: 'center'}}><p>Carregando...</p></main>;
  }

  return (
    <>
      <Helmet>
        <title>Início - Coleta Seletiva de Assis Chateaubriand</title>
        <meta name="description" content="Página inicial com o cronograma da coleta e outras informações." />
      </Helmet>
      <main>
        {heroData && (
          <section id="hero">
            <img src={`${process.env.REACT_APP_API_URL}${heroData.midiaUrl}`} alt={heroData.titulo} />
          </section>
        )}

        {cronogramaData && (
          <section id="cronograma" className="info-section">
            <div className="container">
              <h2>
                <FontAwesomeIcon icon={faCalendarDays} />
                {cronogramaData.titulo}
              </h2>
              <p style={{textAlign: 'center', maxWidth: '600px'}}>{cronogramaData.conteudo}</p>
              <div className="cronograma-container">
                <img src={`${process.env.REACT_APP_API_URL}${cronogramaData.midiaUrl}`} alt="Tabela com o cronograma semanal da coleta" />
                <div className="zoom-hint">
                  <FontAwesomeIcon icon={faHandPointer} />
                  <span>Pince para ampliar</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default HomePage;