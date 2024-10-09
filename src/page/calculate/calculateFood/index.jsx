import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { Form, Input, Select } from "antd";

function CalculateFood() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ponds, setPonds] = useState([]);
  useEffect(() => {
    const fetchPonds = async () => {
      try {
        const response = await api.get("pond");
        console.log(response.data);
        setPonds(response.data);
      } catch (error) {
        setError(error);
      }
    };
    fetchPonds();
  }, []);
  const handleSubmit = async (values) => {
    try {
      const response = await api.post("koifood", values);
      alert(
        "your fish should eat " +
          Math.round(response.data.result * 100) / 100 +
          " garams of food a day"
      );
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Calculate Food</h1>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Temperature (1-30)"
          name="temperature"
          rules={[{ required: true }]}
        >
          <Input type="number" defaultValue="1" min="1" max="30" />
        </Form.Item>
        <Form.Item
          label="Choose Pond"
          name="pondID"
          rules={[{ required: true }]}
        >
          <Select
            defaultValue={ponds[0]?.id}
            style={{ width: 120 }}
            onChange={(value) => console.log(value)}
          >
            {ponds.map((pond) => (
              <Select.Option key={pond.pondID} value={pond.pondID}>
                {pond.pondName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <button type="submit">Calculate Food</button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CalculateFood;
