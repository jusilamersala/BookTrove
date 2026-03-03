import React, { useState, useContext } from 'react';
import './AuthStyle.css';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Signup = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate password length
    if (password.length < 6) {
      setError('Fjalëkalimi duhet të jetë të paku 6 karaktere!');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password: password,
          role: 'user',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Gabim gjatë regjistrimit');
        console.error('Signup error response:', data);
        return;
      }

      // automatically log in
      login(data);
      navigate('/profile');
    } catch (err) {
      setError('Ndodhi një gabim në server. Provoni përsëri më vonë.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-small-card">
        <h2>Krijo Llogari</h2>
        <p>Bëhu pjesë e komunitetit tonë</p>
        
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        
        <form className="auth-small-form" onSubmit={handleSubmit}>
          <div className="input-box">
            <FaUser className="icon" />
            <input 
              type="text" 
              placeholder="Emri i plotë" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>
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
          <button type="submit" className="auth-btn signup-btn" disabled={loading}>
            {loading ? 'Po regjistrohesh...' : 'Regjistrohu'} <FaUserPlus />
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