import React from 'react';
import './Genres.css';

const Genres = () => {
  const kategorite = ["Romancë", "Mister", "Fantazi", "Histori", "Shkencë"];

  return (
    <div className="zhanerat-container">
      <h2>Kategoritë e Librave</h2>
      <div className="zhanerat-list">
        {kategorite.map((zhaner, index) => (
          <div key={index} className="zhaner-item">
            <span>{zhaner}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Genres;