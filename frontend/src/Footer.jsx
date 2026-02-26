import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-explore">
          <h4>Explore the Site</h4>
          <ul>
            <li>About Us</li>
            <li>Our Collection</li>
            <li>Events</li>
            <li>Connect With Us</li>
          </ul>
        </div>

        <div className="footer-follow">
          <h4>Follow Us</h4>
          <p>
            Na ndiqni në rrjetet sociale per libra të rinj,
            rekomandime dhe evente letrare.
          </p>

          <div className="footer-images">
            <img src="/images/follow1.jpg" alt="follow" />
            <img src="/images/follow2.jpg" alt="follow" />
            <img src="/images/follow3.jpg" alt="follow" />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-col">
          <h3>BookTrove</h3>
          <p>Qyteti i historive që jetojnë.</p>
        </div>

        <div className="footer-col">
          <h4>Contact Us</h4>
          <p>Tel: +355 xx xxx xxxx</p>
          <p>Email: info@booktrove.com</p>
        </div>

        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            <li>Book Sales</li>
            <li>Reading Events</li>
            <li>Author Meetups</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Visit Us</h4>
          <p>Tirana, Albania</p>
          <p>Mon – Sat: 09:00 – 20:00</p>
        </div>
      </div>

      <div className="footer-copy">
        © 2026 BookTrove | Privacy Policy | Site Credit
      </div>
    </footer>
  );
};

export default Footer;