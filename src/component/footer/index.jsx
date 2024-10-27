import React from "react";
import { Row, Col } from "antd";
import logo from "../../assets/icon.png";
import "./index.scss"; // Import the SCSS file
import { Navigate } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <Row className="footer-content">  
        <Col xs={8} className="footer-navigation">
          <ul>
            <li onClick={() => Navigate("/")}>Home</li>
            <li onClick={() => Navigate("/recommendation")}>Shopping</li>
            <li onClick={() => Navigate("/aboutUs")}>About Us</li>
            <li onClick={() => Navigate("/contact")}>Contact Us</li>
            <li onClick={() => Navigate("/blog")}>Blog</li>
          </ul>
        </Col>

        <Col xs={8} className="footer-logo">
          <img
            src={logo}
            alt="Koi Company Logo"
            className="header-left-logo"
            onClick={() => Navigate("/")}
          />
          <div className="header-left-title" onClick={() => Navigate("/")}>
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
