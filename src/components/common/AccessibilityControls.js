import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUniversalAccess } from '@fortawesome/free-solid-svg-icons';

function AccessibilityControls() {
  const [fontSize, setFontSize] = useState(100); // base = 100%

  useEffect(() => {
    document.body.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  const increaseFont = () => {
    if (fontSize < 200) {
      setFontSize(prev => prev + 10);
    }
  };

  const decreaseFont = () => {
    if (fontSize > 50) {
      setFontSize(prev => prev - 10);
    }
  };

  return (
    <div className="accessibility-controls">
      <button onClick={decreaseFont} aria-label="Diminuir fonte">A-</button>
      <button onClick={increaseFont} aria-label="Aumentar fonte">A+</button>
      <a href="#accessibility-info" aria-label="Acessibilidade">
        <FontAwesomeIcon icon={faUniversalAccess} />
      </a>
    </div>
  );
}

export default AccessibilityControls;
