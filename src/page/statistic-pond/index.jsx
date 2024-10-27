import React, { useState, useEffect } from "react";
import { Form, Select, Button, Radio } from "antd";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import api from "../../config/axios";
import dayjs from "dayjs";
import "./index.scss";

function StatisticsPond() {
  const [form] = Form.useForm();
  const [ponds, setPonds] = useState([]);
  const [waterReport, setWaterReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedType, setSelectedType] = useState("temperature");
  const [waterStandard, setWaterStandard] = useState({
    waterStandardID: 3,
    standards: {
      temperature: { min: 0, max: 30 },
      dissolvedOxygen: { min: 7, max: 10 },
      pH: { min: 6.5, max: 9 },
      hardness: { min: 4, max: 15 },
      ammonia: { min: 0, max: 0.02 },
      nitrite: { min: 0, max: 50 },
      nitrate: { min: 0, max: 0.25 },
      carbonate: { min: 0, max: 20 },
      salt: { min: 0.1, max: 0.3 },
      carbonDioxide: { min: 1, max: 20 },
    },
  });

  const fetchPonds = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("pond");
      setPonds(data);
    } catch (error) {
      console.error("Error fetching pond list:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWaterReport = async (pondID) => {
    setLoading(true);
    try {
      const { data } = await api.get(`waterreport/view/${pondID}`);
      console.log("Water Report fetched:", data);
      setWaterReport(data || []);
      processWaterData(data);
    } catch (error) {
      console.error("Error fetching water report:", error);
    } finally {
      setLoading(false);
    }
  };

  const processWaterData = (data) => {
    const startOfMonth = dayjs(selectedDate).startOf('month');
    const endOfMonth = dayjs(selectedDate).endOf('month');

    // Create a map to hold data indexed by date
    const reportMap = {};
    let lastReport = null;
    let firstReportDate = null;

    data.forEach(report => {
        const dateKey = dayjs(report.waterReportUpdatedDate).format('YYYY-MM-DD');
        reportMap[dateKey] = report;
        
        // Track the first report date and last report value
        if (!firstReportDate || dayjs(report.waterReportUpdatedDate).isBefore(firstReportDate)) {
            firstReportDate = dayjs(report.waterReportUpdatedDate);
        }
        lastReport = report; // Update lastReport for later use
    });

    // Create an array to hold the interpolated chart data
    const interpolatedData = [];
    let lastReportedValue = null;

    for (let date = startOfMonth; date.isBefore(endOfMonth.add(1, 'day')); date = date.add(1, 'day')) {
        const dateKey = date.format('YYYY-MM-DD');
        const report = reportMap[dateKey];
        let currentValue = report ? report[selectedType] : null; // Use let here

        // Interpolation logic
        if (currentValue !== null) {
            // If there's a report, update lastReportedValue
            lastReportedValue = currentValue;
        } else if (lastReportedValue !== null) {
            // If no report, but we have a last value, use that
            currentValue = lastReportedValue;
        } else if (firstReportDate && date.isBefore(firstReportDate)) {
            // If before the first report date, use the first report value
            if (firstReportDate && reportMap[firstReportDate.format('YYYY-MM-DD')]) {
                currentValue = reportMap[firstReportDate.format('YYYY-MM-DD')][selectedType];
            }
        }
        
        // Add data to the interpolated data array
        interpolatedData.push({
            waterReportUpdatedDate: dateKey,
            value: currentValue,
            lowValue: waterStandard.standards[selectedType].min,
            highValue: waterStandard.standards[selectedType].max,
        });
    }

    setChartData(interpolatedData);
    console.log("Chart Data:", interpolatedData);
};


  const handleSubmit = async (values) => {
    if (!values.pond) return;
    await fetchWaterReport(values.pond);
  };

  const handleDateChange = (e) => {
    const selected = dayjs(e.target.value);
    setSelectedDate(selected);
    if (waterReport.length > 0) {
      processWaterData(waterReport);
    }
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    if (waterReport.length > 0) {
      processWaterData(waterReport);
    }
  };

  useEffect(() => {
    fetchPonds();
  }, []);

  return (
    <div className="pond-page">
      <div className="pond-container">
        <h1 className="page-title">Pond Statistics</h1>
  
        <Form form={form} onFinish={handleSubmit} className="form-container">
          <Form.Item name="pond" label="Pond">
            <Select placeholder="Select a Pond" loading={loading}>
              {ponds.map((pond) => (
                <Select.Option key={pond.pondID} value={pond.pondID}>
                  {pond.pondName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
  
          <Form.Item name="date" label="Month/Year">
            <input type="month" onChange={handleDateChange} />
          </Form.Item>
  
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
  
        <div className="radio-container">
          <Radio.Group value={selectedType} onChange={handleTypeChange}>
            <Radio.Button value="temperature">Temperature</Radio.Button>
            <Radio.Button value="dissolvedOxygen">Oxygen</Radio.Button>
            <Radio.Button value="pH">pH</Radio.Button>
            <Radio.Button value="hardness">Hardness</Radio.Button>
            <Radio.Button value="ammonia">Ammonia</Radio.Button>
            <Radio.Button value="nitrite">Nitrite</Radio.Button>
            <Radio.Button value="nitrate">Nitrate</Radio.Button>
            <Radio.Button value="carbonate">Carbonate</Radio.Button>
            <Radio.Button value="salt">Salt</Radio.Button>
            <Radio.Button value="carbonDioxide">Carbon Dioxide</Radio.Button>
          </Radio.Group>
        </div>
  
        <div className="chart-container">
          {chartData.length > 0 && (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="waterReportUpdatedDate" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#1890ff" name={capitalize(selectedType)} />
                <Line type="monotone" dataKey="lowValue" stroke="#00FF02" name="Low Value" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="highValue" stroke="#ff7300" name="High Value" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
  
}

export default StatisticsPond;

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
