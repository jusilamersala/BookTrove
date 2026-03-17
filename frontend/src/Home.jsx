import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingBasket } from 'react-icons/fa';
import { useCart } from './CartContext'; // Importojmë shportën
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Marrja e librave nga backend
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/items");
        // Marrim vetëm 4 librat e parë për Home Page
        setFeaturedBooks(response.data.slice(0, 4));
      } catch (error) {
        console.error("Gabim gjatë marrjes së librave:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleCategoryClick = (genre) => {
    navigate('/librat', { state: { selectedGenre: genre } });
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>"Çdo libër, një botë për të zbuluar."</h1>
          <p>Eksploro histori që jetojnë përtej faqeve</p>
          <div className="hero-btns">
            <Link to="/librat" className="btn-dark">Shfleto Librat</Link>
            <Link to="/eventet" className="btn-light">Eventet</Link>
          </div>
        </div>
      </section>

      {/* Rreshti i Kategorive */}
      <nav className="categories-section">
        <div className="categories-flex-wrapper">
          <h3 className="categories-label">Kategoritë:</h3>
          <div className="categories-buttons-group">
            <button className="btn-cat" onClick={() => handleCategoryClick('Romancë')}>Romancë</button>
            <button className="btn-cat" onClick={() => handleCategoryClick('Mister')}>Mister</button>
            <button className="btn-cat" onClick={() => handleCategoryClick('Fantazi')}>Fantazi</button>
            <button className="btn-cat" onClick={() => handleCategoryClick('Histori')}>Histori</button>
            <button className="btn-cat" onClick={() => handleCategoryClick('Shkencë')}>Shkencë</button>
          </div>
          <Link to="/zhanerat" className="view-all-link">Shiko të Gjitha</Link>
        </div>
      </nav>

      {/* Librat Featured - Tani DINAMIKE */}
      <section className="featured-books container">
        <h2 className="section-title">Librat më të Dashur</h2>
        
        {loading ? (
          <div className="loader">Po ngarkohen librat...</div>
        ) : (
          <div className="book-grid">
            {featuredBooks.map((liber) => (
              <div key={liber._id} className="modern-book-card">
                <div className="book-image-area">
                  <img src={liber.imazhi} alt={liber.titulli} />
                  <div className="quick-add">
                    <button onClick={() => addToCart(liber)}>
                      <FaShoppingBasket /> Shto në Shportë
                    </button>
                  </div>
                </div>
                <div className="book-content">
                  <span className="cat-label">{liber.kategoria}</span>
                  <h3 className="book-name">{liber.titulli}</h3>
                  <p className="book-writer">{liber.autori}</p>
                  <div className="price-row">
                    <span className="book-price">{liber.cmimi.toFixed(2)}€</span>
                    <button 
                      className="details-link" 
                      onClick={() => navigate(`/librat/${liber._id}`)}
                    >
                      Detaje
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
       <div className="view-more-container">
        <Link to="/librat" className="btn-explore-more">
    <span>Eksploro të gjithë koleksionin</span>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  </Link>
</div>
      </section>
    </div>
  );
};

export default Home;