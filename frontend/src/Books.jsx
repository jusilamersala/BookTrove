import React, { useState, useEffect } from 'react';
import './Books.css';
import axios from "axios";
import { FaSearch, FaChevronDown, FaShoppingBasket } from 'react-icons/fa';

const Books = () => {

  const [librat, setLibrat] = useState([]);

  // FETCH nga backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/items");
        setLibrat(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="books-full-page">

      <div className="books-intro">
        <h1>Koleksioni i Librave</h1>
        <p>Eksploro botën përmes faqeve tona</p>
      </div>

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

      <div className="books-grid-full">
        {librat.map(liber => (
          <div key={liber._id} className="modern-book-card">
            <div className="book-image-area">
              <img src={liber.imazhi} alt={liber.titulli} />
              <div className="quick-add">
                <button>
                  <FaShoppingBasket /> Shto në Shportë
                </button>
              </div>
            </div>

            <div className="book-content">
              <span className="cat-label">{liber.kategoria}</span>
              <h3 className="book-name">{liber.titulli}</h3>
              <p className="book-writer">{liber.autori}</p>
              <div className="price-row">
                <span className="book-price">{liber.cmimi}€</span>
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