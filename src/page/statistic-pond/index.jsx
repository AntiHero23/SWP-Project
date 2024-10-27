import React, { useState, useEffect } from "react";
import { Form, Select, Button, Radio } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
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
  const [selectedType, setSelectedType] = useState("temp");
  const [waterStandard, setWaterStandard] = useState(null);
  const [highValue, setHighValue] = useState(null);
  const [lowValue, setLowValue] = useState(null);

  const typeKeyMapping = {
    temp: "waterReportTemperature",
    dissolvedOxygen: "waterReportOxygen",
    pH: "waterReport_pH",
    hardness: "waterReportHardness",
    ammonia: "waterReportAmmonia",
    nitrite: "waterReportNitrite",
    nitrate: "waterReportNitrate",
    carbonate: "waterReportCarbonate",
    salt: "waterReportSalt",
    carbonDioxide: "waterReportCarbonDioxide",
  };

  const standardKeyMapping = {
    temp: { min: "minTempStandard", max: "maxTempStandard" },
    dissolvedOxygen: { min: "minOxygenStandard", max: "maxOxygenStandard" },
    pH: { min: "min_pH_Standard", max: "max_pH_Standard" },
    hardness: { min: "minHardnessStandard", max: "maxHardnessStandard" },
    ammonia: { min: "minAmmoniaStandard", max: "maxAmmoniaStandard" },
    nitrite: { min: "minNitriteStandard", max: "maxNitriteStandard" },
    nitrate: { min: "minNitrateStandard", max: "maxNitrateStandard" },
    carbonate: { min: "minCarbonateStandard", max: "maxCarbonateStandard" },
    salt: { min: "minSaltStandard", max: "maxSaltStandard" },
    carbonDioxide: { min: "minCarbonDioxideStandard", max: "maxCarbonDioxideStandard" },
  };

  const fetchPonds = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("pond");
      console.log("Fetched ponds:", data);
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
      console.log("Fetched water report:", data);
      setWaterReport(data || []);
    } catch (error) {
      console.error("Error fetching water report:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWaterStandard = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/viewall/waterstandard");
      console.log("Fetched water standard:", data.result[0]);
      setWaterStandard(data.result[0]);
    } catch (error) {
      console.error("Error fetching water standard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    if (!values.pond) return;
    console.log("Form submitted with values:", values);
    await fetchWaterReport(values.pond);
    
    const minKey = standardKeyMapping[selectedType].min;
    const maxKey = standardKeyMapping[selectedType].max;
    const highStandard = waterStandard ? waterStandard[maxKey] : null;
    const lowStandard = waterStandard ? waterStandard[minKey] : null;

    console.log("High standard:", highStandard);
    console.log("Low standard:", lowStandard);
    setLowValue(highStandard ? highStandard : null);
    setHighValue(lowStandard ? lowStandard : null);
  };

  useEffect(() => {
    console.log("Fetching ponds and water standard...");
    fetchPonds();
    fetchWaterStandard();
  }, []);

  useEffect(() => {

    if (waterReport.length > 0 && waterStandard) {
      const reportMap = {};
      waterReport.forEach((report) => {
        const dateKey = dayjs(report.waterReportUpdatedDate).format("YYYY-MM-DD");
        reportMap[dateKey] = report;
      });
      console.log("Mapped water report by date:", reportMap);

      const sortedDates = Object.keys(reportMap).sort((a, b) => dayjs(a).diff(dayjs(b)));
      const interpolatedData = [];
      let lastReportedValue = null;

      // Iterate over sorted dates and fill in gaps
      for (let i = 0; i < sortedDates.length; i++) {
        const currentDateKey = sortedDates[i];
        const report = reportMap[currentDateKey];
        const currentKey = typeKeyMapping[selectedType];
        let currentValue = report ? report[currentKey] : null;

        // Ensure currentValue is parsed as a number
        currentValue = currentValue !== null ? parseFloat(currentValue) : null;

        const minKey = standardKeyMapping[selectedType].min;
        const maxKey = standardKeyMapping[selectedType].max;
        const lowValueFromStandard = waterStandard[minKey] !== undefined ? parseFloat(waterStandard[minKey]) : null;
        const highValueFromStandard = waterStandard[maxKey] !== undefined ? parseFloat(waterStandard[maxKey]) : null;

        // If there's a reported value, use it
        if (currentValue !== null) {
          lastReportedValue = Math.round(currentValue * 100) / 100; // Round to 2 decimal points
          interpolatedData.push({
            waterReportUpdatedDate: currentDateKey,
            value: lastReportedValue,
            lowValue: Math.round(lowValueFromStandard * 100) / 100,
            highValue: Math.round(highValueFromStandard * 100) / 100,
          });
        } else if (lastReportedValue !== null) {
          // Interpolate between last reported value and the next report
          const nextDateKey = sortedDates[i + 1];
          if (nextDateKey) {
            const nextValue = reportMap[nextDateKey][currentKey];
            const nextParsedValue = nextValue !== undefined ? parseFloat(nextValue) : null;

            if (nextParsedValue !== null) {
              const daysDifference = dayjs(nextDateKey).diff(dayjs(currentDateKey), 'day');

              // Calculate interpolated values for each day between last and next
              const step = (nextParsedValue - lastReportedValue) / (daysDifference + 1); // Include the current day
              for (let j = 1; j <= daysDifference; j++) {
                const interpolatedValue = Math.round((lastReportedValue + step * j) * 100) / 100;
                const interpolatedDate = dayjs(currentDateKey).add(j, 'day').format("YYYY-MM-DD");
                interpolatedData.push({
                  waterReportUpdatedDate: interpolatedDate,
                  value: interpolatedValue,
                  lowValue: Math.round(lowValueFromStandard * 100) / 100,
                  highValue: Math.round(highValueFromStandard * 100) / 100,
                });
              }
            }
          }
        }
      }

      console.log("Final interpolated chart data:", interpolatedData);
      setChartData(interpolatedData);
    }
  }, [waterReport, selectedDate, selectedType, waterStandard]);

  const handleDateChange = (event) => {
    const dateString = event.target.value;
    const date = dayjs(dateString, "YYYY-MM");
    console.log("Selected date:", dateString);
    setSelectedDate(date);
  };

  const handleTypeChange = (event) => {
    setLoading(true);
    const newType = event.target.value;
    console.log("Selected type:", newType);
    setSelectedType(newType);

    const minKey = standardKeyMapping[newType].min;
    const maxKey = standardKeyMapping[newType].max;

    console.log("Standard values for type:", {
      min: waterStandard ? waterStandard[minKey] : null,
      max: waterStandard ? waterStandard[maxKey] : null,
    });

    setLowValue(waterStandard ? waterStandard[minKey] : null);
    setHighValue(waterStandard ? waterStandard[maxKey] : null);
    setLoading(false);
  };

  return (
    <>
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item name="pond" label="Select Pond" rules={[{ required: true }]}>
          <Select loading={loading}>
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

      <Radio.Group value={selectedType} onChange={handleTypeChange}>
        <Radio.Button value="temp">Temperature</Radio.Button>
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
    </>
  );
  
}

export default StatisticsPond;

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
