// src/components/common/Header.js
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// ✅ CORREÇÃO AQUI: o caminho para as imagens mudou
import logoPrefeitura from '../../assets/imagens/logo-prefeitura.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faHome, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
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

    const handleCronogramaClick = (e) => {
        e.preventDefault();
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
        navigate('/');
        setTimeout(() => {
            const section = document.getElementById('cronograma');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    const closeAllMenus = () => {
        setIsMenuOpen(false);
        setIsSubmenuOpen(false);
    };

    return (
        <header className={`main-header ${isMenuOpen ? 'menu-is-active' : ''}`}>
            <div className="container">
                <div className="logo-area">
                    <NavLink to="/" className="logo-link" onClick={closeAllMenus}>
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
                    <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
                </button>

                <nav className={`main-nav ${isMenuOpen ? 'is-active' : ''}`} id="main-nav">
                    <ul>
                        <li><NavLink to="/" aria-label="Página Inicial" end onClick={closeAllMenus}><FontAwesomeIcon icon={faHome} /></NavLink></li>
                        
                        <li className={`has-submenu ${isSubmenuOpen ? 'submenu-is-active' : ''}`}>
                            <a href="/#" onClick={toggleSubmenu}>
                                Como separar
                                <FontAwesomeIcon icon={isSubmenuOpen ? faChevronUp : faChevronDown} className="icon-arrow" />
                            </a>
                            <ul className={`submenu ${isSubmenuOpen ? 'submenu-active' : ''}`}>
                                <li><NavLink to="/como-separar/como-fazer" onClick={closeAllMenus}>Como fazer a separação?</NavLink></li>
                                <li><NavLink to="/como-separar/residuos" onClick={closeAllMenus}>Quais são os resíduos recicláveis?</NavLink></li>
                                <li><NavLink to="/como-separar/porque-separar" onClick={closeAllMenus}>Por que separar os resíduos?</NavLink></li>
                            </ul>
                        </li>
                        
                        <li><a href="/#cronograma" onClick={handleCronogramaClick}>Cronograma</a></li>
                        <li><a href="/docs/cartilha-deco.pdf" target="_blank" rel="noopener noreferrer" onClick={closeAllMenus}>Cartilha</a></li>
                        <li><NavLink to="/quemsomos" onClick={closeAllMenus}>Quem somos</NavLink></li>
                        <li><NavLink to="/total-coletado" onClick={closeAllMenus}>Total coletado</NavLink></li>
                        <li className="menu-contato-destaque">
                            <NavLink to="/contato" onClick={closeAllMenus}>Contato</NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;