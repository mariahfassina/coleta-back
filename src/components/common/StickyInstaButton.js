// src/components/common/StickyInstaButton.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

function StickyInstaButton() {
  return (
    <a 
      href="https://www.instagram.com/uvr_assis/" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="sticky-insta"
      aria-label="Acessar o Instagram da UVR Assis"
    >
      <FontAwesomeIcon icon={faInstagram} /> 
      <span>Insta UVR</span>
    </a>
  );
}

export default StickyInstaButton;