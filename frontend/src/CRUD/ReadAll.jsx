import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

const ReadAll = () => {
    const [books, setBooks] = useState([]);
    
    // Simulim: Në projektin tënd real, këtë vlerë do e marrësh nga localStorage pas Login-it
    // const userRole = localStorage.getItem("role"); 
    const userRole = "admin"; // Ndryshoje në "user" për të parë si zhduken butonat

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/getBooks");
            setBooks(res.data);
        } catch (err) {
            console.log("Gabim gjatë marrjes së librave: " + err);
        }
    };

    // Funksioni për fshirjen e librit
    const handleDelete = async (id) => {
        if (window.confirm("A jeni i sigurt që dëshironi ta fshini këtë libër?")) {
            try {
                await axios.delete(`http://localhost:5000/api/deleteBook/${id}`);
                // Përditësojmë gjendjen (state) direkt që libri të zhduket nga ekrani pa refresh
                setBooks(books.filter(book => book._id !== id));
                alert("Libri u fshi me sukses!");
            } catch (err) {
                console.log("Gabim gjatë fshirjes: " + err);
                alert("Nuk u fshi dot. Kontrollo Backend-in.");
            }
        }
    };

    return (
        <Container className="mt-5 pt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold">Lista e Librave</h1>
                {/* Vetëm Admini sheh butonin "Shto" */}
                {userRole === "admin" && (
                    <Link to="/add" className="btn btn-success shadow-sm">
                        + Shto Libër të Ri
                    </Link>
                )}
            </div>

            <Table striped bordered hover className="shadow-sm bg-white">
                <thead className="table-dark">
                    <tr>
                        <th>Imazhi</th>
                        <th>Titulli</th>
                        <th>Autori</th>
                        <th>Çmimi</th>
                        <th>Veprimet</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book._id} className="align-middle">
                            <td>
                                <img 
                                    src={book.image} 
                                    alt={book.title} 
                                    style={{ width: "60px", height: "80px", objectFit: "cover", borderRadius: "5px" }} 
                                />
                            </td>
                            <td className="fw-bold">{book.title}</td>
                            <td>{book.author}</td>
                            <td className="text-success fw-bold">{book.price}€</td>
                            <td>
                                {/* Të gjithë mund të shikojnë detajet */}
                                <Link to={`/read/${book._id}`} className="btn btn-info btn-sm me-2 text-white">
                                    Shiko
                                </Link>

                                {/* Vetëm Admini mund të bëjë Edit dhe Delete */}
                                {userRole === "admin" && (
                                    <>
                                        <Link to={`/update/${book._id}`} className="btn btn-warning btn-sm me-2 text-white">
                                            Edit
                                        </Link>
                                        <Button 
                                            variant="danger" 
                                            size="sm" 
                                            onClick={() => handleDelete(book._id)}
                                        >
                                            Fshi
                                        </Button>
                                    </>
                                )}
                                
                                {/* Përdoruesi i thjeshtë sheh butonin "Shto në Shportë" */}
                                {userRole === "user" && (
                                    <Button variant="primary" size="sm">
                                        🛒 Shportë
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ReadAll;