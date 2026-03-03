import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateItem = () => {
    const [item, setItem] = useState({ title: "", author: "", price: "", category: "", image: "" });
    const { id } = useParams();
    const nav = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:5000/api/getBook/${id}`)
            .then(res => setItem(res.data))
            .catch(err => console.log(err));
    }, [id]);

    const handleChange = (e) => setItem({ ...item, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/updateBook/${id}`, item);
            alert("Libri u përditësua!");
            nav("/librat");
        } catch (err) { alert("Gabim gjatë përditësimit!"); }
    };

    return (
        <Container className="mt-5 pt-5">
            <h1 className="mb-4">Modifiko Librin</h1>
            <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Titulli</Form.Label>
                            <Form.Control type="text" name="title" value={item.title} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Autori</Form.Label>
                            <Form.Control type="text" name="author" value={item.author} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="primary" type="submit">Ruaj Ndryshimet</Button>
            </Form>
        </Container>
    );
};
export default UpdateItem;