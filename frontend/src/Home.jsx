import React from 'react';
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
            <button className="btn-dark">Shfleto Librat</button>
            <button className="btn-light">Eventet e Ardhshme</button>
          </div>
        </div>
      </section>

      {/* Rreshti 2: Kategoritë në rresht horizontal */}
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
              <button className="details-btn">Detaje</button>
            </div>
          ))}
        </div>
        <button className="view-all-books-btn">Shiko të Gjithë Librat</button>
      </section>
    </div>
  );
};

export default Home;