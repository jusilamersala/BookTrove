import React from 'react';
import './Cart.css';
import { FaTrashAlt, FaPlus, FaMinus, FaArrowLeft, FaFileInvoice } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext'; 
import axios from 'axios';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  // Llogaritja e shumës totale
  const subtotal = cartItems.reduce((acc, item) => acc + (item.cmimi * item.sasia), 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Shporta juaj është boshe!");
      return;
    }

    try {
      // Përgatitja e të dhënave për Backend
      const orderData = {
        items: cartItems.map(item => ({
          _id: item._id, 
          titulli: item.titulli,
          sasia: item.sasia,
          cmimi: item.cmimi,
          imazhi: item.imazhi
        })),
        total: subtotal
      };

      // Dërgimi i kërkesës te API
      const response = await axios.post(
        "http://localhost:5000/api/orders", 
        orderData, 
        { withCredentials: true } // E rëndësishme për të dërguar Token-in e logimit
      );
      
      if (response.status === 201 || response.status === 200) {
        
        // --- NDRYSHIMI PER FATURËN ---
        if (response.data.invoiceUrl) {
          // Hap faturën PDF në një tab të ri automatikisht
          const invoiceFullUrl = `http://localhost:5000${response.data.invoiceUrl}`;
          window.open(invoiceFullUrl, "_blank");
        }
        // -----------------------------

        alert("Porosia u krye me sukses! Fatura juaj po gjenerohet...");
        
        // Pastrojmë shportën pasi porosia u konfirmua
        clearCart(); 
      }
    } catch (error) {
      console.error("Gabim gjatë dërgimit të porosisë:", error.response?.data || error.message);
      
      // Mesazh gabimi nëse psh. stoku mbaron ndërkohë që klienti ishte në shportë
      const message = error.response?.data?.message || "Ndodhi një gabim gjatë procesimit të porosisë.";
      alert(message);
    }
  };

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header-nav">
          <Link to="/librat" className="back-link"><FaArrowLeft /> Vazhdo blerjen</Link>
          <h1>Shporta Juaj</h1>
        </div>

        <div className="row">
          {/* LISTA E PRODUKTEVE */}
          <div className="col-lg-8">
            <div className="cart-items-container">
              {cartItems.length > 0 ? (
                cartItems.map(item => (
                  <div key={item._id} className="cart-item-card shadow-sm border-0 mb-3 p-3 bg-white rounded">
                    <img src={item.imazhi} alt={item.titulli} className="cart-item-img" style={{ width: '80px', borderRadius: '5px' }} />
                    <div className="cart-item-details flex-grow-1 ms-3">
                      <h5 className="mb-1">{item.titulli}</h5>
                      <p className="text-muted small mb-0">{item.autori}</p>
                    </div>
                    
                    <div className="cart-item-quantity d-flex align-items-center gap-2">
                      <button 
                        className="btn btn-sm btn-outline-secondary" 
                        onClick={() => updateQuantity(item._id, -1)}
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="fw-bold">{item.sasia}</span>
                      <button 
                        className="btn btn-sm btn-outline-secondary" 
                        onClick={() => updateQuantity(item._id, 1)}
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>

                    <div className="cart-item-price fw-bold mx-4 text-primary">
                      {(item.cmimi * item.sasia).toFixed(2)}€
                    </div>

                    <button 
                      className="btn btn-link text-danger p-0" 
                      onClick={() => removeFromCart(item._id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ))
              ) : (
                <div className="empty-cart text-center p-5 bg-white rounded shadow-sm">
                   <p className="fs-4 text-muted">Shporta juaj është boshe.</p>
                   <Link to="/librat" className="btn btn-primary mt-3 px-4">Eksploro Librat</Link>
                </div>
              )}
            </div>
          </div>

          {/* PËRMBLEDHJA E POROSISË */}
          <div className="col-lg-4">
            <div className="cart-summary p-4 bg-white rounded shadow-sm">
              <h3 className="mb-4">Përmbledhja</h3>
              <div className="summary-row d-flex justify-content-between mb-2">
                <span>Nëntotali:</span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>
              <div className="summary-row d-flex justify-content-between mb-2 text-success">
                <span>Transporti:</span>
                <span>Falas</span>
              </div>
              <hr />
              <div className="summary-row total d-flex justify-content-between mb-4">
                <span className="h4">Totali:</span>
                <span className="h4 text-primary">{subtotal.toFixed(2)}€</span>
              </div>
              
              <button 
                className="btn btn-success btn-lg w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2" 
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                <FaFileInvoice /> Përfundo Porosinë
              </button>
              
              <div className="payment-methods mt-4 text-center">
                <p className="text-muted small mb-2">Mënyrat e pagesës:</p>
                <div className="payment-icons d-flex justify-content-center gap-3 fs-3 text-secondary">
                  <i className="fab fa-cc-visa"></i>
                  <i className="fab fa-cc-mastercard"></i>
                  <i className="fab fa-paypal"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;