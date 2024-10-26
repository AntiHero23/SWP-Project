import React from "react";
import { Col, Row, Button, Card } from "antd";
import "./index.scss";

function Home() {
  return (
    <div className="home-container">
      <div className="home-content-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1>Welcome to KoiMaster</h1>
            <p>Your Complete Koi Pond Management Solution</p>
            <Button type="primary" size="large">
              Get Started
            </Button>
          </div>
        </div>

        {/* Key Features */}
        <div className="feature-section">
          <h2>Smart Pond Management</h2>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className="feature-card">
                <h3>Water Quality Monitoring</h3>
                <p>
                  Real-time tracking of temperature, pH, and oxygen levels
                </p>
                <Button type="link">Learn More</Button>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="feature-card">
                <h3>Automated Feeding</h3>
                <p>Schedule and control feeding times with precision</p>
                <Button type="link">Learn More</Button>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="feature-card">
                <h3>Health Tracking</h3>
                <p>Monitor your koi's health and get instant alerts</p>
                <Button type="link">Learn More</Button>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Statistics Section */}
        <div className="statistics-section">
          <h2>Statistics</h2>
          <p>View your pond's performance over time</p>
          <Button type="primary" size="large">
            View Statistics
          </Button>
        </div>

        {/* Testimonials Section */}
        <div className="testimonials-section">
          <h2>What Our Customers Say</h2>
          <p>Real stories from satisfied koi enthusiasts</p>
          <Button type="primary" size="large">
            Read Testimonials
          </Button>
        </div>

        {/* Pricing Plans */}
        <div className="pricing-section">
          <h2>Choose Your Plan</h2>
          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} sm={24} md={8} lg={8}>
              <Card className="pricing-card">
                <h3>Basic</h3>
                <div className="price">$29/month</div>
                <ul>
                  <li>Basic water monitoring</li>
                  <li>Manual feeding controls</li>
                  <li>Email support</li>
                </ul>
                <Button type="primary" block>
                  Select Plan
                </Button>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8}>
              <Card className="pricing-card featured">
                <h3>Professional</h3>
                <div className="price">$49/month</div>
                <ul>
                  <li>Advanced monitoring</li>
                  <li>Automated feeding</li>
                  <li>24/7 support</li>
                  <li>Mobile app access</li>
                </ul>
                <Button type="primary" block>
                  Select Plan
                </Button>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8}>
              <Card className="pricing-card">
                <h3>Enterprise</h3>
                <div className="price">$99/month</div>
                <ul>
                  <li>Custom solutions</li>
                  <li>Multiple pond support</li>
                  <li>Priority support</li>
                  <li>API access</li>
                </ul>
                <Button type="primary" block>
                  Contact Sales
                </Button>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Call to Action */}
        <div className="cta-section">
          <div className="section-wrapper">
            <h2>Ready to Start?</h2>
            <p>Join thousands of satisfied koi enthusiasts</p>
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
