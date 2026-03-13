import React, { useContext, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const CreateItem = () => {
  const { isAdmin } = useContext(AuthContext);
  const [item, setItem] = React.useState({
  titulli: "",
  autori: "",
  cmimi: "",
  kategoria: "",
  imazhi: ""
});
    const nav = useNavigate();

    useEffect(() => {
      if (!isAdmin()) {
        nav("/");
      }
    }, []);

    const handleChange = (e) => {
        setItem({ ...item, [e.target.name]: e.target.value });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all fields
        if (!item.titulli.trim() || !item.autori.trim() || !item.cmimi || !item.kategoria.trim()) {
          alert('Të gjushta fushat janë të detyrueshme!');
          return;
        }

        try {
            const dataToSend = {
              titulli: item.titulli.trim(),
              autori: item.autori.trim(),
              cmimi: parseFloat(item.cmimi),
              kategoria: item.kategoria.trim(),
              imazhi: item.imazhi?.trim() || 'https://via.placeholder.com/300x400?text=Libri'
            };

            console.log('Submitting:', dataToSend);
            const res = await axios.post("http://localhost:5000/api/items", dataToSend, { withCredentials: true });
            console.log('Response:', res.data);
            alert("Libri u shtua me sukses!");
            nav("/admin"); 
        }
        catch (err) {
            console.log("Error details:", {
              message: err.message,
              response: err.response?.data,
              status: err.response?.status
            });
            alert(`Gabim! ${err.response?.data?.message || err.message}`);
        }
    }
    return (
        <Container className="mt-5 pt-5">
            <h1 className="mb-4 fw-bold">Krijo një Libër të Ri</h1>
            <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Titulli i Librit</Form.Label>
                            <Form.Control type="text" name="titulli" value={item.titulli} onChange={handleChange} placeholder="p.sh. The Great Gatsby" required />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Autori</Form.Label>
                            <Form.Control type="text" name="autori" value={item.autori} onChange={handleChange} placeholder="p.sh. F. Scott Fitzgerald" required />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Çmimi</Form.Label>
                            <Form.Control type="number" name="cmimi" value={item.cmimi} onChange={handleChange} placeholder="p.sh. 10" step="0.01" required />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Kategoria</Form.Label>
                            <Form.Control type="text" name="kategoria" value={item.kategoria} onChange={handleChange} placeholder="p.sh. Roman" required />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">URL e Imazhit</Form.Label>
                    <Form.Control type="text" name="imazhi" value={item.imazhi} onChange={handleChange} placeholder="p.sh. https://example.com/image.jpg" required />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Shto Libër
                </Button>
            </Form>
        </Container>
    );
}
export default CreateItem;