// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Importa o CSS global uma única vez aqui
import './assets/css/style.css'; 

// Importa os componentes de layout do novo local
import UtilityBar from './components/common/UtilityBar';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import StickyInstaButton from './components/common/StickyInstaButton'; // Componente do botão flutuante

// Importa o gerenciador central de rotas
import AppRoutes from './routes/AppRoutes';
// Importa o provedor de contexto de autenticação
import { AuthProvider } from './contexts/AuthContext';


function App() {
  // O estado e as funções de acessibilidade agora vivem aqui, no componente principal
  const [fontSize, setFontSize] = useState(1);
  const handleIncreaseFontSize = () => setFontSize(prev => Math.min(prev + 0.1, 1.5));
  const handleDecreaseFontSize = () => setFontSize(prev => Math.max(prev - 0.1, 0.8));

  return (
    // HelmetProvider é necessário para o gerenciamento de <head> nas páginas
    <HelmetProvider>
      {/* AuthProvider envolve toda a aplicação para que qualquer componente saiba se o usuário está logado */}
      <AuthProvider>
        {/* Router é o que habilita a navegação entre páginas */}
        <Router>
          {/* A div principal aplica o estilo de tamanho de fonte para acessibilidade */}
          <div className="App" style={{ fontSize: `${fontSize}em` }}>
            <UtilityBar 
              onIncreaseFontSize={handleIncreaseFontSize}
              onDecreaseFontSize={handleDecreaseFontSize}
            />
            <Header />
            
            {/* O AppRoutes agora é responsável por decidir qual página renderizar */}
            <AppRoutes /> 

            <Footer />
            
            {/* O botão flutuante fica fora do main para ter posicionamento fixo */}
            <StickyInstaButton />
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;