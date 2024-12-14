import React from 'react';
import './popup.css'; // Include the styles in a separate CSS file

export default function Popup({ mes, onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h1>Alert</h1>
        <h2>{mes}</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
