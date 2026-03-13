import React, { useState } from 'react';
import './Cart.css';
import { FaTrashAlt, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [items, setItems] = useState([
    { id: 1, titulli: "Mjeshtri dhe Margarita", autori: "Mikhail Bulgakov", cmimi: 15.00, sasia: 1, imazhi: "https://via.placeholder.com/100" },
    { id: 2, titulli: "Sapiens", autori: "Yuval Noah Harari", cmimi: 18.50, sasia: 1, imazhi: "https://via.placeholder.com/100" }
  ]);

  const subtotal = items.reduce((acc, item) => acc + (item.cmimi * item.sasia), 0);

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header-nav">
          <Link to="/librat" className="back-link"><FaArrowLeft /> Vazhdo blerjen</Link>
          <h1>Shporta Juaj</h1>
        </div>

        <div className="row">
          {/* Lista e Produkteve */}
          <div className="col-lg-8">
            <div className="cart-items-container">
              {items.length > 0 ? (
                items.map(item => (
                  <div key={item.id} className="cart-item-card">
                    <img src={item.imazhi} alt={item.titulli} className="cart-item-img" />
                    <div className="cart-item-details">
                      <h3>{item.titulli}</h3>
                      <p>{item.autori}</p>
                    </div>
                    <div className="cart-item-quantity">
                      <button className="qty-btn"><FaMinus /></button>
                      <span>{item.sasia}</span>
                      <button className="qty-btn"><FaPlus /></button>
                    </div>
                    <div className="cart-item-price">
                      {(item.cmimi * item.sasia).toFixed(2)}€
                    </div>
                    <button className="remove-btn"><FaTrashAlt /></button>
                  </div>
                ))
              ) : (
                <div className="empty-cart">Shporta juaj është boshe.</div>
              )}
            </div>
          </div>

          {/* Përmbledhja e Porosisë */}
          <div className="col-lg-4">
            <div className="cart-summary">
              <h3>Përmbledhja</h3>
              <div className="summary-row">
                <span>Nëntotali:</span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>
              <div className="summary-row">
                <span>Transporti:</span>
                <span>Falas</span>
              </div>
              <hr />
              <div className="summary-row total">
                <span>Totali:</span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>
              <button className="checkout-btn">Përfundo Porosinë</button>
              
              <div className="payment-methods">
                <p>Mënyrat e pagesës:</p>
                <div className="payment-icons">
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