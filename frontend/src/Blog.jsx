import React, { useState } from 'react';
import './Blog.css';
import { FaArrowRight, FaCommentDots, FaUserCircle, FaPaperPlane } from 'react-icons/fa';

const Blog = () => {
  // State për menaxhimin e komenteve
  const [komenti, setKomenti] = useState("");
  const [listaKomenteve, setListaKomenteve] = useState([
    { id: 1, emri: "Arben G.", tekst: "Sapo mbarova 'Mjeshtri dhe Margarita'. Një kryevepër e vërtetë!", koha: "Para 2 orësh" },
    { id: 2, emri: "Mira L.", tekst: "Sugjerimet për pranverën janë fiks ato që kërkoja. Faleminderit!", koha: "Para 5 orësh" }
  ]);

  const postimet = [
    {
      id: 1,
      titulli: "5 Librat që duhet t'i lexoni këtë pranverë",
      data: "24 Shkurt, 2024",
      autori: "Stafi BookTrove",
      imazhi: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800&q=80",
      shkurtesa: "Zbuloni listën tonë të përzgjedhur me kujdes për t'ju shoqëruar në ditët me diell dhe mbrëmjet e qeta.",
      tag: "Rekomandime"
    },
    {
      id: 2,
      titulli: "Si të krijoni një rutinë leximi",
      data: "15 Shkurt, 2024",
      autori: "Ekspertët tanë",
      imazhi: "https://images.unsplash.com/photo-1491843351663-7c116e81483b?w=600&q=80",
      shkurtesa: "Nuk keni kohë për të lexuar? Këtu janë disa teknika që do t'ju ndihmojnë të gjeni kohë çdo ditë.",
      tag: "Këshilla"
    },
    {
      id: 3,
      titulli: "Intervistë me autorët e rinj",
      data: "10 Shkurt, 2024",
      autori: "Redaksia",
      imazhi: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80",
      shkurtesa: "Një bisedë e hapur mbi sfidat e letërsisë moderne në epokën digjitale.",
      tag: "Intervistë"
    }
  ];

  const handleSendComment = (e) => {
    e.preventDefault();
    if (komenti.trim() === "") return;

    const iRi = {
      id: Date.now(),
      emri: "Vizitor", // Mund ta ndryshosh nëse ke sistem login-i
      tekst: komenti,
      koha: "Tani"
    };

    setListaKomenteve([iRi, ...listaKomenteve]);
    setKomenti("");
  };

  return (
    <div className="blog-page-wrapper">
      <div className="blog-intro-section">
        <span className="blog-subtitle">Lajmet & Kultura</span>
        <h1>Blogu i BookTrove</h1>
        <div className="blog-divider"></div>
      </div>

      {/* Featured Post */}
      <section className="featured-post-container">
        <div className="featured-card">
          <div className="featured-img">
            <img src={postimet[0].imazhi} alt="Featured" />
            <span className="featured-tag">E RE</span>
          </div>
          <div className="featured-content">
            <span className="post-tag">{postimet[0].tag}</span>
            <h2>{postimet[0].titulli}</h2>
            <p>{postimet[0].shkurtesa}</p>
            <div className="post-meta-footer">
              <span>{postimet[0].autori} • {postimet[0].data}</span>
              <button className="read-more-btn">Vazhdo Leximin <FaArrowRight /></button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid i Artikujve */}
      <div className="blog-grid-modern">
        {postimet.slice(1).map(post => (
          <article key={post.id} className="modern-article-card">
            <div className="article-img-holder">
              <img src={post.imazhi} alt={post.titulli} />
            </div>
            <div className="article-details">
              <span className="post-tag-small">{post.tag}</span>
              <h3>{post.titulli}</h3>
              <p>{post.shkurtesa}</p>
              <div className="article-footer">
                <span className="date">{post.data}</span>
                <button className="simple-link">Lexo <FaArrowRight /></button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Seksioni i Komunitetit */}
      <section className="blog-community-section">
        <div className="community-card">
          <div className="community-header">
            <FaCommentDots className="comm-icon" />
            <h2>Bashkohu Diskutimit</h2>
            <p>Çfarë po lexon këtë javë? Ndaje me komunitetin!</p>
          </div>
          
          <form className="comment-input-wrapper" onSubmit={handleSendComment}>
            <FaUserCircle className="user-avatar-icon" />
            <input 
              type="text" 
              placeholder="Shkruaj mendimin tënd..." 
              value={komenti}
              onChange={(e) => setKomenti(e.target.value)}
            />
            <button type="submit" className="send-comment-btn">
              <FaPaperPlane />
            </button>
          </form>

          <div className="recent-comments">
            {listaKomenteve.map(c => (
              <div key={c.id} className="single-comment">
                <strong>{c.emri}</strong>
                <p>{c.tekst}</p>
                <span>{c.koha}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;