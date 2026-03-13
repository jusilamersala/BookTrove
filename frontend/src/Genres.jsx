import React, { useState, useEffect } from 'react';
import './Genres.css';
import { genres } from './constants/genres';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Genres = () => {
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState('');
  const [bookCounts, setBookCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch books and count by category
  useEffect(() => {
    const fetchBookCounts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/items");
        const books = response.data;
        
        // Count books by category
        const counts = {};
        genres.forEach(genre => {
          counts[genre] = books.filter(book => book.kategoria === genre).length;
        });
        
        setBookCounts(counts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
      }
    };

    fetchBookCounts();
  }, []);

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    navigate('/librat', { state: { selectedGenre: genre } });
  };

  if (loading) {
    return (
      <div className="zhanerat-container">
        <h2>Kategoritë e Librave</h2>
        <p>Duke u ngarkuar...</p>
      </div>
    );
  }

  return (
    <div className="zhanerat-container">
      <h2>Kategoritë e Librave</h2>
      <p>Zgjidhni një kategori për të parë librat përkatës</p>
      <div className="zhanerat-list">
        {genres.map((genre, index) => (
          <div
            key={index}
            className="zhaner-item"
            onClick={() => handleGenreClick(genre)}
          >
            <span className="genre-name">{genre}</span>
            <span className="genre-count">({bookCounts[genre] || 0})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Genres;