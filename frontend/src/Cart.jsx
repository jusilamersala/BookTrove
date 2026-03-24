import React, { useState } from 'react';
import './Cart.css';
import { 
  FaTrashAlt, FaPlus, FaMinus, FaArrowLeft, 
  FaCcPaypal, FaMoneyBillWave, FaCheckCircle, FaDownload 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext'; 
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isFinished, setIsFinished] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.cmimi * item.sasia), 0);

  // PayPal
  const paypalOptions = {
    "client-id": "AdN_4kOW28RlLh32WQwWyR6UCK7mxq8qITbtMftfq6YgWzvUmBAihf7pgJQJB6uSdjSLHkBbD-tYlPe7",
    currency: "EUR",
    intent: "capture",
  };
//invoice 
  const downloadInvoice = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/${orderId}/invoice`, {
        responseType: 'blob', 
        withCredentials: true 
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fatura_booktrove_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gabim gjatë shkarkimit:", error);
      alert("Nuk u mundësua shkarkimi i faturës. Sigurohuni që sesioni juaj është aktiv.");
    }
  };


  const processOrder = async (details = null) => {
    if (cartItems.length === 0) return;
    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          _id: item._id, 
          titulli: item.titulli,
          sasia: item.sasia,
          cmimi: item.cmimi
        })),
        total: subtotal,
        metodaPageses: details ? "PayPal" : "Cash on Delivery"
      };

      const response = await axios.post("http://localhost:5000/api/orders", orderData, { 
        withCredentials: true 
      });
      
      if (response.status === 201) {
        setCompletedOrder(response.data.order);
        setIsFinished(true);
        clearCart(); 
      }
    } catch (error) {
      console.error("Gabim gjatë porosisë:", error);
      const errorMsg = error.response?.data?.message || "Ndodhi një gabim gjatë procesimit.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (isFinished) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-lg p-5 border-0 bg-white mx-auto" style={{ maxWidth: '600px', borderRadius: '20px' }}>
          <FaCheckCircle className="text-success mb-3" size={70} />
          <h2 className="fw-bold">Blerja u krye me sukses!</h2>
          <p className="text-muted">Faleminderit që zgjodhët BookTrove. Porosia juaj po procesohet.</p>
          <hr />
          <div className="text-start mb-4 bg-light p-3 rounded-3">
            <p className="mb-1"><strong>ID e Porosisë:</strong> <span className="text-primary">{completedOrder?._id}</span></p>
            <p className="mb-0"><strong>Totali i paguar:</strong> <span className="fw-bold">{completedOrder?.total.toFixed(2)}€</span></p>
          </div>
          <div className="d-grid gap-2">
            <button 
              className="btn btn-primary btn-lg rounded-pill shadow-sm py-3 fw-bold" 
              onClick={() => downloadInvoice(completedOrder._id)}
            >
              <FaDownload className="me-2" /> Shkarko Faturën PDF
            </button>
            <Link to="/librat" className="btn btn-outline-secondary rounded-pill py-2">
              Kthehu te Librat
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <div className="cart-page bg-light min-vh-100">
        <div className="container py-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Link to="/librat" className="text-decoration-none text-dark fw-bold hover-primary">
              <FaArrowLeft className="me-2" /> Vazhdo blerjen
            </Link>
            <h1 className="h2 mb-0 fw-bold">Shporta Juaj ({cartItems.length})</h1>
          </div>

          <div className="row">
            <div className="col-lg-8">
              {cartItems.length > 0 ? (
                cartItems.map(item => (
                  <div key={item._id} className="card border-0 shadow-sm mb-3 p-3 bg-white rounded-4 d-flex flex-row align-items-center animate__animated animate__fadeIn">
                    <img src={item.imazhi} alt={item.titulli} style={{ width: '80px', height: '110px', objectFit: 'cover', borderRadius: '10px' }} />
                    <div className="flex-grow-1 ms-3">
                      <h5 className="mb-1 fw-bold text-truncate" style={{ maxWidth: '250px' }}>{item.titulli}</h5>
                      <span className="text-primary fs-5 fw-bold">{item.cmimi}€</span>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <div className="input-group input-group-sm" style={{ width: '110px' }}>
                        <button className="btn btn-outline-secondary border-2" onClick={() => updateQuantity(item._id, -1)} disabled={item.sasia <= 1}><FaMinus /></button>
                        <span className="form-control text-center bg-white border-2 fw-bold">{item.sasia}</span>
                        <button className="btn btn-outline-secondary border-2" onClick={() => updateQuantity(item._id, 1)}><FaPlus /></button>
                      </div>
                      <button className="btn btn-link text-danger p-0" onClick={() => removeFromCart(item._id)}>
                        <FaTrashAlt size={20} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5 bg-white rounded-4 shadow-sm border-0">
                  <h3 className="text-muted">Shporta juaj është boshe</h3>
                  <Link to="/librat" className="btn btn-primary mt-3 px-5 py-2 rounded-pill fw-bold">Eksploro Librat</Link>
                </div>
              )}
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-sm p-4 bg-white rounded-4 sticky-top" style={{ top: '20px' }}>
                <h3 className="h5 border-bottom pb-3 mb-3 fw-bold text-uppercase">Përmbledhja</h3>
                
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Nëntotali:</span>
                  <span className="fw-bold">{subtotal.toFixed(2)}€</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Transporti:</span>
                  <span className="text-success fw-bold">Falas</span>
                </div>
                <div className="d-flex justify-content-between border-top pt-3 mb-4">
                  <span className="h4 fw-bold">Totali:</span>
                  <span className="h4 fw-bold text-primary">{subtotal.toFixed(2)}€</span>
                </div>

                <div className="payment-options mb-4">
                  <p className="small text-muted mb-2 text-uppercase fw-bold">Zgjidhni mënyrën e pagesës</p>
                  <div 
                    className={`p-3 mb-2 border-2 rounded-3 d-flex align-items-center transition-all ${paymentMethod === 'cash' ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`} 
                    onClick={() => setPaymentMethod('cash')} 
                    style={{ cursor: 'pointer' }}
                  >
                    <FaMoneyBillWave className={`me-3 fs-4 ${paymentMethod === 'cash' ? 'text-primary' : 'text-success'}`} /> 
                    <div>
                      <div className="fw-bold small">Cash on Delivery</div>
                      <small className="text-muted" style={{ fontSize: '11px' }}>Paguaj kur të marrësh librin</small>
                    </div>
                  </div>
                  <div 
                    className={`p-3 border-2 rounded-3 d-flex align-items-center transition-all ${paymentMethod === 'paypal' ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`} 
                    onClick={() => setPaymentMethod('paypal')} 
                    style={{ cursor: 'pointer' }}
                  >
                    <FaCcPaypal className="me-3 text-primary fs-4" />
                    <div>
                      <div className="fw-bold small">PayPal / Kartë</div>
                      <small className="text-muted" style={{ fontSize: '11px' }}>Pagesë e shpejtë dhe e sigurt</small>
                    </div>
                  </div>
                </div>

                {cartItems.length > 0 && (
                  paymentMethod === 'cash' ? (
                    <button 
                      className="btn btn-success btn-lg w-100 py-3 fw-bold rounded-pill shadow-sm" 
                      onClick={() => processOrder()}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm me-2"></span>
                      ) : "PËRFUNDO POROSINË"}
                    </button>
                  ) : (
                    <div className="paypal-button-container">
                      <PayPalButtons 
                        style={{ layout: "vertical", shape: "pill", label: "pay" }}
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [{
                              amount: { value: subtotal.toFixed(2) }
                            }]
                          });
                        }}
                        onApprove={(data, actions) => {
                          return actions.order.capture().then((details) => {
                            processOrder(details);
                          });
                        }}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default Cart;