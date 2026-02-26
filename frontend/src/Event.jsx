import React from 'react';
import './Event.css';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Event = () => {
  const eventet = [
    {
      id: 1,
      titulli: "Promovimi i Librit 'Kronikë në gur'",
      data: "12 Mars",
      ora: "18:00",
      lokacioni: "Libraria BookTrove, Tiranë",
      pershkrimi: "Bashkohuni me ne për një mbrëmje diskutimi mbi kryeveprën e Kadaresë.",
      imazhi: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=500&q=80"
    },
    {
      id: 2,
      titulli: "Klubi i Leximit: Shkenca dhe Filozofia",
      data: "20 Mars",
      ora: "17:30",
      lokacioni: "Online (Zoom)",
      pershkrimi: "Diskutojmë mbi librin 'Sapiens' dhe ndikimin e tij në mendimin modern.",
      imazhi: "https://images.unsplash.com/photo-1529148482759-b35b25c5f217?w=500&q=80"
    }
  ];

  return (
    <div className="eventet-page">
      <div className="section-header">
        <h1>Eventet e Ardhshme</h1>
        <p>Bëhu pjesë e komunitetit tonë të lexuesve</p>
      </div>

      <div className="eventet-list">
        {eventet.map(ev => (
          <div key={ev.id} className="event-card-horizontal">
            <div className="event-date-badge">
              <span>{ev.data.split(' ')[0]}</span>
              <small>{ev.data.split(' ')[1]}</small>
            </div>
            <div className="event-image">
              <img src={ev.imazhi} alt={ev.titulli} />
            </div>
            <div className="event-info">
              <h3>{ev.titulli}</h3>
              <div className="event-meta">
                <span><FaClock /> {ev.ora}</span>
                <span><FaMapMarkerAlt /> {ev.lokacioni}</span>
              </div>
              <p>{ev.pershkrimi}</p>
              <button className="btn-interesuar">Më trego më shumë</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Event;