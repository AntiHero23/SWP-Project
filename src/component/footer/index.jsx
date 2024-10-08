import React from 'react';
import { Row, Col } from 'antd';
import './index.scss'; // Import the SCSS file

function Footer() {
  return (
    <footer className="footer">
      <Row className="footer-content">
                <Col className="footer-contact" xs={24}>
          <p className="footer-address">123 Pond Street, Water City, 12345</p>
          <p className="footer-email">
            <a href="mailto:contact@pondcompany.com">contact@pondcompany.com</a>
          </p>
        </Col>
      </Row>


      <Row className="footer-bottom">
        <Col xs={24}>
          <p className="footer-copy">© 2024 Pond Company. All rights reserved.</p>
        </Col>
      </Row>
    </footer>
  );
}

export default Footer;
