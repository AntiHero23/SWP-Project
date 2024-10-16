import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Tabs, DatePicker } from 'antd';
import { Line } from '@ant-design/charts';
import api from '../../config/axios';
import { interpolateNumber } from 'd3-interpolate';
import dayjs from 'dayjs';

function Statistic() {
  const [form] = Form.useForm();
  const [kois, setKois] = useState([]);
  const [koiReport, setKoiReport] = useState([]);
  const [filteredKoiReport, setFilteredKoiReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Default to current date

  // Fetch koi list
  const fetchKois = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('koifish');
      setKois(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Interpolation function for missing data
  const interpolateMissingData = (data) => {
    let filledData = [...data];
  
    for (let i = 1; i < filledData.length; i++) {
      if (
        filledData[i].weight === null ||
        filledData[i].weight === undefined ||
        filledData[i].length === null ||
        filledData[i].length === undefined
      ) {
        let prevIndex = i - 1;
        let nextIndex = i;
  
        // Find the next index with valid data
        while (
          nextIndex < filledData.length &&
          (filledData[nextIndex].weight === null ||
            filledData[nextIndex].weight === undefined ||
            filledData[nextIndex].length === null ||
            filledData[nextIndex].length === undefined)
        ) {
          nextIndex++;
        }
  
        if (nextIndex < filledData.length) {
          // Interpolate between valid previous and next data points
          const prevWeight = filledData[prevIndex]?.weight ?? 0;
          const nextWeight = filledData[nextIndex]?.weight ?? 0;
          const prevLength = filledData[prevIndex]?.length ?? 0;
          const nextLength = filledData[nextIndex]?.length ?? 0;
          const prevInstance = dayjs(filledData[prevIndex].updateDate);
          const nextInstance = dayjs(filledData[nextIndex].updateDate);
          const interpolateWeight = interpolateNumber(prevWeight, nextWeight);
          const interpolateLength = interpolateNumber(prevLength, nextLength);
  
          for (let j = prevIndex + 1; j < nextIndex; j++) {
            const currentDate = dayjs(filledData[j].updateDate);
            const t = currentDate.diff(prevInstance, 'day') / nextInstance.diff(prevInstance, 'day');
            filledData[j].weight = interpolateWeight(t);
            filledData[j].length = interpolateLength(t);
          }
        } else {
          // No valid future data, extrapolate based on the last known valid data
          const prevWeight = filledData[prevIndex]?.weight ?? 0;
          const prevLength = filledData[prevIndex]?.length ?? 0;
  
          for (let j = prevIndex + 1; j < filledData.length; j++) {
            filledData[j].weight = prevWeight; // Use the last known weight
            filledData[j].length = prevLength; // Use the last known length
          }
  
          // Break early since we're extrapolating to the end of the data
          break;
        }
      }
    }
  
    return filledData;
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
  };
  

  // Filter koi reports based on selected month and year
  useEffect(() => {
    if (koiReport.length > 0) {
      const selectedMonth = selectedDate.month();
      const selectedYear = selectedDate.year();
      
      const filtered = koiReport.filter((report) => {
        const reportDate = dayjs(report.updateDate);
        return reportDate.month() === selectedMonth && reportDate.year() === selectedYear;
      });

      // Fill missing days for the selected month
      const startOfMonth = dayjs(selectedDate).startOf('month');
      const endOfMonth = dayjs(selectedDate).endOf('month');

      let daysInMonth = [];
      for (let day = startOfMonth; day.isBefore(endOfMonth); day = day.add(1, 'day')) {
        const existingReport = filtered.find((report) => dayjs(report.updateDate).isSame(day, 'day'));
        if (existingReport) {
          daysInMonth.push(existingReport);
        } else {
          daysInMonth.push({
            updateDate: day.format('YYYY-MM-DD'),
            weight: null,
            length: null,
          });
        }
      }

      // Interpolate missing data for the days without reports
      const interpolatedData = interpolateMissingData(daysInMonth);
      setFilteredKoiReport(interpolatedData);
      console.log("Interpolated Data:", interpolatedData);

      // Format data for charting
      const chartData = interpolatedData.map((report) => ({
        updateDate: dayjs(report.updateDate).format('YYYY-MM-DD'), // Ensure consistent date format
        weight: Math.round(report.weight * 100) / 100,
        length: Math.round(report.length * 100) / 100,
      }));
      
      setChartData(chartData);
      console.log("Chart Data:", chartData);
    }

    fetchKois();
  }, [koiReport, selectedDate]);

  const config = {
    data: chartData,
    xField: 'updateDate',
    yField: ['weight', 'length'],
    seriesField: 'type', // This allows multiple lines
    meta: {
      updateDate: { alias: 'Date' },
      weight: { alias: 'Weight' },
      length: { alias: 'Length' },
    },
  };


  // Handle date selection for month/year
  const handleDateChange = (event) => {
    const dateString = event.target.value; // Get the string in 'YYYY-MM' format
    const date = dayjs(dateString, 'YYYY-MM'); // Convert it to a dayjs object
    setSelectedDate(date); // Set the selected date as a dayjs object
  };
  

  return (
    <Tabs defaultActiveKey="1" centered>
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
          <input type='month' onChange={handleDateChange} />
          {/* <DatePicker
    picker="month"
    onChange={(date, dateString) => {
      console.log("Selected Date:", dateString);
      form.setFieldsValue({ date: dateString }); // Set the date in the form values
    }}
    InititialValue={dayjs()} // Optional: Set default date if needed
  /> */}
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>

        {/* Chart for koi weight and length */}
        {chartData.length > 0 && <Line {...config} />}
      </Tabs.TabPane>

      <Tabs.TabPane tab="Pond Statistic" key="2">
        Content of Pond Statistic Tab
      </Tabs.TabPane>
    </Tabs>
  );
}

export default Statistic;

