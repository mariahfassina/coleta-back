// src/components/Header.js

import React, { useState } from 'react';
// 1. Importe o useNavigate para navegação e o Link para o link especial
import { NavLink, useNavigate } from 'react-router-dom';
import logoPrefeitura from '../assets/imagens/logo-prefeitura.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faHome, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    
    // 2. Inicialize a função de navegação
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (isMenuOpen) {
            setIsSubmenuOpen(false);
        }
    };

    const toggleSubmenu = (e) => {
        e.preventDefault();
        setIsSubmenuOpen(!isSubmenuOpen);
    };

    // 3. Crie a função para rolar até o cronograma
    const handleCronogramaClick = (e) => {
        e.preventDefault(); // Previne o comportamento padrão do link

        // Fecha o menu mobile, se estiver aberto
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }

        // Primeiro, navega para a página inicial
        navigate('/');

        // Depois, espera um instante para a página carregar e então rola a tela
        setTimeout(() => {
            const section = document.getElementById('cronograma');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100); // Um pequeno atraso garante que a seção exista antes de rolar
    };

    return (
        <header className={`main-header ${isMenuOpen ? 'menu-is-active' : ''}`}>
            <div className="container">
                <div className="logo-area">
                    <NavLink to="/" className="logo-link">
                        <img src={logoPrefeitura} alt="Logo oficial da Prefeitura Municipal de Assis Chateaubriand" className="logo" />
                    </NavLink>
                </div>

                <button 
                    className={`menu-toggle ${isMenuOpen ? 'is-active' : ''}`} 
                    onClick={toggleMenu} 
                    aria-label="Abrir menu" 
                    aria-expanded={isMenuOpen}
                    aria-controls="main-nav"
                >
                    <FontAwesomeIcon icon={faBars} className="icon-open" />
                    <FontAwesomeIcon icon={faTimes} className="icon-close" />
                </button>

                <nav className={`main-nav ${isMenuOpen ? 'is-active' : ''}`} id="main-nav">
                    <ul>
                        <li><NavLink to="/" aria-label="Página Inicial" end onClick={() => setIsMenuOpen(false)}><FontAwesomeIcon icon={faHome} /></NavLink></li>
                        
                        <li className={`has-submenu ${isSubmenuOpen ? 'submenu-is-active' : ''}`}>
                            <a href="#" onClick={toggleSubmenu}>
                                Como separar
                                <FontAwesomeIcon icon={isSubmenuOpen ? faChevronUp : faChevronDown} className="icon-arrow" />
                            </a>
                            <ul className={`submenu ${isSubmenuOpen ? 'submenu-active' : ''}`}>
                                <li><NavLink to="/como-separar/como-fazer" onClick={() => setIsMenuOpen(false)}>Como fazer a separação?</NavLink></li>
                                <li><NavLink to="/como-separar/residuos" onClick={() => setIsMenuOpen(false)}>Quais são os resíduos recicláveis?</NavLink></li>
                                <li><NavLink to="/como-separar/porque-separar" onClick={() => setIsMenuOpen(false)}>Por que separar os resíduos?</NavLink></li>
                            </ul>
                        </li>
                        
                        {/* 4. O link do cronograma agora usa a nova função */}
                        <li><a href="/#cronograma" onClick={handleCronogramaClick}>Cronograma</a></li>
                        
                        <li><a href="docs/cartilha-deco.pdf" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>Cartilha</a></li>
                        <li><NavLink to="/acamar" onClick={() => setIsMenuOpen(false)}>Quem somos</NavLink></li>
                        <li><NavLink to="/total-coletado" onClick={() => setIsMenuOpen(false)}>Total coletado</NavLink></li>
                        <li className="menu-contato-destaque">
                            <NavLink to="/contato" onClick={() => setIsMenuOpen(false)}>Contato</NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
