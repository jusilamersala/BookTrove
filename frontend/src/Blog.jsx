import React, { useState, useMemo, useEffect, useContext } from 'react';
import axios from 'axios';
import './Blog.css';
import { FaArrowLeft, FaArrowRight, FaPaperPlane, FaSearch, FaLightbulb, FaBook, FaNewspaper } from 'react-icons/fa';
import { AuthContext } from './AuthContext';

// --- KOMPONENTI I ARTIKULLIT (I NXJERRË JASHTË) ---
const FullArticle = ({ post, listaKomenteve, handleSendComment, komenti, setKomenti, setSelectedPost }) => {
  const komentetEPostimit = listaKomenteve[post._id] || [];

  return (
    <div className="full-article-view">
      <button className="back-btn" onClick={() => setSelectedPost(null)}>
        <FaArrowLeft /> Kthehu te Blogu
      </button>

      <div className="article-layout-container">
        {/* Kolona Majtas: Artikulli + Komentet */}
        <div className="article-left-column">
          <div className="article-main-content">
            <img src={post.imazhi} alt={post.titulli} className="full-article-img" />
            <div className="badge-tag" style={{ position: 'static', display: 'inline-block', marginBottom: '15px' }}>
              {post.tag}
            </div>
            <h1>{post.titulli}</h1>
            <div className="article-meta">
              <span>Nga {post.autori || "Admin"}</span> | <span>{new Date(post.data).toLocaleDateString()}</span>
            </div>

            <p className="lead-text">{post.shkurtesa}</p>
            <div className="main-content">
              {post.permbajtja}
            </div>
          </div>

          {/* Seksioni i Komenteve */}
          <div className="community-card">
            <h3>Komentet ({komentetEPostimit.length})</h3>
            <form className="comment-input-wrapper" onSubmit={(e) => handleSendComment(e, post._id)}>
              <input
                type="text"
                placeholder="Shto një koment..."
                value={komenti}
                onChange={(e) => setKomenti(e.target.value)}
              />
              <button className="send-comment-btn" type="submit">
                <FaPaperPlane />
              </button>
            </form>

            <div className="comment-list">
              {komentetEPostimit.map(c => (
                <div key={c.id} className="comment-item">
                  <div className="comment-avatar">{c.emri.charAt(0).toUpperCase()}</div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-name">{c.emri}</span>
                      <span className="comment-date">{new Date(c.data).toLocaleDateString()}</span>
                    </div>
                    <p className="comment-text">{c.tekst}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Djathtas */}
        <aside className="article-sidebar">
          {post.rekomandime && (
            <div className="sidebar-box reco">
              <h4><FaBook /> Rekomandime</h4>
              <p>{post.rekomandime}</p>
            </div>
          )}
          {post.keshilla && (
            <div className="sidebar-box tips">
              <h4><FaLightbulb /> Këshilla</h4>
              <p>{post.keshilla}</p>
            </div>
          )}
          {post.lajme && (
            <div className="sidebar-box news">
              <h4><FaNewspaper /> Lajme</h4>
              <p>{post.lajme}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

// --- KOMPONENTI KRYESOR BLOG ---
const Blog = () => {
  const { user } = useContext(AuthContext) || {};
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [komenti, setKomenti] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);

  const [listaKomenteve, setListaKomenteve] = useState(() => {
    const saved = localStorage.getItem('booktrove_blog_comments_v2');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/blog');
        setPosts(res.data);
      } catch (err) {
        console.error("Gabim në marrjen e postimeve:", err);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    localStorage.setItem('booktrove_blog_comments_v2', JSON.stringify(listaKomenteve));
  }, [listaKomenteve]);

  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) return posts;
    const search = searchTerm.toLowerCase();
    return posts.filter(post =>
      post.titulli.toLowerCase().includes(search) ||
      post.tag.toLowerCase().includes(search)
    );
  }, [searchTerm, posts]);

  const handleSendComment = (e, postId) => {
    e.preventDefault();
    if (!komenti.trim()) return;

    const iRi = {
      id: Date.now(),
      emri: user?.username || "Vizitor",
      tekst: komenti,
      data: new Date().toISOString()
    };

    setListaKomenteve(prev => ({
      ...prev,
      [postId]: [iRi, ...(prev[postId] || [])]
    }));

    setKomenti("");
  };

  return (
    <div className="blog-page-wrapper">
      {selectedPost ? (
        <FullArticle 
          post={selectedPost}
          listaKomenteve={listaKomenteve}
          handleSendComment={handleSendComment}
          komenti={komenti}
          setKomenti={setKomenti}
          setSelectedPost={setSelectedPost}
        />
      ) : (
        <>
          <div className="blog-intro-section">
            <h1>Blogu i BookTrove</h1>
            <p className="subtitle">Lajmet, Rekomandimet dhe Këshillat më të fundit</p>
            <div className="blog-search-container">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Kërko artikuj..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="blog-grid-modern">
            {filteredPosts.map(post => (
              <article key={post._id} className="modern-article-card" onClick={() => setSelectedPost(post)}>
                <div className="article-img-holder">
                  <img src={post.imazhi} alt={post.titulli} />
                  <span className="badge-tag">{post.tag}</span>
                </div>
                <div className="article-details">
                  <h3>{post.titulli}</h3>
                  <p className="short-desc">{post.shkurtesa?.substring(0, 80)}...</p>
                  <div className="card-mini-highlights">
                    {post.keshilla && <span><FaLightbulb /> Këshillë</span>}
                    {post.rekomandime && <span><FaBook /> Libër</span>}
                  </div>
                  <button className="simple-link">Lexo më shumë <FaArrowRight /></button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Blog;