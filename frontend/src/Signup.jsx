import React from 'react';
import './AuthStyle.css';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="auth-page">
      <div className="auth-small-card">
        <h2>Krijo Llogari</h2>
        <p>Bëhu pjesë e komunitetit tonë</p>
        
        <form className="auth-small-form">
          <div className="input-box">
            <FaUser className="icon" />
            <input type="text" placeholder="Emri i plotë" required />
          </div>
          <div className="input-box">
            <FaEnvelope className="icon" />
            <input type="email" placeholder="Email" required />
          </div>
          <div className="input-box">
            <FaLock className="icon" />
            <input type="password" placeholder="Fjalëkalimi" required />
          </div>
          <button type="submit" className="auth-btn signup-btn">
            Regjistrohu <FaUserPlus />
          </button>
        </form>
        <p className="switch-auth">
          Keni një llogari? <Link to="/login">Hyni këtu</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;