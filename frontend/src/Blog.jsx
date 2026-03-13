import React, { useState, useMemo, useEffect, useContext } from 'react';
import axios from 'axios';
import './Blog.css';
import { FaArrowLeft, FaArrowRight, FaPaperPlane, FaSearch } from 'react-icons/fa';
import { AuthContext } from './AuthContext';

const Blog = () => {
  const { user } = useContext(AuthContext) || {};
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [komenti, setKomenti] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [listaKomenteve, setListaKomenteve] = useState(() => {
    const saved = localStorage.getItem('booktrove_blog_comments');
    return saved ? JSON.parse(saved) : [];
  });

  // Merr postimet nga Backendi
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
    localStorage.setItem('booktrove_blog_comments', JSON.stringify(listaKomenteve));
  }, [listaKomenteve]);

  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) return posts;
    const search = searchTerm.toLowerCase();
    return posts.filter(post => 
      post.titulli.toLowerCase().includes(search) || 
      post.tag.toLowerCase().includes(search)
    );
  }, [searchTerm, posts]);

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!komenti.trim()) return;
    const iRi = { id: Date.now(), emri: user?.username || "Vizitor", tekst: komenti };
    setListaKomenteve(prev => [iRi, ...prev]);
    setKomenti("");
  };

  const FullArticle = ({ post }) => (
    <div className="full-article-view">
      <button className="back-btn" onClick={() => setSelectedPost(null)}>
        <FaArrowLeft /> Kthehu te Blogu
      </button>
      <div className="article-header">
        <img src={post.imazhi} alt={post.titulli} className="full-article-img" />
        <span className="post-tag">{post.tag}</span>
        <h1>{post.titulli}</h1>
        <div className="article-meta">
          <span>Nga {post.autori}</span> | <span>{new Date(post.data).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="article-body">
        <p className="lead-text">{post.shkurtesa}</p>
        <div className="main-content">{post.permbajtja}</div>
      </div>
      <hr />
    </div>
  );

  return (
    <div className="blog-page-wrapper">
      {selectedPost ? (
        <FullArticle post={selectedPost} />
      ) : (
        <>
          <div className="blog-intro-section text-center mt-5">
            <h1>Blogu i BookTrove</h1>
            <div className="blog-search-container mt-4">
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

          {filteredPosts.length > 0 ? (
            <div className="blog-grid-modern mt-5">
              {filteredPosts.map(post => (
                <article key={post._id} className="modern-article-card" onClick={() => setSelectedPost(post)}>
                  <div className="article-img-holder">
                    <img src={post.imazhi} alt={post.titulli} />
                  </div>
                  <div className="article-details">
                    <span className="badge bg-warning text-dark">{post.tag}</span>
                    <h3>{post.titulli}</h3>
                    <button className="simple-link">Lexo më shumë <FaArrowRight /></button>
                  </div>
                </article>
              ))}
            </div>
          ) : <p className="text-center mt-5">Nuk u gjet asnjë postim.</p>}
        </>
      )}

      {/* Community Section */}
      <section className="blog-community-section mt-5">
        <div className="community-card p-4 shadow-sm bg-white rounded">
          <h3>Bashkohu Diskutimit</h3>
          <form className="d-flex gap-2" onSubmit={handleSendComment}>
            <input className="form-control" placeholder="Shkruaj një koment..." value={komenti} onChange={(e) => setKomenti(e.target.value)} />
            <button className="btn btn-danger" type="submit"><FaPaperPlane /></button>
          </form>
          <div className="mt-3">
            {listaKomenteve.map(c => (
              <div key={c.id} className="p-2 border-bottom"><strong>{c.emri}:</strong> {c.tekst}</div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;