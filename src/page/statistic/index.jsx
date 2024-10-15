import { React, useState, useEffect } from 'react';
import { Form, Select, Button, Tabs } from 'antd';
import { DualAxes } from '@ant-design/charts';
import "./index.scss";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { interpolateNumber } from 'd3-interpolate';


function Statistic() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [kois, setKois] = useState([]);
  const [selectedKoi, setSelectedKoi] = useState(null);
  const [koiReport, setKoiReport] = useState([]);
  const [loading, setLoading] = useState(false);


  
  const fetchKois = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("koifish");
      setKois(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const interpolateMissingData = (data) => {
    let filledData = [...data];
    
    // Interpolate both 'weight' and 'length'
    for (let i = 1; i < filledData.length; i++) {
      if (filledData[i].weight === null || filledData[i].length === null) {
        // Find previous and next known data points for weight and length
        let prevIndex = i - 1;
        let nextIndex = i;
        
        while (filledData[nextIndex].weight === null && nextIndex < filledData.length) {
          nextIndex++;
        }
  
        if (nextIndex < filledData.length) {
          const prevWeight = filledData[prevIndex].weight;
          const nextWeight = filledData[nextIndex].weight;
          const prevLength = filledData[prevIndex].length;
          const nextLength = filledData[nextIndex].length;
          const prevInstance = filledData[prevIndex].instance;
          const nextInstance = filledData[nextIndex].instance;
          const interpolateWeight = interpolateNumber(prevWeight, nextWeight);
          const interpolateLength = interpolateNumber(prevLength, nextLength);
          
          for (let j = prevIndex + 1; j < nextIndex; j++) {
            // Interpolating values for weight and length for instance j
            const t = (filledData[j].instance - prevInstance) / (nextInstance - prevInstance);
            filledData[j].weight = interpolateWeight(t);
            filledData[j].length = interpolateLength(t);
          }
        }
      }
    }
    
    return filledData;
  };

  const fetchKoiReport = async (koiFishID) => {
    setLoading(true);
    try {
      const { data } = await api.get(`koireport/koiReports/${koiFishID}`);
      setKoiReport(data.result || []);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKois();

  }, []);

  const handleSubmit = async (values) => {
    setSelectedKoi(values.koi);
    fetchKoiReport(values.koi);
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
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        {/* {selectedKoi && (
          <div>
            <p>Selected Koi ID: {selectedKoi}</p>
          </div>
        )}
        {koiReport.length > 0 && (
          <div>
            <h2>Koi Report History</h2>
            {koiReport.map((report) => (
              <div key={report.koiReportID} className="report-history-card">
                <p>Koi Report ID: {report.koiReportID}</p>
                <p>Koi ID: {report.koiFishID}</p>
              </div>
            ))}
          </div>
        )} */}
      </Form>
    </Tabs.TabPane>

    <Tabs.TabPane tab="Pond Statistic" key="2">
      Content of Pond Statistic Tab
    </Tabs.TabPane>
  </Tabs>
  );
}

export default Statistic;

