import React from 'react';
import { FaShoppingCart } from 'react-icons/fa'; // ikon shporte
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function BookTroveNavbar() {
  return (
    <Navbar expand="lg" bg="light" variant="light">
      <Container fluid>
        <Navbar.Brand href="#">BookTrove</Navbar.Brand>
        <Navbar.Toggle aria-controls="booktrove-navbar" />
        <Navbar.Collapse id="booktrove-navbar">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>

            <NavDropdown title="Librat" id="navbar-dropdown-librat">
              <NavDropdown.Item href="#novels">Romane</NavDropdown.Item>
              <NavDropdown.Item href="#non-fiction">Edukim</NavDropdown.Item>
              <NavDropdown.Item href="#children"> Femije</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Zhanerat" id="navbar-dropdown-zhanerat">
              <NavDropdown.Item href="#fiction">Sci-fi</NavDropdown.Item>
              <NavDropdown.Item href="#history">Historik</NavDropdown.Item>
              <NavDropdown.Item href="#science">Shkence</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="#eventet">Eventet</Nav.Link>
            <Nav.Link href="#rreth-nesh">Rreth Nesh</Nav.Link>
            <Nav.Link href="#blog">Blog</Nav.Link>
            <Nav.Link href="#kontakt">Kontakt</Nav.Link>
          </Nav>

          <Form className="d-flex align-items-center">
            <Form.Control
              type="search"
              placeholder="Kerko"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success" className="me-2">
              Kerko
            </Button>

            {/* Ikona e shportes */}
            <Nav.Link href="#shporta" className="me-2">
              <FaShoppingCart size={20} />
            </Nav.Link>

            <Button variant="primary" className="me-2">
              Login
            </Button>
            <Button variant="secondary">Signup</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BookTroveNavbar;