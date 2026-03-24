import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Badge, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const InventoryManager = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const res = await axios.get('http://localhost:5000/api/items', {
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      setBooks(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (err) {
      setError("Nuk u mundësua ngarkimi i librave.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const changeStock = async (id, current, delta) => {
    const newStock = Math.max(0, current + delta);
    try {
      const token = localStorage.getItem('token'); // Merr token-in
      
      await axios.put(`http://localhost:5000/api/items/${id}`, 
        { stoku: newStock }, 
        { 
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` } // KRITIKE: Shto këtë për të shmangur 401
        }
      );
      
      // Update local state (Optimistic update)
      setBooks(prev => prev.map(b => b._id === id ? { ...b, stoku: newStock } : b));
      
      setSuccessMsg("Stoku u përditësua!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Gabim gjatë përditësimit.";
      alert(msg);
    }
  };

  const totalItems = books.length;
  const outOfStock = books.filter(b => b.stoku === 0).length;
  const lowStock = books.filter(b => b.stoku > 0 && b.stoku <= 5).length;

  const filtered = books.filter(b => 
    b.titulli?.toLowerCase().includes(search.toLowerCase()) || 
    b.autori?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center p-5"><Spinner animation="grow" variant="primary" /></div>;

  return (
    <div>
      {/* Feedback Alert */}
      {successMsg && <Alert variant="success" className="position-fixed top-0 start-50 translate-middle-x mt-3 shadow" style={{ zIndex: 9999 }}>{successMsg}</Alert>}
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

      <Row className="mb-4 g-3">
        <Col md={4}><Card className="bg-primary text-white border-0 shadow-sm"><Card.Body><h6>Total Libra</h6><h3>{totalItems}</h3></Card.Body></Card></Col>
        <Col md={4}><Card className="bg-warning text-dark border-0 shadow-sm"><Card.Body><h6>Stok i Ulët (≤5)</h6><h3>{lowStock}</h3></Card.Body></Card></Col>
        <Col md={4}><Card className="bg-danger text-white border-0 shadow-sm"><Card.Body><h6>Pa Stok</h6><h3>{outOfStock}</h3></Card.Body></Card></Col>
      </Row>

      <div className="d-flex gap-2 mb-4">
        <Form.Control 
          size="lg" className="shadow-sm border-0 bg-light"
          placeholder="Kërko titullin ose autorin..." 
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="outline-primary" onClick={fetchBooks}>Rifresko</Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Table hover responsive className="mb-0">
          <thead className="table-light">
            <tr>
              <th className="ps-3">Libri / Autori</th>
              <th className="text-center">Gjendja</th>
              <th className="text-center">Veprime</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map(book => (
              <tr key={book._id} className="align-middle">
                <td className="ps-3">
                  <div className="fw-bold">{book.titulli}</div>
                  <div className="small text-muted">{book.autori}</div>
                </td>
                <td className="text-center">
                  <Badge pill bg={book.stoku === 0 ? "danger" : book.stoku <= 5 ? "warning" : "success"} className="px-3">
                    {book.stoku} copë
                  </Badge>
                </td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className="px-3" 
                      onClick={() => changeStock(book._id, book.stoku, -1)} 
                      disabled={book.stoku === 0}
                    >
                      -
                    </Button>
                    <Button 
                      variant="success" 
                      size="sm" 
                      className="px-3" 
                      onClick={() => changeStock(book._id, book.stoku, 1)}
                    >
                      +
                    </Button>
                  </div>
                </td>
              </tr>
            )) : (
                <tr>
                    <td colSpan="3" className="text-center py-4 text-muted">Nuk u gjet asnjë libër.</td>
                </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default InventoryManager;