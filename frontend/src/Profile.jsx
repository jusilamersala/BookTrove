import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { FaUserCircle, FaBoxOpen, FaSignOutAlt, FaEnvelope, FaUserShield } from 'react-icons/fa'; // Shto react-icons
import './Profile.css';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders', {
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Dështoi ngarkimi i porosive');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card unauthorized">
          <p>Ju duhet të identifikoheni për të parë profilin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-grid">
        {/* Karta e Informacionit të Përdoruesit */}
        <div className="profile-card info-card">
          <div className="user-header">
            <FaUserCircle className="profile-icon" />
            <h2>Mirë se vjen, {user.username}!</h2>
          </div>
          <div className="user-details">
            <p><FaEnvelope /> <span>Email:</span> {user.email}</p>
            <p><FaUserShield /> <span>Roli:</span> <span className={`role-badge ${user.role}`}>{user.role}</span></p>
          </div>
          <button className="logout-btn" onClick={logout}>
            <FaSignOutAlt /> Dil nga llogaria
          </button>
        </div>

        {/* Seksioni i Porosive */}
        <div className="orders-section">
          <h3><FaBoxOpen /> Porositë e tua</h3>
          
          {loading && <div className="loader">Po ngarkohen...</div>}
          {error && <p className="error-text">{error}</p>}
          
          <div className="orders-list">
            {!loading && orders.length === 0 && (
              <div className="no-orders">Nuk keni bërë asnjë porosi ende.</div>
            )}
            
            {orders.map((o) => (
              <div key={o._id} className="order-item">
                <div className="order-info">
                  <span className="order-date">{new Date(o.createdAt).toLocaleDateString()}</span>
                  <span className="order-total">{o.total}€</span>
                </div>
                <div className="order-books">
                  <small>Librat: {o.items.join(', ')}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;