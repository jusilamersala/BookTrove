import React from 'react';
import { Link } from 'react-router-dom'; // Importi për navigimin
import './Home.css';

const Home = () => {
  return (
    <div className="container">
      {/* Rreshti 1: Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>"Çdo libër, një botë për të zbuluar."</h1>
          <p>Eksploro histori që jetojnë përtej faqeve</p>
          <div className="hero-btns">
            {/* Kthehen në Link për navigim */}
            <Link to="/librat" className="btn-dark">Shfleto Librat</Link>
            <Link to="/eventet" className="btn-light">Eventet e Ardhshme</Link>
          </div>
        </div>
      </section>

      {/* Rreshti 2: Kategoritë - Struktura jote origjinale e paprekur */}
      <nav className="categories-row">
        <h3>Kategoritë:</h3>
        <div className="cat-btns">
          <button>Letërsi</button>
          <button>Historik</button>
          <button>Fantazi</button>
          <button>Shkencë</button>
          <button>Fëmijë</button>
          <button className="view-all-cat">Shiko të Gjitha</button>
        </div>
      </nav>

      {/* Rreshti 3: Librat */}
      <section className="books-section-standalone">
        <h2 className="section-title">Librat më të Dashur</h2>
        <div className="book-grid">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="book-card">
              <div className="book-placeholder">X</div>
              <h3>Titulli i Librit</h3>
              <p className="author">Autori</p>
              <p className="price">12.99€</p>
              {/* Kthehet në Link */}
              <Link to="/librat" className="details-btn">Detaje</Link>
            </div>
          ))}
        </div>
        {/* Kthehet në Link */}
        <Link to="/librat" className="view-all-books-btn">Shiko të Gjithë Librat</Link>
      </section>
    </div>
  );
};

export default Home;