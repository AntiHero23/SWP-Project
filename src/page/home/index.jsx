import React from "react";
import BannerBackground from "../../assets/background.png";
import "./index.scss";
import { Col, Row } from "antd";

function Home() {
  return (
    <div className="home-container">
      <h1 className="title">Sunside Koi Care</h1>
      <Row className="home-container-1" align="middle" gutter={30}>
        <Col span={12}>
          <img src={BannerBackground} alt="Koi Pond Background" />
        </Col>
        <Col span={12}>
          <h1>Your Koi, Our Priority</h1>
          <p>
            Welcome to Sunside Koi Care, the all-in-one platform for managing and nurturing your koi pond. With our advanced system, monitor water quality, optimize feeding schedules, and ensure your koi thrive in a perfect environment. Whether you're a seasoned hobbyist or just starting, we make koi care easy and efficient.
          </p>
        </Col>
      </Row>

      <Row className="home-container-2" align="middle" gutter={30}>
        <Col span={12}>
          <h1>Monitor Yur Pond Health</h1>
          <p>
            Track essential water parameters like temperature, pH levels, and oxygen concentration. Our system alerts you to any irregularities, so you can act before they become a problem, ensuring your koi are always swimming in optimal conditions.
          </p>
        </Col>
        <Col span={12}>
          <img src={BannerBackground} alt="Pond Monitoring" />
        </Col>
      </Row>

      <Row className="home-container-3" align="middle" gutter={30}>
        <Col span={12}>
          <img src={BannerBackground} alt="Koi Feeding" />
        </Col>
        <Col span={12}>
          <h1>Automated Feeding and Care Scheduling</h1>
          <p>
            Set up automated feeding schedules tailored to the needs of your koi. Our system ensures that your fish are getting the right amount of food at the right time, promoting healthy growth and vibrant color.
          </p>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
