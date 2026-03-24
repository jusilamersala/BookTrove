import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { FaUserCircle, FaBoxOpen, FaSignOutAlt, FaEnvelope, FaUserShield, FaWarehouse, FaClock, FaDownload, FaCheckCircle, FaDoorOpen as FaExit } from 'react-icons/fa';
import InventoryManager from './InventoryManager';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
        const token = localStorage.getItem('token');
        const config = { 
          headers: { Authorization: `Bearer ${token}` }, 
          withCredentials: true 
        };

        if (!isInventoryManager) {
          try {
            const ordersRes = await axios.get('http://localhost:5000/api/orders/user/my-orders', config);
            setOrders(ordersRes.data);
          } catch (err) {
            console.error("Gabim te porositë:", err);
          }
        }

        if (isEmployee || isInventoryManager) {
          try {
            const attRes = await axios.get('http://localhost:5000/api/attendance/today', config);
            const myLog = attRes.data.filter(log => log.userId?._id === user.id || log.userId === user.id);
            setAttendanceLogs(myLog);
          } catch (err) {
            console.error("Gabim te prezenca:", err);
          }
        }

      } catch (err) {
        console.error("Gabim i përgjithshëm gjatë ngarkimit:", err);
        setError("Nuk u ngarkuan dot të dhënat plotësisht.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isInventoryManager, isEmployee]);

  // CHECK-IN/OUT HANDLER
  const handleAttendance = async (action) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` }, withCredentials: true };

      await axios.post(`http://localhost:5000/api/attendance/${action}`, {}, config);
      
      setSuccessMsg(action === 'checkin' ? "Hyrja u regjistrua!" : "Dalja u regjistrua!");
      setTimeout(() => setSuccessMsg(''), 3000);
      const attRes = await axios.get('http://localhost:5000/api/attendance/today', config);
      const myLog = attRes.data.filter(log => log.userId?._id === user.id || log.userId === user.id);
      setAttendanceLogs(myLog);
    } catch (err) {
      alert(err.response?.data?.message || "Gabim në proces");
    }
  };

  const downloadInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/orders/${orderId}/invoice`, {
        responseType: 'blob',
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fatura-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Nuk u mundësua shkarkimi.");
    }
  };

  if (!user) return <div className="p-5 text-center"><h4>Ju lutem logohuni.</h4></div>;

  return (
    <div className="profile-container p-4">
      {successMsg && <div className="alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3 shadow-lg" style={{zIndex: 9999}}>{successMsg}</div>}
      
      <div className="profile-grid">
        <div className="profile-card info-card shadow-sm border-0">
          <div className="user-header text-center">
            <FaUserCircle size={60} className="profile-icon mb-3 text-primary" />
            <h2 className="fw-bold text-capitalize">Profil: {user.username}</h2>
          </div>
          <hr />
          <div className="user-details">
            <p><FaEnvelope className="me-2 text-muted" /> <strong>Email:</strong> {user.email}</p>
            <p>
              <FaUserShield className="me-2 text-muted" /> 
              <strong>Roli:</strong> <span className="badge bg-primary text-uppercase">{user.role}</span>
            </p>
          </div>
          <button className="btn btn-danger w-100 mt-4 d-flex align-items-center justify-content-center gap-2" onClick={logout}>
            <FaSignOutAlt /> Dil nga llogaria
          </button>
        </div>

        <div className="dashboard-main-content">
          
          {/* 1. VIEW FOR ATTENDANCE AND SCHEDULE */}
          {(isEmployee || isInventoryManager) && (
            <div className="attendance-view shadow-sm rounded bg-white p-4 animate__animated animate__fadeIn mb-4">
              <h3 className="mb-4 d-flex align-items-center gap-2 text-primary">
                <FaClock /> Orari dhe Prezenca
              </h3>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="card h-100 border-primary bg-light">
                    <div className="card-body">
                      <h5 className="card-title fw-bold">🕒 Orari Zyrtar</h5>
                      {user.orari && typeof user.orari === 'object' ? (
                        <div className="mt-2">
                          <p className="mb-1"><strong>Ora:</strong> {user.orari.fillimi} - {user.orari.mbarimi}</p>
                          <p className="mb-0"><strong>Ditët:</strong> {user.orari.ditet?.join(", ")}</p>
                        </div>
                      ) : (
                        <p className="text-muted text-center py-2 italic small">Orari nuk është caktuar nga Admini.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body text-center">
                      <h5 className="fw-bold mb-3">Regjistro Punën</h5>
                      <div className="d-grid gap-2">
                        <button className="btn btn-success d-flex align-items-center justify-content-center gap-2" onClick={() => handleAttendance('checkin')}>
                          <FaCheckCircle /> Hyr (Check-in)
                        </button>
                        <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2" onClick={() => handleAttendance('checkout')}>
                          <FaExit /> Dil (Check-out)
                        </button>
                      </div>
                      {attendanceLogs.length > 0 && (
                        <div className="mt-3 small border-top pt-2 text-start">
                          <p className="mb-0 text-success">Hyrja sot: {attendanceLogs[0].checkIn ? new Date(attendanceLogs[0].checkIn).toLocaleTimeString() : '---'}</p>
                          <p className="mb-0 text-danger">Dalja sot: {attendanceLogs[0].checkOut ? new Date(attendanceLogs[0].checkOut).toLocaleTimeString() : '---'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. VIEW FOR INVENTORY MANAGER */}
          {isInventoryManager && (
            <div className="inventory-view shadow-sm rounded bg-white p-4 animate__animated animate__fadeIn mb-4">
              <h3 className="mb-4 d-flex align-items-center gap-2">
                <FaWarehouse className="text-primary" /> Paneli i Inventarit
              </h3>
              <InventoryManager />
            </div>
          )}

          {/* 3. ORDER HISTORY  */}
          {!isInventoryManager && (
            <div className="orders-view shadow-sm rounded bg-white p-4 animate__animated animate__fadeIn">
              <h3 className="mb-4 d-flex align-items-center gap-2">
                <FaBoxOpen className="text-primary" /> {isEmployee ? "Blerjet e mia" : "Porositë e tua"}
              </h3>
              
              {loading ? (
                <p className="text-center py-3 italic">Duke ngarkuar...</p>
              ) : (
                <div className="orders-list">
                  {orders.length === 0 ? (
                    <p className="text-muted text-center py-4">Nuk keni bërë asnjë porosi ende.</p>
                  ) : (
                    orders.map(o => (
                      <div key={o._id} className="order-item border rounded p-3 mb-3 shadow-sm bg-white">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                          <div>
                            <span className="d-block fw-bold text-dark">Data: {new Date(o.createdAt).toLocaleDateString()}</span>
                            <small className="text-muted">ID: {o._id}</small>
                          </div>
                          <div className="text-end">
                            <span className="h5 text-success d-block mb-1">{o.total.toFixed(2)}€</span>
                            <button className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1" onClick={() => downloadInvoice(o._id)}>
                              <FaDownload size={12} /> Shkarko Faturën
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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