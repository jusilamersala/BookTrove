import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Tab, Table, Button, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { genres } from './constants/genres';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user, isAdmin } = useContext(AuthContext);
  
  // States for Books
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ titulli: '', autori: '', cmimi: '', kategoria: '', imazhi: '' });
  const [editingId, setEditingId] = useState(null);
  
  // States for Events
  const [events, setEvents] = useState([]);
  const [eventFormData, setEventFormData] = useState({
    titulli: '', 
    data: '', 
    ora: '', 
    lokacioni: '', 
    pershkrimi: '', 
    imazhi: '' 
  });

  // States for Blog
  const [blogs, setBlogs] = useState([]);
  const [blogForm, setBlogForm] = useState({ 
    titulli: '', 
    imazhi: '', 
    tag: 'Rekomandime', 
    shkurtesa: '', 
    permbajtja: '', 
    autori: user?.username || 'Admin' 
  });

  // Common UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // States for Employees & Schedule
  const [employees, setEmployees] = useState([]);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [workSchedule, setWorkSchedule] = useState('');

  // --- API FETCH FUNCTIONS ---

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items');
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) { setError('Gabim në marrjen e librave'); }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      setEvents(Array.isArray(response.data) ? response.data : []);
    } catch (err) { console.error('Gabim në marrjen e eventeve'); }
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blog');
      setBlogs(Array.isArray(response.data) ? response.data : []);
    } catch (err) { console.error('Gabim në marrjen e blogjeve'); }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { withCredentials: true, headers: { Authorization: token ? `Bearer ${token}` : undefined } };
      const res = await axios.get('http://localhost:5000/api/users/employees', config);
      setEmployees(res.data);
    } catch (err) { console.error('Gabim në marrjen e punonjësve'); }
  };

  useEffect(() => {
    fetchItems();
    fetchEmployees();
    fetchEvents();
    fetchBlogs();
  }, []);

  // --- EVENT HANDLERS (BOOKS) ---

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { withCredentials: true, headers: { Authorization: `Bearer ${token}` } };
      
      if (editingId) {
        await axios.put(`http://localhost:5000/api/items/${editingId}`, formData, config);
        setSuccess('Libri u përditësua!');
      } else {
        await axios.post('http://localhost:5000/api/items', formData, config);
        setSuccess('Libri u shtua!');
      }
      fetchItems();
      setShowModal(false);
      setFormData({ titulli: '', autori: '', cmimi: '', kategoria: '', imazhi: '' });
      setEditingId(null);
    } catch (err) { setError('Gabim në ruajtjen e librit'); }
    setLoading(false);
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Fshij këtë libër?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`, { withCredentials: true });
      setSuccess('Libri u fshi!');
      fetchItems();
    } catch (err) { setError('Gabim në fshirje'); }
  };

  // --- EVENT HANDLERS (EVENTS) ---

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { withCredentials: true, headers: { Authorization: `Bearer ${token}` } };
      await axios.post('http://localhost:5000/api/events', eventFormData, config);
      setSuccess('Eventi u publikua me sukses!');
      setEventFormData({ titulli: '', data: '', ora: '', lokacioni: '', pershkrimi: '', imazhi: '' });
      fetchEvents();
    } catch (err) { setError('Gabim në publikimin e eventit'); }
    setLoading(false);
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Fshij këtë event?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`, { withCredentials: true });
      setSuccess('Eventi u fshi!');
      fetchEvents();
    } catch (err) { setError('Gabim në fshirjen e eventit'); }
  };

  // --- BLOG HANDLERS ---
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { withCredentials: true, headers: { Authorization: `Bearer ${token}` } };
      await axios.post('http://localhost:5000/api/blog', blogForm, config);
      setSuccess('Artikulli u postua në Blog!');
      setBlogForm({ titulli: '', imazhi: '', tag: 'Rekomandime', shkurtesa: '', permbajtja: '', autori: user?.username });
      fetchBlogs();
    } catch (err) { setError('Gabim në postimin e blogut'); }
    setLoading(false);
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Fshij këtë artikull?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/blog/${id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Artikulli u fshi!');
      fetchBlogs();
    } catch (err) { setError('Gabim në fshirje'); }
  };

  // --- EMPLOYEE SCHEDULE HANDLER ---
  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { withCredentials: true, headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:5000/api/users/employees/${selectedEmployee._id}/schedule`, 
        { orari: workSchedule }, config);
      setSuccess(`Orari u përditësua për ${selectedEmployee.username}`);
      setShowEmployeeModal(false);
      fetchEmployees();
    } catch (err) { setError('Gabim në përditësimin e orarit'); }
  };

  // --- FILTER LOGIC ---
  const filteredItems = items.filter(item => {
    const matchesSearch = (item.titulli || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.autori || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === '' || item.kategoria === filterCategory;
    return matchesSearch && matchesCat;
  });

  if (!isAdmin()) {
    return <Container className="mt-5"><Alert variant="danger">Qasje e Ndaluar!</Alert></Container>;
  }

  return (
    <Container fluid className="admin-panel mt-5 pt-3 mb-5">
      <div className="admin-header mb-4 text-center">
        <h1 className="fw-bold text-danger">Admin Panel</h1>
        <p className="text-muted">Mirëseerdhët, <span className="text-dark fw-bold">{user?.username}</span>!</p>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      <Tab.Container defaultActiveKey="manage">
        <Nav variant="pills" className="admin-nav mb-4 justify-content-center">
          <Nav.Item><Nav.Link eventKey="manage">📚 Librat</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="create">➕ Shto Libër</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="blog">📰 Blogu</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="events">🗓️ Eventet</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="employees">👥 Punonjësit</Nav.Link></Nav.Item>
        </Nav>

        <Tab.Content>
          {/* LIBRAT TAB */}
          <Tab.Pane eventKey="manage">
            <Row className="mb-3">
              <Col md={8}><Form.Control placeholder="Kërko libër..." onChange={e => setSearchTerm(e.target.value)} /></Col>
              <Col md={4}>
                <Form.Select onChange={e => setFilterCategory(e.target.value)}>
                  <option value="">Të gjitha kategoritë</option>
                  {genres.map(g => <option key={g} value={g}>{g}</option>)}
                </Form.Select>
              </Col>
            </Row>
            <Table striped bordered hover responsive className="shadow-sm">
              <thead className="table-dark">
                <tr><th>Titulli</th><th>Autori</th><th>Çmimi</th><th>Veprime</th></tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item._id}>
                    <td>{item.titulli}</td><td>{item.autori}</td><td>{item.cmimi} €</td>
                    <td>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => { setEditingId(item._id); setFormData(item); setShowModal(true); }}>Ndrysho</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteItem(item._id)}>Fshi</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab.Pane>

          {/* SHTO LIBER TAB */}
          <Tab.Pane eventKey="create">
             <Form onSubmit={handleSubmitForm} className="p-4 bg-light rounded shadow-sm">
                <Row>
                  <Col md={6}><Form.Group className="mb-3"><Form.Label>Titulli</Form.Label><Form.Control name="titulli" value={formData.titulli} onChange={handleFormChange} required /></Form.Group></Col>
                  <Col md={6}><Form.Group className="mb-3"><Form.Label>Autori</Form.Label><Form.Control name="autori" value={formData.autori} onChange={handleFormChange} required /></Form.Group></Col>
                </Row>
                <Row>
                  <Col md={4}><Form.Group className="mb-3"><Form.Label>Çmimi (€)</Form.Label><Form.Control type="number" name="cmimi" value={formData.cmimi} onChange={handleFormChange} required /></Form.Group></Col>
                  <Col md={8}><Form.Group className="mb-3"><Form.Label>URL e Imazhit</Form.Label><Form.Control name="imazhi" value={formData.imazhi} onChange={handleFormChange} /></Form.Group></Col>
                </Row>
                <Button variant="danger" type="submit" className="w-100 mt-2">Ruaj Librin</Button>
             </Form>
          </Tab.Pane>

          {/* BLOG TAB */}
          <Tab.Pane eventKey="blog">
            <h3 className="mb-3">Menaxho Blogun</h3>
            <Form onSubmit={handleBlogSubmit} className="p-4 border rounded shadow-sm mb-4 bg-white">
              <Row>
                <Col md={8}><Form.Group className="mb-2"><Form.Label>Titulli</Form.Label><Form.Control value={blogForm.titulli} onChange={e => setBlogForm({...blogForm, titulli: e.target.value})} required /></Form.Group></Col>
                <Col md={4}><Form.Group className="mb-2"><Form.Label>Tag</Form.Label><Form.Select value={blogForm.tag} onChange={e => setBlogForm({...blogForm, tag: e.target.value})}><option>Rekomandime</option><option>Këshilla</option><option>Lajme</option></Form.Select></Form.Group></Col>
              </Row>
              <Form.Group className="mb-2"><Form.Label>URL Imazhi</Form.Label><Form.Control value={blogForm.imazhi} onChange={e => setBlogForm({...blogForm, imazhi: e.target.value})} required /></Form.Group>
              <Form.Group className="mb-2"><Form.Label>Përshkrimi i shkurtër</Form.Label><Form.Control as="textarea" rows={2} value={blogForm.shkurtesa} onChange={e => setBlogForm({...blogForm, shkurtesa: e.target.value})} required /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Përmbajtja e plotë</Form.Label><Form.Control as="textarea" rows={5} value={blogForm.permbajtja} onChange={e => setBlogForm({...blogForm, permbajtja: e.target.value})} required /></Form.Group>
              <Button variant="danger" type="submit" disabled={loading}>{loading ? <Spinner size="sm" /> : "Publiko në Blog"}</Button>
            </Form>
            <Table striped bordered hover responsive>
              <thead className="table-dark"><tr><th>Titulli</th><th>Data</th><th>Veprim</th></tr></thead>
              <tbody>
                {blogs.map(b => (
                  <tr key={b._id}><td>{b.titulli}</td><td>{new Date(b.data).toLocaleDateString()}</td>
                  <td><Button variant="outline-danger" size="sm" onClick={() => handleDeleteBlog(b._id)}>Fshi</Button></td></tr>
                ))}
              </tbody>
            </Table>
          </Tab.Pane>

          {/* EVENTS TAB */}
          <Tab.Pane eventKey="events">
            <h3 className="mb-3">Publiko Event të Ri</h3>
            <Form onSubmit={handleEventSubmit} className="p-4 border rounded shadow-sm mb-5 bg-white">
              <Row>
                <Col md={6}><Form.Group className="mb-2"><Form.Label>Titulli</Form.Label><Form.Control value={eventFormData.titulli} onChange={e => setEventFormData({...eventFormData, titulli: e.target.value})} required /></Form.Group></Col>
                <Col md={3}><Form.Group className="mb-2"><Form.Label>Data</Form.Label><Form.Control value={eventFormData.data} onChange={e => setEventFormData({...eventFormData, data: e.target.value})} required /></Form.Group></Col>
                <Col md={3}><Form.Group className="mb-2"><Form.Label>Ora</Form.Label><Form.Control value={eventFormData.ora} onChange={e => setEventFormData({...eventFormData, ora: e.target.value})} required /></Form.Group></Col>
              </Row>
              <Row><Col md={6}><Form.Group className="mb-2"><Form.Label>Lokacioni</Form.Label><Form.Control value={eventFormData.lokacioni} onChange={e => setEventFormData({...eventFormData, lokacioni: e.target.value})} required /></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-2"><Form.Label>URL Imazhi</Form.Label><Form.Control value={eventFormData.imazhi} onChange={e => setEventFormData({...eventFormData, imazhi: e.target.value})} /></Form.Group></Col></Row>
              <Form.Group className="mb-3"><Form.Label>Përshkrimi</Form.Label><Form.Control as="textarea" rows={3} value={eventFormData.pershkrimi} onChange={e => setEventFormData({...eventFormData, pershkrimi: e.target.value})} required /></Form.Group>
              <Button variant="primary" type="submit" disabled={loading}>Shto Eventin</Button>
            </Form>
            <Table striped hover responsive>
              <thead className="table-primary"><tr><th>Titulli</th><th>Data & Ora</th><th>Veprim</th></tr></thead>
              <tbody>
                {events.map(ev => (
                  <tr key={ev._id}><td>{ev.titulli}</td><td>{ev.data} @ {ev.ora}</td>
                  <td><Button variant="outline-danger" size="sm" onClick={() => handleDeleteEvent(ev._id)}>Fshi</Button></td></tr>
                ))}
              </tbody>
            </Table>
          </Tab.Pane>

          {/* EMPLOYEES TAB (ORARI I SHTUAR KETU) */}
          <Tab.Pane eventKey="employees">
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="mb-4">Menaxhimi i Punonjësve</h4>
              <Table striped bordered hover responsive>
                <thead className="table-dark">
                  <tr><th>Përdoruesi</th><th>Email</th><th>Orari i Punës</th><th>Veprime</th></tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp._id}>
                      <td>{emp.username}</td>
                      <td>{emp.email}</td>
                      <td>{emp.orari || "Pa caktuar"}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" onClick={() => {
                          setSelectedEmployee(emp);
                          setWorkSchedule(emp.orari || '');
                          setShowEmployeeModal(true);
                        }}>📅 Cakto Orarin</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* MODAL PER LIBRA */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Ndrysho Librin</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitForm}>
            <Form.Group className="mb-3"><Form.Label>Titulli</Form.Label><Form.Control name="titulli" value={formData.titulli} onChange={handleFormChange} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Autori</Form.Label><Form.Control name="autori" value={formData.autori} onChange={handleFormChange} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Çmimi</Form.Label><Form.Control name="cmimi" value={formData.cmimi} onChange={handleFormChange} required /></Form.Group>
            <Button variant="danger" type="submit" className="w-100">Ruaj</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* MODAL PER ORARIN E PUNONJESVE */}
      <Modal show={showEmployeeModal} onHide={() => setShowEmployeeModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Cakto Orarin: {selectedEmployee?.username}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateSchedule}>
            <Form.Group className="mb-3">
              <Form.Label>Shkruaj orarin e punës</Form.Label>
              <Form.Control 
                placeholder="p.sh. Hën-Pre, 08:00-16:00" 
                value={workSchedule} 
                onChange={e => setWorkSchedule(e.target.value)} 
                required 
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">Përditëso Orarin</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminPanel;