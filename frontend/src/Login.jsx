import React from 'react';
import './AuthStyle.css';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="auth-page">
      <div className="auth-small-card">
        <h2>Mirë se erdhët!</h2>
        <p>Identifikohuni në llogarinë tuaj</p>
        
        <form className="auth-small-form">
          <div className="input-box">
            <FaEnvelope className="icon" />
            <input type="email" placeholder="Email" required />
          </div>
          <div className="input-box">
            <FaLock className="icon" />
            <input type="password" placeholder="Fjalëkalimi" required />
          </div>
          <div className="auth-options">
            <label><input type="checkbox" /> Më mbaj mend</label>
            <span className="forgot">Harruat fjalëkalimin?</span>
          </div>
          <button type="submit" className="auth-btn">
            Hyr <FaSignInAlt />
          </button>
        </form>
        <p className="switch-auth">
          Nuk keni llogari? <Link to="/signup">Regjistrohuni</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;