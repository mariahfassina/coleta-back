// src/components/common/UtilityBar.js
import React from 'react';
// ✅ CORREÇÃO: Confirme que o AccessibilityControls está sendo importado do mesmo diretório
import AccessibilityControls from './AccessibilityControls'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

function UtilityBar({ onIncreaseFontSize, onDecreaseFontSize }) {
  return (
    <div className="utility-bar">
      <div className="container">
        <div className="social-media">
          <a
            href="https://www.instagram.com/uvr_assis/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram da UVR Assis"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </div>
        <AccessibilityControls
          onIncreaseFontSize={onIncreaseFontSize}
          onDecreaseFontSize={onDecreaseFontSize}
        />
      </div>
    </div>
  );
}

export default UtilityBar;