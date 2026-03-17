import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { FaUserCircle, FaBoxOpen, FaSignOutAlt, FaEnvelope, FaUserShield, FaWarehouse, FaClock } from 'react-icons/fa';
import InventoryManager from './InventoryManager';
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

  // Helper to normalize role check
  const isInventoryManager = user?.role?.toLowerCase() === 'inventory_manager';
  const isEmployee = user?.role?.toLowerCase() === 'employee';

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // If Ana, we stop here. We don't fetch personal orders.
        if (isInventoryManager) {
          setLoading(false);
          return;
        }

        const [ordersRes, scheduleRes] = await Promise.all([
          fetch('http://localhost:5000/api/orders', { credentials: 'include' }),
          fetch('http://localhost:5000/api/users/me/schedule', { credentials: 'include' })
        ]);

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
        }

        if (scheduleRes.ok) {
          const scheduleData = await scheduleRes.json();
          setSchedule(scheduleData.schedule || []);
          setAttendance(scheduleData.attendance || []);
        }
      } catch (err) {
        setError("Dështoi ngarkimi i të dhënave.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isInventoryManager]);

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

  if (!user) return <div className="profile-container p-5 text-center"><h4>Ju lutem logohuni.</h4></div>;

  return (
    <div className="profile-container p-4">
      <div className="profile-grid">
        {/* Left Side: Profile Card */}
        <div className="profile-card info-card shadow-sm border-0">
          <div className="user-header text-center">
            <FaUserCircle size={60} className="profile-icon mb-3 text-primary" />
            <h2 className="fw-bold text-capitalize">Mirë se vjen, {user.username}!</h2>
          </div>
          <hr />
          <div className="user-details">
            <p><FaEnvelope className="me-2 text-muted" /> <strong>Email:</strong> {user.email}</p>
            <p><FaUserShield className="me-2 text-muted" /> <strong>Roli:</strong> <span className="badge bg-primary text-uppercase">{user.role}</span></p>
          </div>
          <button className="btn btn-danger w-100 mt-4 d-flex align-items-center justify-content-center gap-2" onClick={logout}>
            <FaSignOutAlt /> Dil nga llogaria
          </button>
        </div>

        {/* Right Side: Dashboard Content */}
        <div className="dashboard-main-content">
          
          {/* 1. VIEW FOR INVENTORY MANAGER (ANA) */}
          {isInventoryManager && (
            <div className="inventory-view shadow-sm rounded bg-white p-4 animate__animated animate__fadeIn">
              <h3 className="mb-4 d-flex align-items-center gap-2">
                <FaWarehouse className="text-primary" /> Menaxhimi i Inventarit
              </h3>
              <InventoryManager />
            </div>
          )}

          {/* 2. VIEW FOR EMPLOYEES */}
          {isEmployee && (
            <div className="attendance-view shadow-sm rounded bg-white p-4 animate__animated animate__fadeIn">
               <h3 className="mb-4 d-flex align-items-center gap-2"><FaClock className="text-primary" /> Pjesëmarrja</h3>
               {/* Attendance logic here... */}
               <div className="attendance-card border p-3 rounded">
                  <p><strong>Orari:</strong> {schedule.length > 0 ? "Aktiv" : "Nuk ka orar"}</p>
                  <button className="btn btn-success" onClick={() => handleAttendance('checkin')}>Check In</button>
               </div>
            </div>
          )}

          {/* 3. VIEW FOR CUSTOMERS (HIDDEN FOR ANA) */}
          {!isInventoryManager && !isEmployee && (
            <div className="orders-view shadow-sm rounded bg-white p-4 animate__animated animate__fadeIn">
              <h3 className="mb-4 d-flex align-items-center gap-2">
                <FaBoxOpen className="text-primary" /> Porositë e tua</h3>
              {loading ? <p>Duke ngarkuar...</p> : (
                <div className="orders-list">
                  {orders.length === 0 ? <p className="text-muted">Nuk keni bërë asnjë porosi ende.</p> : 
                    orders.map(o => (
                      <div key={o._id} className="order-item border-bottom py-3">
                         <div className="d-flex justify-content-between fw-bold">
                            <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                            <span className="text-success">{o.total.toFixed(2)}€</span>
                         </div>
                         <small className="text-muted">Librat: {o.items?.map(i => i.titulli).join(", ")}</small>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;