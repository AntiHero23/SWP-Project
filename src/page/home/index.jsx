import React from "react";
import KoiPond from "../../assets/koipond.webp";
import KoiMisc from "../../assets/PondStats.png";
import KoiChart from "../../assets/KoiChart.png";
import CalcFood from "../../assets/CalcFood.png";
import CalcSalt from "../../assets/CalcSalt.png";
import "./index.scss";
import { Col, Row } from "antd";

function Home() {
  return (
    <div className="home-container">
      <div className="home-content-container">
        <h1 className="title">Sunside Koi Care</h1>
        <Row className="home-container-sub" align="middle" gutter={30}>
          <Col span={12}>
            <img src={KoiPond} alt="Koi Pond Background" />
          </Col>
          <Col span={12}>
            <h1>Your Koi, Our Priority</h1>
            <p>
              Welcome to Sunside Koi Care, the all-in-one platform for managing
              and nurturing your koi pond. With our advanced system, monitor
              water quality, koi growth, and ensure your koi
              thrive in a perfect environment. Whether you're a seasoned
              hobbyist or just starting, we make koi care easy and efficient.
            </p>
          </Col>
        </Row>
        <Row className="home-container-sub" align="middle" gutter={30}>
          <Col span={12}>
            <h1>Monitor Your Pond Health</h1>
            <p>
              Track essential water parameters like temperature, pH levels, and
              oxygen concentration,ect...ensuring your koi are
              always swimming in optimal conditions.
            </p>
          </Col>
          <Col span={12}>
            <img src={KoiMisc} alt="Pond Monitoring" />
          </Col>
        </Row>

        <Row className="home-container-sub" align="middle" gutter={30}>
        <Col span={12}>
            <img src={KoiChart} alt="Koi Chart" />
          </Col>
          <Col span={12}>
            <h1>Track Your Koi's Growth!</h1>
            <p>
            <p>
              Keep track of your koi's health with our easy-to-use growth chart.
              Monitor their progress and detect any changes in their health. 
              Keep them healthy and thriving.
            </p>
            </p>
          </Col>
        </Row>
        <Row className="home-container-sub" align="middle" gutter={30}>
        <Col span={12}>
            <h1>Measure How much food you need</h1>
            <p>
            <p>
              With our food calculator, you can easily calculate how much food you need for your koi. Our advanced food              requirements will ensure that your koi are getting enough food.
            </p>
            </p>
          </Col>
          <Col span={12}>
            <img src={CalcFood} alt="Koi Chart" />
          </Col>
          
        </Row>
        <Row className="home-container-sub" align="middle" gutter={30}>
        <Col span={12}>
            <img src={CalcSalt} alt="Koi Chart" />
          </Col>
          <Col span={12}>
            <h1>Calculate Your Pond's Salt When you Change your Water</h1>
            <p>
            <p>
              With our salt calculator, you can easily calculate how much salt you need for your koi! With our salt calculator, you can easily calculate how much salt you need for your koi. Never again will you have to worry about miscalculatingyour koi's water quality!
            </p>
            </p>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Home;
