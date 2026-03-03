import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const ReadOne = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/getBook/${id}`);
                setBook(res.data);
            } catch (err) {
                console.log("Gabim: " + err);
            }
        };
        fetchBook();
    }, [id]);

    if (!book) return <Container className="mt-5 text-center"><h3>Duke u ngarkuar...</h3></Container>;

    return (
        <Container className="mt-5 pt-5">
            <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
                <Row className="g-0">
                    <Col md={4}>
                        <Card.Img src={book.image} className="h-100 object-fit-cover" alt={book.title} />
                    </Col>
                    <Col md={8}>
                        <Card.Body className="p-5">
                            <h6 className="text-muted text-uppercase mb-2">{book.category}</h6>
                            <h1 className="display-5 fw-bold mb-3">{book.title}</h1>
                            <h4 className="text-secondary mb-4">nga {book.author}</h4>
                            <h2 className="text-primary fw-bold mb-4">{book.price}</h2>
                            <hr />
                            <div className="mt-4">
                                <Button variant="outline-secondary" onClick={() => nav(-1)} className="me-3 px-4">
                                    Kthehu Pas
                                </Button>
                                <Button variant="dark" className="px-4">Shto në Shportë</Button>
                            </div>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export default ReadOne;