import React, { useState, useEffect, useContext } from "react";
import { Container, Table, Button } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const ReadAll = () => {
    const { user, isAdmin } = useContext(AuthContext);
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/items");
            setItems(res.data);
        } catch (err) {
            console.log("Gabim gjatë marrjes së librave: " + err);
        }
    };

    // Funksioni për fshirjen e librit
    const handleDelete = async (id) => {
        if (!window.confirm("A jeni i sigurt që dëshironi ta fshini këtë libër?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/items/${id}`, { withCredentials: true });
            setItems(items.filter(item => item._id !== id));
            alert("Libri u fshi me sukses!");
        } catch (err) {
            console.log("Gabim gjatë fshirjes: " + err);
            alert("Nuk u fshi dot. Kontrollo Backend-in.");
        }
    };

    return (
        <Container className="mt-5 pt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold">Lista e Librave</h1>
                {/* Vetëm Admini sheh butonin "Shto" */}
                {isAdmin() && (
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
                    {items.map((item) => (
                        <tr key={item._id} className="align-middle">
                            <td>
                                <img 
                                    src={item.imazhi || ""} 
                                    alt={item.titulli} 
                                    style={{ width: "60px", height: "80px", objectFit: "cover", borderRadius: "5px" }} 
                                />
                            </td>
                            <td className="fw-bold">{item.titulli}</td>
                            <td>{item.autori}</td>
                            <td className="text-success fw-bold">{item.cmimi}€</td>
                            <td>
                                {/* Të gjithë mund të shikojnë detajet */}
                                <Link to={`/read/${item._id}`} className="btn btn-info btn-sm me-2 text-white">
                                    Shiko
                                </Link>

                                {/* Vetëm Admini mund të bëjë Edit dhe Delete */}
                                {isAdmin() && (
                                    <>
                                        <Link to={`/update/${item._id}`} className="btn btn-warning btn-sm me-2 text-white">
                                            Edit
                                        </Link>
                                        <Button 
                                            variant="danger" 
                                            size="sm" 
                                            onClick={() => handleDelete(item._id)}
                                        >
                                            Fshi
                                        </Button>
                                    </>
                                )}
                                
                                {/* Përdoruesi i thjeshtë sheh butonin "Shto në Shportë" */}
                                {!isAdmin() && (
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