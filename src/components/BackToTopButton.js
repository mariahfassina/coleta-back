// src/components/BackToTopButton.js

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';

function BackToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    // Função que verifica a posição do scroll para mostrar/esconder o botão
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) { // O botão aparece depois de 300px de scroll
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Função que leva o utilizador de volta ao topo
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className="back-to-top-container">
            {isVisible && (
                <button onClick={scrollToTop} className="back-to-top-button" aria-label="Voltar ao topo">
                    <FontAwesomeIcon icon={faChevronUp} />
                </button>
            )}
        </div>
    );
}

export default BackToTopButton;
