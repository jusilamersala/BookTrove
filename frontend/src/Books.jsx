import React, { useState } from 'react';
import './Books.css';
import { FaSearch, FaChevronDown, FaShoppingBasket } from 'react-icons/fa';

const Books = () => {
  const librat = [
    { id: 1, titulli: "Mjeshtri dhe Margarita", autori: "Mikhail Bulgakov", cmimi: "15.00€", kategoria: "Klasik", imazhi: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&q=80" },
    { id: 2, titulli: "Sapiens", autori: "Yuval Noah Harari", cmimi: "18.50€", kategoria: "Shkencë", imazhi: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80" },
    { id: 3, titulli: "Kronikë në gur", autori: "Ismail Kadare", cmimi: "12.00€", kategoria: "Historik", imazhi: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80" },
    { id: 4, titulli: "Arti i Luftës", autori: "Sun Tzu", cmimi: "10.00€", kategoria: "Filozofi", imazhi: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80" },
    { id: 5, titulli: "1984", autori: "George Orwell", cmimi: "14.00€", kategoria: "Dystopian", imazhi: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&q=80" },
  ];

  return (
    <div className="books-full-page">
      {/* Header i thjeshtë dhe elegant */}
      <div className="books-intro">
        <h1>Koleksioni i Librave</h1>
        <p>Eksploro botën përmes faqeve tona</p>
      </div>

      {/* Filterat Horizontalë */}
      <div className="horizontal-toolbar">
        <div className="search-minimal">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Kërko titullin ose autorin..." />
        </div>
        
        <div className="filter-dropdowns">
          <button className="filter-btn">Zhaneri <FaChevronDown size={12} /></button>
          <button className="filter-btn">Çmimi <FaChevronDown size={12} /></button>
          <button className="filter-btn">Renditja <FaChevronDown size={12} /></button>
        </div>
      </div>

      {/* Grid-i i Librave (Full Width) */}
      <div className="books-grid-full">
        {librat.map(liber => (
          <div key={liber.id} className="modern-book-card">
            <div className="book-image-area">
              <img src={liber.imazhi} alt={liber.titulli} />
              <div className="quick-add">
                <button><FaShoppingBasket /> Shto në Shportë</button>
              </div>
            </div>
            <div className="book-content">
              <span className="cat-label">{liber.kategoria}</span>
              <h3 className="book-name">{liber.titulli}</h3>
              <p className="book-writer">{liber.autori}</p>
              <div className="price-row">
                <span className="book-price">{liber.cmimi}</span>
                <button className="details-link">Shiko më shumë</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;