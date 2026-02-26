import React from 'react';
import './Contact.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-wrapper">
          {/* Informacioni i Kontaktit */}
          <div className="contact-info">
            <h2>Na Kontaktoni</h2>
            <p>Keni një pyetje apo sugjerim? Ne jemi këtu për ju.</p>
            
            <div className="info-item">
              <FaPhone className="icon" />
              <div>
                <h5>Telefon</h5>
                <p>+355 69 00 00 000</p>
              </div>
            </div>

            <div className="info-item">
              <FaEnvelope className="icon" />
              <div>
                <h5>Email</h5>
                <p>info@booktrove.com</p>
              </div>
            </div>

            <div className="info-item">
              <FaMapMarkerAlt className="icon" />
              <div>
                <h5>Adresa</h5>
                <p>Rr. e Librit, Nr. 10, Tiranë</p>
              </div>
            </div>
          </div>

          {/* Forma e Kontaktit */}
          <div className="contact-form-container">
            <form className="contact-form">
              <div className="form-group">
                <label>Emri i plotë</label>
                <input type="text" placeholder="Shkruani emrin tuaj..." />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="email@shembull.com" />
              </div>
              <div className="form-group">
                <label>Mesazhi</label>
                <textarea rows="5" placeholder="Si mund t'ju ndihmojmë?"></textarea>
              </div>
              <button type="submit" className="submit-btn">Dërgo Mesazhin</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;