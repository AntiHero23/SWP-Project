import React, { useState, useEffect } from "react";
import { Form, Select, Button, Radio } from "antd";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import api from "../../config/axios";
import dayjs from "dayjs";

function Statistic() {
  const [form] = Form.useForm();
  const [kois, setKois] = useState([]);
  const [koiReport, setKoiReport] = useState([]);
  const [filteredKoiReport, setFilteredKoiReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedType, setSelectedType] = useState("weight");
  const [koiStandard, setKoiStandard] = useState(null);

  // Fetch koi list
  const fetchKois = async () => {
    setLoading(true);
    try {
      console.log("Fetching koi list...");
      const { data } = await api.get("koifish");
      console.log("Koi list fetched:", data);
      setKois(data);
    } catch (error) {
      console.error("Error fetching koi list:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch koi report data
  const fetchKoiReport = async (koiFishID) => {
    setLoading(true);
    try {
      console.log(`Fetching koi report for koiFishID: ${koiFishID}`);
      const { data } = await api.get(`koireport/koiReports/${koiFishID}`);
      console.log("Koi report fetched:", data.result);
      setKoiReport(data.result || []);
    } catch (error) {
      console.error("Error fetching koi report:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKoiStandard = async (koiFishID, selectedDate) => {
    const isoDate = dayjs(selectedDate).startOf("month").toISOString();
    try {
      console.log(`Fetching koi standard for koiFishID: ${koiFishID} on date: ${isoDate}`);
      const response = await api.post("/statistic/koistandard", {
        koiFishID,
        date: isoDate,
      });
      console.log("Koi standard fetched:", response.data.result);
      setKoiStandard(response.data.result); // Store koi standard data
    } catch (error) {
      console.error("Error fetching koi standard data:", error);
    }
  };

  const handleSubmit = async (values) => {
    if (!values.koi) return;
    console.log("Form submitted with values:", values);
    await fetchKoiReport(values.koi);
    await fetchKoiStandard(values.koi, selectedDate);
  };

  useEffect(() => {
    fetchKois();
  }, []);

  // Linear interpolation function
  const interpolate = (startDate, endDate, startValue, endValue) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const daysBetween = end.diff(start, "day");

    const interpolatedData = [];
    for (let i = 0; i <= daysBetween; i++) {
      const currentDay = start.add(i, "day").format("YYYY-MM-DD");
      const interpolatedValue = startValue + ((endValue - startValue) / daysBetween) * i;
      interpolatedData.push({ updateDate: currentDay, value: interpolatedValue });
    }
    return interpolatedData;
  };

  useEffect(() => {
    if (koiReport.length > 0 && koiStandard) {
      const selectedMonth = selectedDate.month();
      const selectedYear = selectedDate.year();
      const startOfMonth = dayjs(selectedDate).startOf("month").format("YYYY-MM-DD");
      const endOfMonth = dayjs(selectedDate).endOf("month").format("YYYY-MM-DD");
  
      console.log("Start of month:", startOfMonth, "End of month:", endOfMonth);
  
      const sortedReports = koiReport
        .filter((report) => {
          const reportDate = dayjs(report.updateDate);
          return reportDate.month() === selectedMonth && reportDate.year() === selectedYear;
        })
        .sort((a, b) => new Date(a.updateDate) - new Date(b.updateDate));
  
      console.log("Filtered and sorted koi report:", sortedReports);
  
      let interpolatedChartData = [];
      const existingDates = new Set(sortedReports.map(report => report.updateDate));
  
      // Add existing reports to final chart data
      sortedReports.forEach(report => {
        interpolatedChartData.push({
          updateDate: report.updateDate,
          value: report[selectedType],
          lowValue: null, // Will be filled later
          highValue: null // Will be filled later
        });
      });
  
      // Interpolate koi data for every day of the month
      let lastDate = startOfMonth;
      let lastValue = sortedReports[0] ? sortedReports[0][selectedType] : koiStandard[`low${capitalize(selectedType)}`];
  
      // Interpolate from start of the month to the first report
      if (sortedReports.length > 0 && dayjs(sortedReports[0].updateDate).isAfter(startOfMonth)) {
        const firstReport = sortedReports[0];
        const initialInterpolatedSegment = interpolate(
          startOfMonth,
          firstReport.updateDate,
          firstReport[selectedType],
          firstReport[selectedType]
        );
        initialInterpolatedSegment.forEach(dataPoint => {
          if (!existingDates.has(dataPoint.updateDate)) {
            interpolatedChartData.push(dataPoint);
          }
        });
        lastDate = firstReport.updateDate;
        lastValue = firstReport[selectedType];
      }
  
      // Interpolate between reports
      for (let i = 0; i < sortedReports.length - 1; i++) {
        const currentReport = sortedReports[i];
        const nextReport = sortedReports[i + 1];
  
        const interpolatedSegment = interpolate(
          currentReport.updateDate,
          nextReport.updateDate,
          currentReport[selectedType],
          nextReport[selectedType]
        );
  
        interpolatedSegment.forEach(dataPoint => {
          if (!existingDates.has(dataPoint.updateDate)) {
            interpolatedChartData.push(dataPoint);
          }
        });
        lastDate = nextReport.updateDate;
        lastValue = nextReport[selectedType];
      }
  
      // Interpolate from the last report to the end of the month
      if (dayjs(lastDate).isBefore(endOfMonth)) {
        const finalInterpolatedSegment = interpolate(
          lastDate,
          endOfMonth,
          lastValue,
          lastValue // End with the last value, not the high value
        );
        finalInterpolatedSegment.forEach(dataPoint => {
          if (!existingDates.has(dataPoint.updateDate)) {
            interpolatedChartData.push(dataPoint);
          }
        });
      }
  
      // Interpolate low/high values
      const lowValueStart = koiStandard[`low${capitalize(selectedType)}`];
      const highValueStart = koiStandard[`hi${capitalize(selectedType)}`];
      const lowValueEnd = koiStandard[`low${capitalize(selectedType)}`] + (selectedType === "weight" ? 1.0 : 0.6);
      const highValueEnd = koiStandard[`hi${capitalize(selectedType)}`] + (selectedType === "weight" ? 1.0 : 0.6);
  
      const interpolatedLow = interpolate(startOfMonth, endOfMonth, lowValueStart, lowValueEnd);
      const interpolatedHigh = interpolate(startOfMonth, endOfMonth, highValueStart, highValueEnd);
  
      console.log("Low values interpolated:", interpolatedLow);
      console.log("High values interpolated:", interpolatedHigh);
  
      // Merge interpolated koi data with low and high values
      const fullChartData = interpolatedChartData.map(dataPoint => ({
        updateDate: dataPoint.updateDate,
        value: dataPoint.value,
        lowValue: null,
        highValue: null,
      }));
  
      // Set low and high values for existing data points
      fullChartData.forEach(dataPoint => {
        const date = dataPoint.updateDate;
        const lowValueIndex = interpolatedLow.findIndex(low => low.updateDate === date);
        const highValueIndex = interpolatedHigh.findIndex(high => high.updateDate === date);
  
        if (lowValueIndex !== -1) {
          dataPoint.lowValue = interpolatedLow[lowValueIndex].value;
        }
        if (highValueIndex !== -1) {
          dataPoint.highValue = interpolatedHigh[highValueIndex].value;
        }
      });
  
      console.log("Final chart data:", fullChartData);
      setChartData(fullChartData);
    }
  }, [koiReport, koiStandard, selectedDate, selectedType]);

  // Helper function to capitalize string
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  // Handle date selection for month/year
  const handleDateChange = (event) => {
    const dateString = event.target.value;
    const date = dayjs(dateString, "YYYY-MM");
    console.log("Selected date:", date.format("YYYY-MM"));
    setSelectedDate(date);
  };

  // Handle type selection
  const handleTypeChange = (event) => {
    console.log("Selected type:", event.target.value);
    setSelectedType(event.target.value);
  };

  return (
    <>
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

      {/* Render chart using Recharts */}
      {chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="updateDate" />
            <YAxis tickFormatter={(value) => value.toFixed(2)} /> {/* Format YAxis values */}
            <Tooltip formatter={(value) => value.toFixed(2)} /> {/* Format Tooltip values */}
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

export default Statistic;
