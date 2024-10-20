import React, { useState, useEffect } from "react";
import { Form, Select, Button, Tabs, Radio } from "antd";
import { Line } from "@ant-design/charts";
import api from "../../config/axios";
import { interpolateNumber } from "d3-interpolate";
import dayjs from "dayjs";

function Statistic() {
  const [form] = Form.useForm();
  const [kois, setKois] = useState([]);
  const [ponds, setPonds] = useState([]); // For storing pond data
  const [koiReport, setKoiReport] = useState([]);
  const [waterReport, setWaterReport] = useState([]); // Pond water report state
  const [filteredKoiReport, setFilteredKoiReport] = useState([]);
  const [filteredWaterReport, setFilteredWaterReport] = useState([]); // Filtered pond water data
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [waterChartData, setWaterChartData] = useState([]); // Pond chart data
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Default to current date
  const [selectedType, setSelectedType] = useState("weight"); // Default to koi's weight
  const [selectedWaterType, setSelectedWaterType] = useState(
    "waterReportTemperature"
  ); // Default to pond's temperature

  const [koiStandard, setKoiStandard] = useState([]);

  // Interpolation function for missing data
  const interpolateMissingData = (data) => {
    let filledData = [...data];

    for (let i = 1; i < filledData.length; i++) {
      if (
        filledData[i][selectedType] === null ||
        filledData[i][selectedType] === undefined
      ) {
        let prevIndex = i - 1;
        let nextIndex = i;

        // Find the next index with valid data
        while (
          nextIndex < filledData.length &&
          (filledData[nextIndex][selectedType] === null ||
            filledData[nextIndex][selectedType] === undefined)
        ) {
          nextIndex++;
        }

        if (nextIndex < filledData.length) {
          // Interpolate between valid previous and next data points
          const prevValue = filledData[prevIndex][selectedType] ?? 0;
          const nextValue = filledData[nextIndex][selectedType] ?? 0;
          const prevInstance = dayjs(filledData[prevIndex].updateDate);
          const nextInstance = dayjs(filledData[nextIndex].updateDate);
          const interpolateValue = interpolateNumber(prevValue, nextValue);

          for (let j = prevIndex + 1; j < nextIndex; j++) {
            const currentDate = dayjs(filledData[j].updateDate);
            const t =
              currentDate.diff(prevInstance, "day") /
              nextInstance.diff(prevInstance, "day");
            filledData[j][selectedType] = interpolateValue(t);
          }
        } else {
          // No valid future data, extrapolate based on the last known valid data
          const prevValue = filledData[prevIndex][selectedType] ?? 0;

          for (let j = prevIndex + 1; j < filledData.length; j++) {
            filledData[j][selectedType] = prevValue; // Use the last known value
          }

          // Break early since we're extrapolating to the end of the data
          break;
        }
      }
    }

    return filledData;
  };

  // Fetch koi list
  const fetchKois = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("koifish");
      setKois(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch koi report data
  const fetchKoiReport = async (koiFishID) => {
    setLoading(true);
    try {
      const { data } = await api.get(`koireport/koiReports/${koiFishID}`);
      setKoiReport(data.result || []);
    } catch (error) {
      console.error(error);
    } finally {
      console.log(koiReport);
      setLoading(false);
    }
  };

  const fetchPonds = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("pond"); // Assuming 'ponds' API returns pond data
      setPonds(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKoiStandard = async  () => {
    setLoading(true);
    try {
      const { data } = await api.get("koiStandard");
      setStandardDate(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWaterStandard = async  () => {
    setLoading(true);
    try {
      const { data } = await api.get("waterStandard");
      setStandardDate(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Fetch water report data for pond
  const fetchWaterReport = async (pondID) => {
    setLoading(true)
    try {
      const { data } = await api.get(`waterreport/view/${pondID}`);
      setWaterReport(data.result || []);
    } catch (error) {
      console.error(error);
    } finally {
      console.log(waterReport);
      setLoading(false);
    }
  };

  // Handle koi selection and form submission
  const handleSubmit = async (values) => {
    console.log(values);
    console.log("Selected Koi:", values.koi); // Log the selected koi to check if the ID is being captured
    if (!values.koi) {
      console.error("No koi selected, cannot fetch report.");
      return;
    }
    fetchKoiReport(values.koi);

    handleKoiStandard(values.koi, selectedDate);
  };

  const handleSubmitWater = async (values) => {
    console.log(values);
    console.log("Selected Pond:", values.pond); // Log the selected pond to check if the ID is being captured
    if (!values.pond) {
      console.error("No pond selected, cannot fetch report.");
      return;
    }
    fetchWaterReport(values.pond);
  };

  useEffect(() => {
    // Fetch koi and pond data on mount
    fetchKois();
    fetchPonds();
  }, []);

  useEffect(() => {
    // Handle Koi report data processing
    if (koiReport.length > 0) {
      const selectedMonth = selectedDate.month();
      const selectedYear = selectedDate.year();

      const filteredKoi = koiReport.filter((report) => {
        const reportDate = dayjs(report.updateDate);
        return (
          reportDate.month() === selectedMonth &&
          reportDate.year() === selectedYear
        );
      });
      

      // Fill missing days for the selected month
      const startOfMonth = dayjs(selectedDate).startOf("month");
      const endOfMonth = dayjs(selectedDate).endOf("month");

      let koiDaysInMonth = [];
      for (
        let day = startOfMonth;
        day.isBefore(endOfMonth);
        day = day.add(1, "day")
      ) {
        const existingReport = filteredKoi.find((report) =>
          dayjs(report.updateDate).isSame(day, "day")
        );
        if (existingReport) {
          koiDaysInMonth.push(existingReport);
        } else {
          koiDaysInMonth.push({
            updateDate: day.format("YYYY-MM-DD"),
            weight: null,
            length: null,
          });
        }
      }

      // Interpolate missing data for koi
      const interpolatedKoiData = interpolateMissingData(
        koiDaysInMonth,
        selectedType
      );
      setFilteredKoiReport(interpolatedKoiData);
      console.log(interpolatedKoiData);

      // Format data for Koi chart
      const koiChartData = interpolatedKoiData.map((report) => ({
        updateDate: dayjs(report.updateDate).format("YYYY-MM-DD"),
        [selectedType]: Math.round(report[selectedType] * 100) / 100,
      }));

      setChartData(koiChartData);
      console.log(koiChartData);
    }

    // Handle Pond water report data processing
    if (waterReport.length > 0) {
      const selectedMonth = selectedDate.month();
      const selectedYear = selectedDate.year();

      const filteredWater = waterReport.filter((report) => {
        const reportDate = dayjs(report.waterReportUpdatedDate);
        return (
          reportDate.month() === selectedMonth &&
          reportDate.year() === selectedYear
        );
      });

      // Fill missing days for the selected month
      const startOfMonth = dayjs(selectedDate).startOf("month");
      const endOfMonth = dayjs(selectedDate).endOf("month");

      let waterDaysInMonth = [];
      for (
        let day = startOfMonth;
        day.isBefore(endOfMonth);
        day = day.add(1, "day")
      ) {
        const existingReport = filteredWater.find((report) =>
          dayjs(report.waterReportUpdatedDate).isSame(day, "day")
        );
        if (existingReport) {
          waterDaysInMonth.push(existingReport);
        } else {
          waterDaysInMonth.push({
            waterReportUpdatedDate: day.format("YYYY-MM-DD"),
            waterReportTemperature: null,
            waterReportOxygen: null,
            waterReport_pH: null,
            waterReportHardness: null,
            waterReportAmmonia: null,
            waterReportNitrite: null,
            waterReportNitrate: null,
            waterReportCarbonate: null,
            waterReportSalt: null,
            waterReportCarbonDioxide: null,
          });
        }
      }

      // Interpolate missing data for water reports
      const interpolatedWaterData = interpolateMissingData(
        waterDaysInMonth,
        selectedWaterType
      );
      setFilteredWaterReport(interpolatedWaterData);
      console.log(interpolatedWaterData);

      // Format data for Pond chart
      const waterChartData = interpolatedWaterData.map((report) => ({
        waterReportUpdatedDate: dayjs(report.waterReportUpdatedDate).format(
          "YYYY-MM-DD"
        ),
        [selectedWaterType]: Math.round(report[selectedWaterType] * 100) / 100,
      }));

      setWaterChartData(waterChartData);
      console.log(waterChartData);
    }
  }, [koiReport, waterReport, selectedDate, selectedType, selectedWaterType]);

  const config = {
    data: chartData,
    xField: "updateDate",
    yField: selectedType,
    meta: {
      updateDate: { alias: "Date" },
      weight: { alias: "Weight" },
      length: { alias: "Length" },
    },
  };

  const pondChartConfig = {
    data: waterChartData,
    xField: "waterReportUpdatedDate",
    yField: selectedWaterType,
    meta: {
      waterReportUpdatedDate: { alias: "Date" },
      waterReportTemperature: { alias: "Temperature (°C)" },
      waterReportOxygen: { alias: "Oxygen (mg/L)" },
      waterReport_pH: { alias: "pH Level" },
      waterReportHardness: { alias: "Hardness (GH)" },
      waterReportAmmonia: { alias: "Ammonia (mg/L)" },
      waterReportNitrite: { alias: "Nitrite (mg/L)" },
      waterReportNitrate: { alias: "Nitrate (mg/L)" },
      waterReportCarbonate: { alias: "Carbonate (KH)" },
      waterReportSalt: { alias: "Salt (mg/L)" },
      waterReportCarbonDioxide: { alias: "Carbon Dioxide (mg/L)" },
      // Add meta for the other water report attributes...
    },
  };

  // Handle date selection for month/year
  const handleDateChange = (event) => {
    const dateString = event.target.value; // Get the string in 'YYYY-MM' format
    const date = dayjs(dateString, "YYYY-MM"); // Convert it to a dayjs object
    setSelectedDate(date); // Set the selected date as a dayjs object
  };

  // Handle type selection
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    console.log(event.target.value);
  };

  // Handle water report type selection (e.g., temperature, pH, oxygen, etc.)
  const handleWaterTypeChange = (event) => {
    setSelectedWaterType(event.target.value);
    console.log(event.target.value);
  };

  const handleKoiStandard = async (koiFishID, selectedDate) => {
    const isoDate = dayjs(selectedDate).startOf("month").toISOString(); // Convert to ISO 8601 format
    
    try {
      const response = await api.post("/statistic/koistandard", {
        koiFishID, // Fixing the key capitalization
        date: isoDate, // Sending the date in ISO 8601 format
      });
      
      console.log(selectedDate, koiFishID);
      console.log("Koi standard data:", response.data);
      setKoiStandardData(response.data);
      // You can do something with the response, like updating the state
    } catch (error) {
      console.error("Error fetching koi standard data:", error);
    }
  };

  return (
    <Tabs defaultActiveKey="1" centered
    onTabClick={(key) => {
      if (key === "1") {
        handleTypeChange({ target: { value: "weight" } });
      } else if (key === "2") {
        handleTypeChange({ target: { value: "waterReportTemperature" } });
      }
    }}
    >
      <Tabs.TabPane tab="Koi Statistic" key="1">
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item name="koi" label="Koi">
            <Select placeholder="Select a Koi" loading={loading}>
              {kois.map((koi) => (
                <Select.Option key={koi.koiFishID} value={koi.koiFishID}>
                  {koi.koiName}
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
          <Radio.Button value="weight">Weight</Radio.Button>
          <Radio.Button value="length">Length</Radio.Button>
        </Radio.Group>

        {/* Chart for koi weight and length */}
        {chartData.length > 0 && <Line {...config} />}
      </Tabs.TabPane>

      <Tabs.TabPane tab="Pond Statistic" key="2">
        <Form form={form} onFinish={handleSubmitWater}>
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

        <Radio.Group value={selectedWaterType} onChange={handleWaterTypeChange}>
          <Radio.Button value="waterReportTemperature">
            Temperature
          </Radio.Button>
          <Radio.Button value="waterReportOxygen">Oxygen</Radio.Button>
          <Radio.Button value="waterReport_pH">pH</Radio.Button>
          <Radio.Button value="waterReportHardness">Hardness</Radio.Button>
          <Radio.Button value="waterReportAmmonia">Ammonia</Radio.Button>
          <Radio.Button value="waterReportNitrite">Nitrite</Radio.Button>
          <Radio.Button value="waterReportNitrate">Nitrate</Radio.Button>
          <Radio.Button value="waterReportCarbonate">Carbonate</Radio.Button>
          <Radio.Button value="waterReportSalt">Salt</Radio.Button>
          <Radio.Button value="waterReportCarbonDioxide">
            Carbon Dioxide
          </Radio.Button>
        </Radio.Group>

        {/* Chart for pond water data */}
        {waterChartData.length > 0 && <Line {...pondChartConfig} />}
      </Tabs.TabPane>
    </Tabs>
  );
}

export default Statistic;
