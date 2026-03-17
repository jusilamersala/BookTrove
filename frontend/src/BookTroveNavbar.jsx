import React, { useState, useContext } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './BookTroveNavbar.css';
import { AuthContext } from './AuthContext';
import { useCart } from './CartContext'; 
import { genres } from './constants/genres';

function BookTroveNavbar() {
  const [expanded, setExpanded] = useState(false);
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { cartItems } = useCart(); 
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleToggle = () => setExpanded(false);

  const totalItems = cartItems.reduce((acc, item) => acc + item.sasia, 0);

  const handleGenreClick = (genre) => {
    navigate('/librat', { state: { selectedGenre: genre } });
    handleToggle();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/librat', { state: { searchQuery: searchTerm } });
    handleToggle();
  };

  return (
    <Navbar 
      expanded={expanded} 
      onToggle={setExpanded} 
      expand="lg" 
      className="booktrove-navbar" 
      variant="dark"
    >
      <Container fluid className="navbar-container">
        <Navbar.Brand as={Link} to="/" onClick={handleToggle}>BookTrove</Navbar.Brand>
        
        <Navbar.Toggle aria-controls="booktrove-navbar" />
        
        <Navbar.Collapse id="booktrove-navbar">
          {/* Menuja Kryesore */}
          <Nav className="navbar-links-center">
            <Nav.Link as={Link} to="/" onClick={handleToggle}>Home</Nav.Link>
            <Nav.Link as={Link} to="/librat" onClick={handleToggle}>Librat</Nav.Link>
            <NavDropdown title="Zhanerat" id="zhanerat-drop">
              {genres.map((genre, index) => (
                <NavDropdown.Item key={index} onClick={() => handleGenreClick(genre)}>
                  {genre}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <Nav.Link as={Link} to="/eventet" onClick={handleToggle}>Eventet</Nav.Link>
            <Nav.Link as={Link} to="/rreth-nesh" onClick={handleToggle}>Rreth Nesh</Nav.Link>
            <Nav.Link as={Link} to="/blog" onClick={handleToggle}>Blog</Nav.Link>
            <Nav.Link as={Link} to="/kontakt" onClick={handleToggle}>Kontakt</Nav.Link>
            {isAdmin() && (
              <Nav.Link as={Link} to="/admin" className="admin-link" onClick={handleToggle}>
                <i className="bi bi-shield-lock"></i> Admin
              </Nav.Link>
            )}
          </Nav>

          {/* Grupi i Djathtë: Search + Icons */}
          <div className="navbar-right-final">
            <Form className="search-form-wrapper" onSubmit={handleSearch}>
              <Form.Control 
                type="search" 
                placeholder="Kërko libra..." 
                className="navbar-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form>
            
            <div className="icons-wrapper">
              <Nav.Link as={Link} to="/shporta" className="cart-link" onClick={handleToggle}>
                <div className="cart-icon-wrapper">
                  <FaShoppingCart size={20} />
                  {totalItems > 0 && (
                    <span className="cart-badge">{totalItems}</span>
                  )}
                </div>
              </Nav.Link>
              
              <NavDropdown title="Llogaria" id="account-drop" align="end">
                {user ? (
                  <>
                    <NavDropdown.Item as={Link} to="/profile" onClick={handleToggle}>Profili</NavDropdown.Item>
                    {isAdmin() && (
                      <>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as={Link} to="/admin" onClick={handleToggle}>
                          <i className="bi bi-shield-lock"></i> Admin Panel
                        </NavDropdown.Item>
                      </>
                    )}
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => { logout(); handleToggle(); }}>Dil</NavDropdown.Item>
                  </>
                ) : (
                  <>
                    <NavDropdown.Item as={Link} to="/login" onClick={handleToggle}>Login</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/signup" onClick={handleToggle}>Signup</NavDropdown.Item>
                  </>
                )}
              </NavDropdown>
            </div> {/* Mbyllja e icons-wrapper */}
          </div> {/* Mbyllja e navbar-right-final */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BookTroveNavbar;