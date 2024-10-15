import React, { useState, useEffect } from "react";
import api from "../../../config/axios";
import {
  Row,
  Col,
  Slider,
  InputNumber,
  Space,
  Select,
  Button,
  Form,
} from "antd";
import "./index.scss";

function CalculateSalt() {
  const [ponds, setPonds] = useState([]);
  const [selectedPond, setSelectedPond] = useState("");
  const [currentSalt, setCurrentSalt] = useState(0);
  const [expectSalt, setExpectSalt] = useState(0);
  const [waterChange, setWaterChange] = useState(0);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    const fetchPonds = async () => {
      try {
        const response = await api.get("pond");
        console.log(response.data);
        setPonds(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPonds();
  }, []);

  const handlePondChange = (value) => {
    setSelectedPond(value);
  };
  const handleSliderChange = (value) => {
    setCurrentSalt(value);
  };

  const handleInputNumberChange = (value) => {
    setCurrentSalt(value);
  };

  const calWhenCurrentSalt = async (values) => {
    try {
      const response = await api.post("salt/per-water-change", values);
      console.log(response.data);
      setAlert("Number of water change should be " + response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const calWhenExpectSaltAndWaterChange = async (values) => {
    try {
      const [ExpSaltresponse, WaterChangeresponse] = await Promise.all([
        api.post("salt/calculateSalt", values),
        api.post("salt/calculateSalt-per-water-change", values),
      ]);
      setAlert(
        "Amount of Salt : " +
          ExpSaltresponse.data +
          " kg" +
          " and Per water change (refill) " +
          WaterChangeresponse.data +
          " kg"
      );
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = async (values) => {
    values.currentSalt = currentSalt;
    values.expectSalt = expectSalt;
    values.waterChange = waterChange;
    console.log("Received values of form: ", values);
    if (values.currentSalt > values.expectSalt) {
      calWhenCurrentSalt(values);
    } else {
      calWhenExpectSaltAndWaterChange(values);
    }
  };

  return (
    <div className="calc-salt-page">
      <div className="salt-calc-container">
        <h1 className="salt-title" style={{ textAlign: "center" }}>
          Calculate Salt
        </h1>
        <Form
          name="calculate-salt"
          layout="vertical"
          style={{ maxWidth: 500, margin: "auto" }}
          onFinish={onFinish}
        >
          <Form.Item
            label={`Pond : ${
              selectedPond
                ? ponds.find((p) => p.pondID === selectedPond).pondName
                : ""
            } (${
              selectedPond
                ? ponds.find((p) => p.pondID === selectedPond).volume
                : 0
            } L)`}
            name="pondID"
            rules={[{ required: true, message: "Please select pond" }]}
          >
            <Select
              placeholder="Select Pond"
              value={selectedPond}
              onChange={handlePondChange}
            >
              {ponds.map((pond) => (
                <Select.Option key={pond.pondID} value={pond.pondID}>
                  {pond.pondName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label={`Current Salt: ${currentSalt}%`} name="currentSalt">
            <Row>
              <Col span={12}>
                <Slider
                  min={0}
                  max={2}
                  onChange={(value) => setCurrentSalt(value)}
                  value={currentSalt}
                  step={0.01}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0}
                  max={2}
                  style={{
                    margin: "0 16px",
                  }}
                  step={0.01}
                  value={currentSalt}
                  onChange={handleInputNumberChange}
                />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label={`Expect Salt: ${expectSalt}%`} name="expectSalt">
            <Row>
              <Col span={12}>
                <Slider
                  min={0}
                  max={2}
                  onChange={(value) => setExpectSalt(value)}
                  value={expectSalt}
                  step={0.01}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0}
                  max={2}
                  style={{
                    margin: "0 16px",
                  }}
                  step={0.01}
                  value={expectSalt}
                  onChange={(value) => setExpectSalt(value)}
                />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            label={`Water Change: (${
              selectedPond
                ? (
                    (ponds.find((p) => p.pondID === selectedPond).volume *
                      waterChange) /
                    100
                  ).toFixed(0)
                : 0
            } L)`}
            name="waterchangePer"
          >
            <Row>
              <Col span={12}>
                <Slider
                  min={0}
                  max={100}
                  value={waterChange}
                  onChange={(value) => setWaterChange(value)}
                  step={1}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0}
                  max={100}
                  style={{
                    margin: "0 16px",
                  }}
                  step={1}
                  value={waterChange}
                  onChange={(value) => setWaterChange(value)}
                />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Calculate
              </Button>
            </Space>
          </Form.Item>
        </Form>
        {alert && <h1 className="salt-result">{alert}</h1>}
      </div>
    </div>
  );
}

export default CalculateSalt;
