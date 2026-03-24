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
  const [formData, setFormData] = useState({ titulli: '', autori: '', cmimi: '', kategoria: '', imazhi: '', stoku: 0 });
  const [editingId, setEditingId] = useState(null);
  
  // States for Events
  const [events, setEvents] = useState([]);
  const [eventFormData, setEventFormData] = useState({
    titulli: '', data: '', ora: '', lokacioni: '', pershkrimi: '', imazhi: '' 
  });

  // States for Blog
  const [blogs, setBlogs] = useState([]);
  const [blogForm, setBlogForm] = useState({ 
    titulli: '', imazhi: '', tag: 'Rekomandime', shkurtesa: '', permbajtja: '', autori: user?.username || 'Admin' 
  });

  // Common UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // States for Employees & Staff Management
  const [employees, setEmployees] = useState([]);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [workSchedule, setWorkSchedule] = useState({
    fillimi: '08:00',
    mbarimi: '16:00',
    ditet: []
  });

  const ditetEPlota = ["Hënë", "Martë", "Mërkurë", "Enjte", "Premte", " E Shtunë", " E Diel"];

  const [employeeData, setEmployeeData] = useState({ 
    username: '', email: '', password: '', role: 'employee' 
  });

  // --- NEW: Attendance State for Admin View ---
  const [attendanceLogs, setAttendanceLogs] = useState([]);

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

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/attendance/today', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendanceLogs(res.data);
    } catch (err) { console.error("Gabim në marrjen e prezencës"); }
  };

  useEffect(() => {
    fetchItems();
    fetchEmployees();
    fetchEvents();
    fetchBlogs();
    if (isAdmin()) fetchAttendance();
  }, []);

  // --- EVENT HANDLERS (BOOKS) ---
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const config = { withCredentials: true, headers: { Authorization: `Bearer ${token}` } };
      const dataToSend = { ...formData, cmimi: Number(formData.cmimi), stoku: Number(formData.stoku) };

      if (editingId) {
        await axios.put(`http://localhost:5000/api/items/${editingId}`, dataToSend, config);
        setSuccess('Libri u përditësua!');
      } else {
        await axios.post('http://localhost:5000/api/items', dataToSend, config);
        setSuccess('Libri u shtua!');
      }
      fetchItems();
      setFormData({ titulli: '', autori: '', cmimi: '', kategoria: '', imazhi: '', stoku: 0 });
      setEditingId(null);
      setShowModal(false);
    } catch (err) { setError(err.response?.data?.message || 'Gabim në ruajtjen e librit'); }
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

  // --- EMPLOYEE & ATTENDANCE HANDLERS ---
  const handleRegisterEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/users/register-employee', employeeData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(`U regjistrua me sukses: ${employeeData.username}`);
      setEmployeeData({ username: '', email: '', password: '', role: 'employee' });
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || "Gabim gjatë regjistrimit të punonjësit");
    }
    setLoading(false);
  };

  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { withCredentials: true, headers: { Authorization: `Bearer ${token}` } };
      
      await axios.put(`http://localhost:5000/api/users/employees/${selectedEmployee._id}/schedule`, 
        { orari: workSchedule }, config);

      setSuccess(`Orari u përditësua për ${selectedEmployee.username}`);
      setShowEmployeeModal(false);
      fetchEmployees();
    } catch (err) { setError('Gabim në përditësimin e orarit'); }
    setLoading(false);
  };

  // --- EXTRA: Ndihmës për të zgjedhur ditët ---
  const handleDayToggle = (day) => {
    setWorkSchedule(prev => ({
      ...prev,
      ditet: prev.ditet.includes(day) 
        ? prev.ditet.filter(d => d !== day) 
        : [...prev.ditet, day]
    }));
  };

  const handleCheckAction = async (actionType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/attendance/${actionType}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(`U krye me sukses: ${actionType === 'checkin' ? 'Hyrja' : 'Dalja'}`);
      fetchAttendance();
    } catch (err) {
      setError(err.response?.data?.message || "Gabim në procesin e prezencës");
    }
    setLoading(false);
  };

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
        <p className="text-muted">Mirë se erdhët, <span className="text-dark fw-bold">{user?.username}</span>!</p>
        
        <div className="d-flex justify-content-center gap-2 mb-3">
            <Button variant="outline-success" onClick={() => handleCheckAction('checkin')}>🟢 Hyr në Punë</Button>
            <Button variant="outline-secondary" onClick={() => handleCheckAction('checkout')}>🔴 Dil nga Puna</Button>
        </div>
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
                <tr><th>Titulli</th><th>Autori</th><th>Stoku</th><th>Çmimi</th><th>Veprime</th></tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item._id}>
                    <td>{item.titulli}</td>
                    <td>{item.autori}</td>
                    <td>{item.stoku || 0}</td>
                    <td>{item.cmimi} €</td>
                    <td>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => { 
                        setEditingId(item._id); 
                        setFormData({ ...item, stoku: item.stoku || 0 }); 
                        setShowModal(true); 
                      }}>Ndrysho</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteItem(item._id)}>Fshi</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab.Pane>

          <Tab.Pane eventKey="create">
            <Form onSubmit={handleSubmitForm} className="p-4 bg-light rounded shadow-sm">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Titulli i Librit</Form.Label>
                    <Form.Control name="titulli" value={formData.titulli} onChange={handleFormChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Autori</Form.Label>
                    <Form.Control name="autori" value={formData.autori} onChange={handleFormChange} required />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Çmimi (€)</Form.Label>
                    <Form.Control type="number" name="cmimi" value={formData.cmimi} onChange={handleFormChange} required />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Stoku (Gjendja)</Form.Label>
                    <Form.Control type="number" name="stoku" value={formData.stoku} onChange={handleFormChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Kategoria</Form.Label>
                    <Form.Select name="kategoria" value={formData.kategoria} onChange={handleFormChange} required>
                      <option value="">Zgjidh kategorinë...</option>
                      {genres.map(g => <option key={g} value={g}>{g}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>URL e Imazhit</Form.Label>
                <Form.Control name="imazhi" value={formData.imazhi} onChange={handleFormChange} required />
              </Form.Group>
              <Button variant="danger" type="submit" className="w-100 mt-2">Ruaj Librin</Button>
            </Form>
          </Tab.Pane>

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

          <Tab.Pane eventKey="employees">
             <div className="bg-white p-4 rounded shadow-sm mb-4 border-top border-success border-4">
                <h4 className="mb-4">➕ Regjistro Staf të Ri</h4>
                <Form onSubmit={handleRegisterEmployee}>
                  <Row>
                    <Col md={3}><Form.Group className="mb-2"><Form.Label>Përdoruesi</Form.Label><Form.Control value={employeeData.username} onChange={e => setEmployeeData({...employeeData, username: e.target.value})} required /></Form.Group></Col>
                    <Col md={3}><Form.Group className="mb-2"><Form.Label>Email</Form.Label><Form.Control type="email" value={employeeData.email} onChange={e => setEmployeeData({...employeeData, email: e.target.value})} required /></Form.Group></Col>
                    <Col md={3}><Form.Group className="mb-2"><Form.Label>Fjalëkalimi</Form.Label><Form.Control type="password" value={employeeData.password} onChange={e => setEmployeeData({...employeeData, password: e.target.value})} required /></Form.Group></Col>
                    <Col md={3}>
                      <Form.Group className="mb-2">
                        <Form.Label>Roli</Form.Label>
                        <Form.Select value={employeeData.role} onChange={e => setEmployeeData({...employeeData, role: e.target.value})}>
                          <option value="employee">Punonjës</option>
                          <option value="inventory_manager">Menaxher Inventari</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button variant="success" type="submit" disabled={loading}>Krijo Llogarinë</Button>
                </Form>
             </div>

             <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="mb-4">Lista e Stafit</h4>
                <Table striped bordered hover responsive>
                  <thead className="table-dark">
                    <tr><th>Përdoruesi</th><th>Email</th><th>Roli</th><th>Orari</th><th>Veprime</th></tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp._id}>
                        <td>{emp.username}</td>
                        <td>{emp.email}</td>
                        <td>
                          <span className={`badge ${emp.role === 'inventory_manager' ? 'bg-warning text-dark' : 'bg-info'}`}>
                            {emp.role === 'inventory_manager' ? 'Inventari' : 'Punonjës'}
                          </span>
                        </td>
                        <td>
                            <span className="fw-bold text-primary">
                                {emp.orari && typeof emp.orari === 'object' 
                                ? `${emp.orari.fillimi}-${emp.orari.mbarimi} (${emp.orari.ditet?.length} ditë)` 
                                : "Pa caktuar"}
                            </span>
                        </td>
                        <td>
                          <Button variant="outline-primary" size="sm" onClick={() => {
                            setSelectedEmployee(emp);
                            setWorkSchedule(emp.orari || { fillimi: '08:00', mbarimi: '16:00', ditet: [] });
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

      {/* MODAL PER LIBRIN */}
      <Modal show={showModal} onHide={() => { setShowModal(false); setEditingId(null); }} centered>
        <Modal.Header closeButton><Modal.Title>Ndrysho Librin</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitForm}>
            <Form.Group className="mb-2"><Form.Label>Titulli</Form.Label><Form.Control name="titulli" value={formData.titulli} onChange={handleFormChange} required /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Autori</Form.Label><Form.Control name="autori" value={formData.autori} onChange={handleFormChange} required /></Form.Group>
            <Row>
              <Col><Form.Group className="mb-2"><Form.Label>Çmimi</Form.Label><Form.Control type="number" name="cmimi" value={formData.cmimi} onChange={handleFormChange} required /></Form.Group></Col>
              <Col><Form.Group className="mb-2"><Form.Label>Stoku</Form.Label><Form.Control type="number" name="stoku" value={formData.stoku} onChange={handleFormChange} required /></Form.Group></Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Kategoria</Form.Label>
              <Form.Select name="kategoria" value={formData.kategoria} onChange={handleFormChange} required>
                <option value="">Zgjidh...</option>
                {genres.map(g => <option key={g} value={g}>{g}</option>)}
              </Form.Select>
            </Form.Group>
            <Button variant="danger" type="submit" className="w-100" disabled={loading}>Ruaj Ndryshimet</Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showEmployeeModal} onHide={() => setShowEmployeeModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Cakto Orarin: {selectedEmployee?.username}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateSchedule}>
            <Row className="mb-3">
              <Col>
                <Form.Label>Nga (Ora):</Form.Label>
                <Form.Control type="time" value={workSchedule.fillimi} onChange={e => setWorkSchedule({...workSchedule, fillimi: e.target.value})} />
              </Col>
              <Col>
                <Form.Label>Deri (Ora):</Form.Label>
                <Form.Control type="time" value={workSchedule.mbarimi} onChange={e => setWorkSchedule({...workSchedule, mbarimi: e.target.value})} />
              </Col>
            </Row>
            
            <Form.Label>Ditët e punës:</Form.Label>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {ditetEPlota.map(dita => (
                <Form.Check 
                  key={dita}
                  type="checkbox"
                  label={dita}
                  checked={workSchedule.ditet?.includes(dita)}
                  onChange={() => handleDayToggle(dita)}
                  className="border p-2 rounded"
                />
              ))}
            </div>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                {loading ? "Duke u ruajtur..." : "Përditëso Orarin"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminPanel;