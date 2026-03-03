import React from "react";
import { useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateItem = () => {
  const [item, setItem] = React.useState({
  titulli: "",
  autori: "",
  cmimi: "",
  kategoria: "",
  imazhi: ""
});
    const nav = useNavigate();
    const handleChange = (e) => {
        setItem({ ...item, [e.target.name]: e.target.value });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/addItem", item);
            alert("Libri u shtua me sukses!");
            nav("/"); 
        }
        catch (err) {
            console.log("Error gjatë dërgimit: " + err);
            alert("Gabim! Kontrollo terminalin e Backend-it.");
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
                            <Form.Control type="text" name="title" value={item.title} onChange={handleChange} placeholder="p.sh. The Great Gatsby" required />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Autori</Form.Label>
                            <Form.Control type="text" name="author" value={item.author} onChange={handleChange} placeholder="p.sh. F. Scott Fitzgerald" required />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Çmimi</Form.Label>
                            <Form.Control type="text" name="price" value={item.price} onChange={handleChange} placeholder="p.sh. 10€" required />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Kategoria</Form.Label>
                            <Form.Control type="text" name="category" value={item.category} onChange={handleChange} placeholder="p.sh. Roman" required />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">URL e Imazhit</Form.Label>
                    <Form.Control type="text" name="image" value={item.image} onChange={handleChange} placeholder="p.sh. https://example.com/image.jpg" required />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Shto Libër
                </Button>
            </Form>
        </Container>
    );
}
export default CreateItem;