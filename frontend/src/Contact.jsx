import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Contact.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';

const Contact = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: ''
  });

  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);
  
//if comes from event page, prefill comment with interest message
  useEffect(() => {
    if (location.state && location.state.eventTitle) {
      setFormData(prev => ({
        ...prev,
        comment: `Përshëndetje! Jam i interesuar të marr pjesë në eventin: "${location.state.eventTitle}". Ju lutem më konfirmoni regjistrimin.`
      }));
      window.scrollTo(0, 0); 
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: 'info', msg: 'Duke u dërguar...' });

    try {
      const response = await axios.post('http://localhost:5000/api/contact/sendMessage', formData);
      if (response.status === 201) {
        setStatus({ type: 'success', msg: 'Mesazhi u dërgua me sukses! ✅' });
        setFormData({ name: '', email: '', comment: '' });
      }
    } catch (error) {
      console.error("Gabim gjatë dërgimit:", error);
      setStatus({ type: 'danger', msg: 'Dërgimi dështoi. Provoni përsëri!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-wrapper">
          <div className="contact-info">
            <h2>Na Kontaktoni</h2>
            <p>Keni një pyetje apo dëshironi të regjistroheni në eventet tona?</p>
            <div className="info-item">
              <FaPhone className="icon" />
              <div><h5>Telefon</h5><p>+355 69 00 00 000</p></div>
            </div>
            <div className="info-item">
              <FaEnvelope className="icon" />
              <div><h5>Email</h5><p>info@booktrove.com</p></div>
            </div>
            <div className="info-item">
              <FaMapMarkerAlt className="icon" />
              <div><h5>Adresa</h5><p>Rr. e Librit, Nr. 10, Tiranë</p></div>
            </div>
          </div>

          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Emri i plotë</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Emri juaj..." required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@shembull.com" required />
              </div>
              <div className="form-group">
                <label>Mesazhi</label>
                <textarea name="comment" value={formData.comment} onChange={handleChange} rows="5" placeholder="Si mund t'ju ndihmojmë?" required></textarea>
              </div>

              {status.msg && <div className={`status-message text-${status.type} mb-3 fw-bold`}>{status.msg}</div>}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Duke u dërguar...' : 'Dërgo Mesazhin'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;