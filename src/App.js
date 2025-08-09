// src/App.js

import React from 'react';
// Não precisa mais de 'BrowserRouter as Router' nem 'AuthProvider' aqui
import { HelmetProvider } from 'react-helmet-async';
import AppRoutes from './routes/AppRoutes';

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import StickyInstaButton from './components/common/StickyInstaButton';
import UtilityBar from './components/common/UtilityBar';
import BackToTopButton from './components/BackToTopButton';

import './assets/css/style.css'; 

function App() {
  // Agora a estrutura está limpa e correta
  return (
    <HelmetProvider>
      {/* <Router> foi removido */}
      {/* <AuthProvider> foi removido */}
      
      <UtilityBar />
      <Header />
      <main>
        {/* AppRoutes irá renderizar as rotas corretas, pois o contexto do roteador já existe */}
        <AppRoutes />
      </main>
      <Footer />
      <StickyInstaButton />

    </HelmetProvider>
  );
}

export default App;
