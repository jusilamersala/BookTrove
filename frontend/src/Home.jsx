import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

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

      {/* Rreshti i Kategorive - TASHMË NË NJË RRESHT */}
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

      {/* Librat Featured */}
      <section className="featured-books">
        <h2 className="section-title">Librat më të Dashur</h2>
        <div className="book-grid">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="book-card">
              <div className="book-placeholder">BookTrove</div>
              <div className="book-info">
                <h3>Titulli i Librit</h3>
                <p>Autori</p>
                <span className="price">12.99€</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;