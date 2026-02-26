import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Importo Link
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './BookTroveNavbar.css';

function BookTroveNavbar() {
  return (
    <Navbar expand="lg" className="booktrove-navbar" variant="dark">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">BookTrove</Navbar.Brand>
        <Navbar.Toggle aria-controls="booktrove-navbar" />
        <Navbar.Collapse id="booktrove-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>

            {/* Këtu hoqëm dropdown-in dhe e bëmë Link të thjeshtë */}
            <Nav.Link as={Link} to="/librat">Librat</Nav.Link>

            <NavDropdown title="Zhanerat" id="navbar-dropdown-zhanerat">
              <NavDropdown.Item as={Link} to="/librat/sci-fi">Sci-fi</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/librat/historik">Historik</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/librat/shkence">Shkencë</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/eventet">Eventet</Nav.Link>
            <Nav.Link as={Link} to="/rreth-nesh">Rreth Nesh</Nav.Link>
            <Nav.Link as={Link} to="/blog">Blog</Nav.Link>
            <Nav.Link as={Link} to="/kontakt">Kontakt</Nav.Link>
          </Nav>

          <Form className="d-flex align-items-center navbar-actions">
            <Form.Control type="search" placeholder="Kërko libra..." className="navbar-search me-3"/>
            <Nav.Link as={Link} to="/shporta" className="me-3 cart-icon text-white">
              <FaShoppingCart size={18} />
            </Nav.Link>
            <NavDropdown title="Llogaria" id="account-dropdown" align="end">
              <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/signup">Signup</NavDropdown.Item>
            </NavDropdown>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BookTroveNavbar;