import React, { useState, useEffect } from "react";
import { Col, Row, Button, Modal } from "antd";
import KoiPond from "../../assets/koipond.webp";
import KoiMisc from "../../assets/koimisc.webp";
import KoiFeed from "../../assets/koifeed.jpg";
import "./index.scss";

function Home() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Show modal when component mounts
  useEffect(() => {
    setIsModalVisible(true);
  }, []);

  return (
    <div className="home-container">
      <Modal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
        className="hero-modal"
        closable={true}
        maskClosable={true}
      >
        <div className="hero-content">
          <h1 className="title">Sunside Koi Care</h1>
          <p className="subtitle">Professional Koi Pond Management System</p>
          <Button 
            type="primary" 
            size="large" 
            className="cta-button"
            onClick={() => setIsModalVisible(false)}
          >
            Get Started Today
          </Button>
        </div>
      </Modal>

      <div className="features-section section-padding">
        <div className="section-wrapper">
          <h2 className="section-title">Why Choose Sunside Koi Care?</h2>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8}>
              <div className="feature-card">
                <h3>Real-time Monitoring</h3>
                <p>24/7 water quality tracking and instant alerts</p>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="feature-card">
                <h3>Smart Automation</h3>
                <p>Automated feeding and maintenance schedules</p>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="feature-card">
                <h3>Expert Support</h3>
                <p>Access to koi care specialists and community</p>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div className="home-container-1 section-padding">
        <div className="section-wrapper">
          <Row align="middle" gutter={[30, 40]}>
            <Col xs={24} lg={12}>
              <img src={KoiPond} alt="Koi Pond Background" className="section-image" />
            </Col>
            <Col xs={24} lg={12}>
              <h2 className="section-title">Your Koi, Our Priority</h2>
              <p className="section-text">
                Welcome to Sunside Koi Care, the all-in-one platform for managing
                and nurturing your koi pond. With our advanced system, monitor
                water quality, optimize feeding schedules, and ensure your koi
                thrive in a perfect environment.
              </p>
              <Button type="primary">Learn More</Button>
            </Col>
          </Row>
        </div>
      </div>

      <div className="home-container-2 section-padding">
        <div className="section-wrapper">
          <Row align="middle" gutter={[30, 40]}>
            <Col xs={24} lg={12} order={{ xs: 2, lg: 1 }}>
              <h2 className="section-title">Monitor Your Pond Health</h2>
              <p className="section-text">
                Track essential water parameters like temperature, pH levels, and
                oxygen concentration. Our system alerts you to any irregularities,
                ensuring your koi are always swimming in optimal conditions.
              </p>
              <Button type="primary">View Features</Button>
            </Col>
            <Col xs={24} lg={12} order={{ xs: 1, lg: 2 }}>
              <img src={KoiMisc} alt="Pond Monitoring" className="section-image" />
            </Col>
          </Row>
        </div>
      </div>

      <div className="home-container-3 section-padding">
        <div className="section-wrapper">
          <Row align="middle" gutter={[30, 40]}>
            <Col xs={24} lg={12}>
              <img src={KoiFeed} alt="Koi Feeding" className="section-image" />
            </Col>
            <Col xs={24} lg={12}>
              <h2 className="section-title">Automated Feeding and Care Scheduling</h2>
              <p className="section-text">
                Set up feeding schedules tailored to the needs of your koi. Our
                system ensures that your fish are getting the right amount of food
                at the right time, promoting healthy growth and vibrant color.
              </p>
              <Button type="primary">Start Scheduling</Button>
            </Col>
          </Row>
        </div>
      </div>

      <div className="cta-section section-padding">
        <div className="section-wrapper">
          <div className="cta-content">
            <h2>Ready to Transform Your Koi Care?</h2>
            <p>Join thousands of satisfied koi enthusiasts using Sunside Koi Care</p>
            <Button type="primary" size="large">
              Start Free Trial
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
