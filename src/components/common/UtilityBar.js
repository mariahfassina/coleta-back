// src/components/common/UtilityBar.js
//import {React} from 'react';
import AccessibilityControls from './AccessibilityControls'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

function UtilityBar() {
  // Nenhuma propriedade (props) aqui. Apenas renderiza os componentes.
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
        <AccessibilityControls />
      </div>
    </div>
  );
}

export default UtilityBar;
