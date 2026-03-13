import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Event.css';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Event = () => {
  const [eventet, setEventet] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getEvents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/events');
        setEventet(res.data);
      } catch (err) {
        console.error("Gabim gjatë marrjes së eventeve:", err);
      } finally {
        setLoading(false);
      }
    };
    getEvents();
  }, []);

  const handleInterest = (titulli) => {
    // KUJDES: Duhet '/kontakt' sepse ashtu e ke te App.js
    navigate('/kontakt', { state: { eventTitle: titulli } });
  };

  if (loading) return <div className="text-center mt-5">Duke u ngarkuar eventet...</div>;

  return (
    <div className="eventet-page">
      <div className="section-header text-center mb-5">
        <h1>Eventet e Ardhshme</h1>
        <p>Bëhu pjesë e komunitetit tonë të lexuesve</p>
      </div>

      <div className="eventet-list container">
        {eventet.length === 0 && <p className="text-center">Nuk ka evente për momentin.</p>}
        
        {eventet.map(ev => (
          <div key={ev._id || ev.id} className="event-card-horizontal">
            <div className="event-date-badge">
              <span>{ev.data ? ev.data.split(' ')[0] : ''}</span>
              <small>{ev.data ? ev.data.split(' ')[1] : ''}</small>
            </div>
            <div className="event-image">
              <img src={ev.imazhi || 'https://via.placeholder.com/500'} alt={ev.titulli} />
            </div>
            <div className="event-info">
              <h3>{ev.titulli}</h3>
              <div className="event-meta">
                <span><FaClock /> {ev.ora}</span>
                <span><FaMapMarkerAlt /> {ev.lokacioni}</span>
              </div>
              <p>{ev.pershkrimi}</p>
              <button 
                className="btn-interesuar" 
                onClick={() => handleInterest(ev.titulli)}
              >
                Rezervo Vendin
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Event;