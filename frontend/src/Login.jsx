import React, { useState, useContext, useEffect } from 'react';
import './AuthStyle.css';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Gabim gjatë kyçjes');
        return;
      }

      // Store user data in localStorage
      login(data);
      
      // Redirect to home page
      navigate('/');
    } catch (err) {
      setError('Ndodhi një gabim në server. Provoni përsëri më vonë.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-small-card">
        <h2>Mirë se erdhët!</h2>
        <p>Identifikohuni në llogarinë tuaj</p>
        
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        
        <form className="auth-small-form" onSubmit={handleSubmit}>
          <div className="input-box">
            <FaEnvelope className="icon" />
            <input 
              type="email" 
              placeholder="Email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="input-box">
            <FaLock className="icon" />
            <input 
              type="password" 
              placeholder="Fjalëkalimi" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="auth-options">
            <label><input type="checkbox" disabled={loading} /> Më mbaj mend</label>
            <span className="forgot">Harruat fjalëkalimin?</span>
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Po hyj...' : 'Hyr'} <FaSignInAlt />
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