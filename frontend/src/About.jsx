import React from 'react';
import './About.css';
import { FaBookOpen, FaUsers, FaGlobe } from 'react-icons/fa';

const About = () => {
  return (
    <div className="about-page-wrapper">
      {/* Hero Section me Overlay */}
      <section className="about-hero-modern">
        <div className="hero-overlay">
          <span className="subtitle">Zbuloni udhëtimin tonë</span>
          <h1>Historia e BookTrove</h1>
          <div className="hero-line"></div>
          <p>Më shumë se thjesht një librari, një shtëpi për mendjen.</p>
        </div>
      </section>

      {/* Seksioni i Statistikave */}
      <section className="stats-bar">
        <div className="container d-flex justify-content-around text-center">
          <div className="stat-item">
            <FaBookOpen className="stat-icon" />
            <h3>10k+</h3>
            <p>Tituj Librash</p>
          </div>
          <div className="stat-item">
            <FaUsers className="stat-icon" />
            <h3>5k+</h3>
            <p>Lexues Besnikë</p>
          </div>
          <div className="stat-item">
            <FaGlobe className="stat-icon" />
            <h3>24/7</h3>
            <p>Shërbim Online</p>
          </div>
        </div>
      </section>

      {/* Përmbajtja Kryesore */}
      <section className="about-content container py-5">
        <div className="row align-items-center mb-100">
          <div className="col-md-6 position-relative">
            <div className="image-border-decoration"></div>
            <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80" alt="Vizioni" className="img-fluid custom-img shadow-lg" />
          </div>
          <div className="col-md-6 ps-md-5 mt-4 mt-md-0">
            <h2 className="section-title">Vizioni Ynë</h2>
            <p className="lead-text">BookTrove lindi nga dëshira për të krijuar një hapësirë ku dija është e aksesueshme për të gjithë.</p>
            <p className="description">Ne besojmë se çdo libër ka fuqinë të ndryshojë një jetë, të hapi horizonte të reja dhe të ushqejë imagjinatën e çdo lexuesi, pavarësisht moshës.</p>
          </div>
        </div>

        <div className="row align-items-center flex-column-reverse flex-md-row">
          <div className="col-md-6 pe-md-5 mt-4 mt-md-0">
            <h2 className="section-title">Pasioni për Leximin</h2>
            <p className="description">Skuadra jonë përbëhet nga dashamirës të librit që kurojnë me kujdes çdo titull që gjendet në platformën tonë. Çdo libër që ne sugjerojmë kalon përmes një filtri pasioni dhe cilësie, duke siguruar që ju të gjeni vetëm margaritarët e letërsisë.</p>
            <blockquote className="about-quote">
              "Librat janë një magji unike e lëvizshme." — Stephen King
            </blockquote>
          </div>
          <div className="col-md-6 position-relative">
            <div className="image-border-decoration-right"></div>
            <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80" alt="Skuadra" className="img-fluid custom-img shadow-lg" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;