// src/components/AccessibilityControls.js

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUniversalAccess } from '@fortawesome/free-solid-svg-icons';

function AccessibilityControls({ onIncreaseFontSize, onDecreaseFontSize }) {
  return (
    <div className="accessibility-controls">
      <button id="decrease-font" aria-label="Diminuir fonte" onClick={onDecreaseFontSize}>
        A-
      </button>
      <button id="increase-font" aria-label="Aumentar fonte" onClick={onIncreaseFontSize}>
        A+
      </button>
      <a href="#accessibility-info" aria-label="Acessibilidade">
        <FontAwesomeIcon icon={faUniversalAccess} />
      </a>
    </div>
  );
}

export default AccessibilityControls;
