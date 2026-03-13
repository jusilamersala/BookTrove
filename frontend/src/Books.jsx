import React, { useState, useEffect } from 'react';
import './Books.css';
import axios from "axios";
import { FaShoppingBasket } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const Books = () => {
  const location = useLocation();
  const [librat, setLibrat] = useState([]);
  const [filteredLibrat, setFilteredLibrat] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(location.state?.selectedGenre || '');

  // Merr librat nga API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/items");
        setLibrat(response.data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së të dhënave:", error);
      }
    };
    fetchItems();
  }, []);

  // Përditëso zhanerin kur vjen nga Home/Navbar
  useEffect(() => {
    if (location.state?.selectedGenre) {
      setSelectedGenre(location.state.selectedGenre);
    } else {
      setSelectedGenre('');
    }
  }, [location]);

  // Logjika e filtrimit (Kërkim + Zhaner)
  useEffect(() => {
    const filtered = librat.filter(liber => {
      const matchesSearch = (
        liber.titulli.toLowerCase().includes(searchTerm.toLowerCase()) ||
        liber.autori.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesGenre = selectedGenre === '' || liber.kategoria === selectedGenre;
      return matchesSearch && matchesGenre;
    });
    setFilteredLibrat(filtered);
  }, [librat, searchTerm, selectedGenre]);

  return (
    <div className="books-full-page">
      <div className="books-intro">
        <h1>Koleksioni i Librave</h1>
        {selectedGenre && (
          <p className="active-filter-text">
            Kategoria: <span>{selectedGenre}</span>
          </p>
        )}
      </div>

      <div className="horizontal-toolbar container">
        <div className="search-minimal">
          <input 
            type="text" 
            placeholder="Kërko titullin ose autorin e librit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {selectedGenre && (
          <button className="clear-filter-btn" onClick={() => setSelectedGenre('')}>
            Hiq filtrin (X)
          </button>
        )}
      </div>

      <div className="books-grid-full container">
        {filteredLibrat.length > 0 ? (
          filteredLibrat.map(liber => (
            <div key={liber._id} className="modern-book-card">
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
                  <span className="book-price">{liber.cmimi}€</span>
                  <button className="details-link">Detaje</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <h3>Nuk u gjend asnjë libër</h3>
            <p>Provo një kërkim tjetër ose hiq filtrat.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;