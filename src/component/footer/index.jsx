import React from "react";
import { Row, Col } from "antd";
import logo from "../../assets/icon.png";
import "./index.scss"; // Import the SCSS file
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <Row className="footer-content">
        <Col xs={8} className="footer-navigation">
          <ul>
            <li onClick={() => navigate("/")}>Home</li>
            <li onClick={() => navigate("/recommendation")}>Shopping</li>
            <li onClick={() => navigate("/aboutUs")}>About Us</li>
            <li onClick={() => navigate("/contact")}>Contact Us</li>
            <li onClick={() => navigate("/blog")}>Blog</li>
          </ul>
        </Col>

        <Col xs={8} className="footer-logo">
          <img
            src={logo}
            alt="Koi Company Logo"
            className="header-left-logo"
            onClick={() => navigate("/")}
          />
          <div className="header-left-title" onClick={() => navigate("/")}>
            SunSide Koi Care
          </div>
        </Col>

        <Col xs={8} className="footer-contact">
          <p className="footer-address">123 Pond Street, Water City, 12345</p>
          <p className="footer-email">
            <a href="mailto:contact@pondcompany.com">contact@pondcompany.com</a>
          </p>
          <p className="footer-copy">
            © 2024 Pond Company. All rights reserved.
          </p>
        </Col>
      </Row>
    </footer>
  );
}

export default Footer;
