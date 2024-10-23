import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Radio,
  Row,
  Select,
  Slider,
} from "antd";
import "./index.scss";

function CalculateFood() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ponds, setPonds] = useState([]);
  const [temp, setTemp] = useState([]);
  const [selectedPond, setSelectedPond] = useState("");
  const [selectedTemp, setSelectedTemp] = useState("");
  const [totalWeight, setTotalWeight] = useState(0);
  const [selectedGrowth, setSelectedGrowth] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [Food, setFood] = useState("");
  const [tempRules, setTempRules] = useState([
    { required: true, message: "Please select temperature" },
  ]);
  const [hideForm, setHideForm] = useState(true);

  useEffect(() => {
    const fetchPonds = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("pond");
        setPonds(response.data || []);
        setIsLoading(false);
      } catch (error) {
        setError(error);
      }
    };
    const fetchTemp = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("tempcoef/viewall");
        setTemp(response.data.result || []);
        setIsLoading(false);
      } catch (error) {
        setError(error);
      }
    };
    fetchPonds();
    fetchTemp();
  }, []);

  const handlePondChange = (value) => {
    setSelectedPond(value);
    const pond = ponds.find((p) => p.pondID === value);

    setTotalWeight(pond.totalWeight);
  };
  const handleTempChange = (value) => {
    setSelectedTemp(value);
    setTempRules([]);
  };

  const handleGrowthChange = (value) => {
    setSelectedGrowth(value);
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    const selectedTempTo = temp.find((t) => t.tempID === selectedTemp).tempTo;
    values.temperature = selectedTempTo;

    try {
      const response = await api.post("koifood", values);
      setFood(response.data.result);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="calc-food-page">
      <div className="calc-container">
        <h1>Calculate Food</h1>
        <div style={{ marginBottom: 20 }}>
          <Checkbox
            onChange={() => {
              setHideForm(!hideForm);
              setFood("");
            }}
          >
            Expert Mode
          </Checkbox>
        </div>
        {!hideForm && (
          <>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontStyle: "italic", color: "#555" }}>
                <strong>Info about the Expert Mode:</strong> We still recommend
                using the preset food calculator! Use the expert mode only if
                you already have a lot of experience with koi and know what you
                are doing! The expert mode offers you customized setting options
                to determine what proportion of the total fish weight you want
                to feed. The total fish weight is the sum of the weights for
                each individual koi in the selected pond. The weight of an
                individual koi can either be approximated by its length or
                entered by you directly.
              </p>
            </div>
            <Form layout="vertical" style={{ maxWidth: 700, margin: "auto" }}>
              <Form.Item
                label={`Pond : ${
                  selectedPond
                    ? ponds.find((p) => p.pondID === selectedPond).pondName
                    : ""
                } (${totalWeight} g)`}
                name="pond"
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
              <Form.Item
                label={`Percentage : ${percentage}`}
                name="percentage"
                initialValue={0}
              >
                <Row>
                  <Col span={20}>
                    <Slider
                      min={0}
                      max={2.5}
                      value={percentage}
                      onChange={(value) => setPercentage(value)}
                      step={0.1}
                    />
                  </Col>
                </Row>
              </Form.Item>
              <Button
                type="primary"
                onClick={() => setFood(totalWeight * (percentage / 100))}
              >
                Submit
              </Button>
            </Form>
          </>
        )}

        {hideForm && (
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            style={{ maxWidth: 500, margin: "auto" }}
          >
            <Form.Item
              label={`Pond : ${
                selectedPond
                  ? ponds.find((p) => p.pondID === selectedPond).pondName
                  : ""
              } (${totalWeight} g)`}
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
            <Form.Item
              label="Temparature Coefficient"
              name="temperature"
              rules={tempRules}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                {temp.map((t) => (
                  <Button
                    key={t.tempID}
                    type={selectedTemp === t.tempID ? "primary" : "default"}
                    onClick={() => handleTempChange(t.tempID)}
                    style={{ margin: 5 }}
                    value={t.tempTo}
                  >
                    {t.tempFrom} - {t.tempTo}
                  </Button>
                ))}
              </div>
            </Form.Item>
            <Form.Item
              label="Desired growth"
              name="level"
              rules={[{ required: true, message: "Please select growth" }]}
            >
              <Radio.Group
                value={selectedGrowth}
                onChange={(e) => handleGrowthChange(e.target.value)}
              >
                {["Low", "Medium", "High"].map((growth) => (
                  <Radio.Button key={growth} value={growth}>
                    {growth}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="primary">
                Click Here To Calculate
              </Button>
            </Form.Item>
            <Form.Item
              shouldUpdate={(prevValues, curValues) => prevValues !== curValues}
            >
              <Button
                type="button"
                disabled={!(selectedPond && selectedTemp && selectedGrowth)}
                onClick={() =>
                  navigate(
                    "/koiFoodList/" +
                      `?pondID=${selectedPond}` +
                      `&temp=${
                        temp.find((t) => t.tempID === selectedTemp).tempTo
                      }` +
                      `&growth=${selectedGrowth}`
                  )
                }
              >
                Detail
              </Button>
            </Form.Item>
          </Form>
        )}
        {Food && (
          <div className="result">
            <h2>
              Recommended food for this pond: {Number(Food).toFixed(4)} g/day
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
export default CalculateFood;
