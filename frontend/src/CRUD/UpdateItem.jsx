import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateItem = () => {
    const [item, setItem] = useState({ titulli: "", autori: "", cmimi: "", kategoria: "", imazhi: "" });
    const { id } = useParams();
    const nav = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:5000/api/items/${id}`)
            .then(res => setItem(res.data))
            .catch(err => console.log(err));
    }, [id]);

    const handleChange = (e) => setItem({ ...item, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
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

            console.log('Updating with:', dataToSend);
            const res = await axios.put(`http://localhost:5000/api/items/${id}`, dataToSend, { withCredentials: true });
            console.log('Update response:', res.data);
            alert("Libri u përditësua!");
            nav("/admin");
        } catch (err) { 
            console.error('Update error:', { response: err.response?.data, status: err.response?.status });
            alert(`Gabim: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <Container className="mt-5 pt-5">
            <h1 className="mb-4">Modifiko Librin</h1>
            <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Titulli</Form.Label>
                            <Form.Control type="text" name="titulli" value={item.titulli} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Autori</Form.Label>
                            <Form.Control type="text" name="autori" value={item.autori} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Cmimi (€)</Form.Label>
                            <Form.Control type="number" name="cmimi" value={item.cmimi} onChange={handleChange} step="0.01" required />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Kategoria</Form.Label>
                            <Form.Control type="text" name="kategoria" value={item.kategoria} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>URL Imazhi</Form.Label>
                            <Form.Control type="text" name="imazhi" value={item.imazhi} onChange={handleChange} />
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="primary" type="submit">Ruaj Ndryshimet</Button>
            </Form>
        </Container>
    );
};
export default UpdateItem;