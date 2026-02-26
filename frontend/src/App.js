import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookTroveNavbar from './BookTroveNavbar';
import Footer from './Footer';
import Home from './Home';
import Books from './Books'; 
import Genres from './Genres';
import Event from './Event';
import About from './About';
import Blog from './Blog';
import Contact from './Contact';
import Cart from './Cart';
import Login from './Login';
import Signup from './Signup';

function App() {
  return (
    <Router>
      <div className="App">
        <BookTroveNavbar />
        
        <main style={{ minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/librat" element={<Books />} />
            <Route path="/zhanerat" element={<Genres />} />
            <Route path="/eventet" element={<Event />} />
            <Route path="/rreth-nesh" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/kontakt" element={<Contact />} />
            <Route path="/shporta" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;