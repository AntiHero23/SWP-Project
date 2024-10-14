import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { Button, Form, Input, Radio, Select } from "antd";
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
  const [Food, setFood] = useState("");
  const [tempRules, setTempRules] = useState([
    { required: true, message: "Please select temperature" },
  ]);

  useEffect(() => {
    const fetchPonds = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("pond");
        setPonds(response.data);
        setIsLoading(false);
      } catch (error) {
        setError(error);
      }
    };
    const fetchTemp = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("tempcoef/viewall");
        setTemp(response.data.result);
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
    console.log(pond);
    setTotalWeight(pond.totalWeight);
  };

  const handleTempChange = (value) => {
    console.log(value);
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
    console.log(values);
    try {
      const response = await api.post("koifood", values);
      console.log(response.data.result);
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
        {!isLoading && (
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
              <button type="submit">Click Here To Calculate</button>
            </Form.Item>
            <Form.Item
              shouldUpdate={(prevValues, curValues) => prevValues !== curValues}
            >
              <Button
                type="button"
                disabled={!(selectedPond && selectedTemp && selectedGrowth)}
                onClick={() => {
                  navigate("/koiFoodList", {
                    state: {
                      pondId: selectedPond,
                      temperature: temp.find((t) => t.tempID === selectedTemp)
                        .tempTo,
                      growth: selectedGrowth,
                    },
                  });
                }}
              >
                Detail
              </Button>
            </Form.Item>
          </Form>
        )}
        {Food && (
          <div className="result">
            <h2>Recommended food for this pond: {Food} g/day</h2>
          </div>
        )}
      </div>
    </div>
  );
}
export default CalculateFood;
