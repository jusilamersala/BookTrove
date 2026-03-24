import React from "react";
import { Link } from "react-router-dom"; 
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <Link to="/" className="footer-logo-link">
            <h3 className="footer-logo">BookTrove</h3>
          </Link>
          <p className="footer-description">
            Qyteti i historive që jetojnë. Na ndiqni për librat e rinj, 
            rekomandime dhe evente letrare.
          </p>
          <div className="footer-socials">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-box">FB</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-box">IG</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-box">X</a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Eksploro</h4>
          <ul>
            <li><Link to="/rreth-nesh">Rreth Nesh</Link></li>
            <li><Link to="/eventet">Eventet</Link></li>
            <li><Link to="/blog">Blogu</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Shërbimet</h4>
          <ul>
            <li><Link to="/librat">Shitje Librash</Link></li>
            <li><Link to="/eventet">Takime me Autorë</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Na Vizitoni</h4>
          <p>📍 Tirana, Albania</p>
          <p>📞 +355 xx xxx xxxx</p>
          <p>✉️ info@booktrove.com</p>
          <p className="work-hours">Hën – Sht: 09:00 – 20:00</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 BookTrove | <Link to="/privacy">Privacy Policy</Link> | Site Credit</p>
      </div>
    </footer>
  );
};

export default Footer;