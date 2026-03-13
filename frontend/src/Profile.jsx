import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { FaUserCircle, FaBoxOpen, FaSignOutAlt, FaEnvelope, FaUserShield } from 'react-icons/fa'; // Shto react-icons
import './Profile.css';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attendanceError, setAttendanceError] = useState('');
  const [attendanceSuccess, setAttendanceSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersRes, scheduleRes] = await Promise.all([
          fetch('http://localhost:5000/api/orders', { credentials: 'include' }),
          fetch('http://localhost:5000/api/users/me/schedule', { credentials: 'include' })
        ]);

        if (!ordersRes.ok) throw new Error('Dështoi ngarkimi i porosive');
        const ordersData = await ordersRes.json();
        setOrders(ordersData);

        if (scheduleRes.ok) {
          const scheduleData = await scheduleRes.json();
          setSchedule(scheduleData.schedule || []);
          setAttendance(scheduleData.attendance || []);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  const getTodayAttendance = () => {
    const today = new Date();
    const dateKey = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    return attendance.find(a => new Date(a.date).getTime() === dateKey);
  };

  const handleAttendance = async (type) => {
    setAttendanceError('');
    setAttendanceSuccess('');
    try {
      const res = await fetch(`http://localhost:5000/api/users/me/${type}`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gabim');

      setAttendance(data.attendance || []);
      setAttendanceSuccess(data.message || 'U regjistrua me sukses');
    } catch (err) {
      setAttendanceError(err.message);
    }
  };

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

        {user.role === 'employee' && (
          <div className="attendance-section">
            <h3>Oraret dhe Pjesëmarrja</h3>

            {attendanceError && <p className="error-text">{attendanceError}</p>}
            {attendanceSuccess && <p className="success-text">{attendanceSuccess}</p>}

            <div className="attendance-card">
              <div className="attendance-row">
                <strong>Orari i sotëm:</strong>
                <span>
                  {(() => {
                    const today = new Date();
                    const todayKey = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
                    const todayShift = schedule
                      .map(s => ({ ...s, date: new Date(s.date) }))
                      .find(s => s.date.getTime() === todayKey);

                    if (!todayShift) return 'Nuk ka orar të caktuar për sot.';
                    return `${todayShift.startTime} - ${todayShift.endTime}`;
                  })()}
                </span>
              </div>

              <div className="attendance-row">
                <strong>Check-in / Check-out:</strong>
                <span>
                  {(() => {
                    const todayAttendance = getTodayAttendance();
                    if (!todayAttendance) return 'Nuk jeni futur në punë për sot.';
                    const ci = todayAttendance.checkIn ? new Date(todayAttendance.checkIn).toLocaleTimeString() : '-';
                    const co = todayAttendance.checkOut ? new Date(todayAttendance.checkOut).toLocaleTimeString() : '-';
                    return `In: ${ci} | Out: ${co}`;
                  })()}
                </span>
              </div>

              <div className="attendance-actions">
                {(() => {
                  const todayAttendance = getTodayAttendance();
                  if (!todayAttendance || !todayAttendance.checkIn) {
                    return (
                      <button className="attendance-btn" onClick={() => handleAttendance('checkin')}>
                        Check In
                      </button>
                    );
                  }

                  if (todayAttendance.checkIn && !todayAttendance.checkOut) {
                    return (
                      <button className="attendance-btn" onClick={() => handleAttendance('checkout')}>
                        Check Out
                      </button>
                    );
                  }

                  return <span>Jeni përfunduar për sot. 😊</span>;
                })()}
              </div>

              <div className="attendance-upcoming">
                <h4>Oraret e ardhshme</h4>
                {schedule.length === 0 ? (
                  <p>Nuk ka orare të caktuara.</p>
                ) : (
                  <ul>
                    {schedule
                      .map(s => ({ ...s, date: new Date(s.date) }))
                      .sort((a, b) => a.date - b.date)
                      .slice(0, 7)
                      .map(s => (
                        <li key={s.date.toISOString()}>
                          {s.date.toLocaleDateString()} — {s.startTime} - {s.endTime}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;