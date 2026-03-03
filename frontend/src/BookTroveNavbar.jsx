import React, { useState, useContext } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Container, Form, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './BookTroveNavbar.css';
import { AuthContext } from './AuthContext';

function BookTroveNavbar() {
  const [expanded, setExpanded] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const handleToggle = () => setExpanded(false);

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
              <NavDropdown.Item as={Link} to="/librat/sci-fi" onClick={handleToggle}>Sci-fi</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/librat/historik" onClick={handleToggle}>Historik</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/librat/shkence" onClick={handleToggle}>Shkencë</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/eventet" onClick={handleToggle}>Eventet</Nav.Link>
            <Nav.Link as={Link} to="/rreth-nesh" onClick={handleToggle}>Rreth Nesh</Nav.Link>
            <Nav.Link as={Link} to="/blog" onClick={handleToggle}>Blog</Nav.Link>
            <Nav.Link as={Link} to="/kontakt" onClick={handleToggle}>Kontakt</Nav.Link>
          </Nav>

          {/* Grupi i Djathtë - I blinduar kundër zbritjes poshtë */}
          <div className="navbar-right-final">
            <Form className="search-form-wrapper">
              <Form.Control 
                type="search" 
                placeholder="Kërko libra..." 
                className="navbar-search-input"
              />
            </Form>
            
            <div className="icons-wrapper">
              <Nav.Link as={Link} to="/shporta" className="cart-link" onClick={handleToggle}>
                <FaShoppingCart size={20} />
              </Nav.Link>
              
              <NavDropdown title="Llogaria" id="account-drop" align="end">
                {user ? (
                  <>
                    <NavDropdown.Item as={Link} to="/profile" onClick={handleToggle}>Profili</NavDropdown.Item>
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
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BookTroveNavbar;