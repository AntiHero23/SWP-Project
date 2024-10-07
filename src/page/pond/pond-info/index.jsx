import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { Button, Form, Input, InputNumber } from "antd";
import { useQueryClient } from "react-query";
import "./index.scss";

function PondInfo() {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const pondId = Number(id);
  const [pond, setPond] = useState({});
  const [waterReport, setWaterReport] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPond = async () => {
      setLoading(true);
      try {
        const pondResponse = await api.get(`pond/${pondId}`);
        setPond(pondResponse.data.result);
        console.log(pondId);
        console.log(pondResponse.data.result);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch pond data.");
      } finally {
        setLoading(false);
      }
    };
    const fetchWaterReport = async () => {
      try {
        const waterReportResponse = await api.get(`waterreport/view/${pondId}`);
        setWaterReport(waterReportResponse.data);
      } catch (error) {
        console.error("Failed to fetch water report:", error);
        setError("Failed to fetch water report.");
      }
    };

    fetchWaterReport();
    fetchPond();
  }, [pondId]);

  const handleDelete = async () => {
    try {
      await api.delete(`pond/${pondId}`);
      queryClient.invalidateQueries("pond");
      alert("Pond deleted successfully");
      navigate("/managerPond");
    } catch (error) {
      console.error("Failed to delete pond:", error);
    }
  };

  const handleAddWaterReport = async () => {
    // try {
    //   const response = await api.post(`waterreport`, { pondID: pondId });
    //   if (response.data.message === "WaterReport not existed") {
    //     alert("Please create a water report.");
    //   } else {
    //     alert("Water report created successfully.");
    //     const waterReportResponse = await api.get(`waterreport/${pondId}`);
    //     setWaterReport(waterReportResponse.data);
    //   }
    // } catch (error) {
    //   console.error("Failed to create water report:", error);
    //   alert("An error occurred while creating the water report.");
    // }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pond-water-container">
      <div className="pond-info">
        <Form
          layout="vertical"
          initialValues={pond}
          onFinish={(values) => {
            const updatePond = async () => {
              try {
                await api.put(`pond/${pondId}`, values);
                alert("Pond updated successfully");
                navigate("/managerPond");
              } catch (error) {
                console.error("Failed to update pond:", error);
              }
            };
            updatePond();
          }}
        >
          <Form.Item label="Name" name="pondName">
            <Input />
          </Form.Item>
          <Form.Item label="Pond Image" name="pondImage">
            <Input />
            <img
              src={pond.pondImage}
              alt="pond"
              style={{ width: "100%", height: 200 }}
            />
          </Form.Item>
          <Form.Item label="Area" name="area">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Depth" name="depth">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Volume" name="volume">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Drain Count" name="drainCount">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Skimmer Count" name="skimmerCount">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Pumping Capacity" name="pumpingCapacity">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Amount of Fish" name="amountFish">
            <InputNumber disabled min={0} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
            <Button danger style={{ marginLeft: 8 }} onClick={handleDelete}>
              Delete
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="pond-waterreport">
        <h2>Water Report</h2>
        <p>Water Report ID: {waterReport.waterReportId}</p>
        <p>Water Report Updated Date: {waterReport.waterReportUpdatedDate}</p>
        <p>Water Report Temperature: {waterReport.waterReportTemperature}</p>
        <p>Water Report Oxygen: {waterReport.waterReportOxygen}</p>
        <p>Water Report pH: {waterReport.waterReport_pH}</p>
        <p>Water Report Hardness: {waterReport.waterReportHardness}</p>
        <p>Water Report Ammonia: {waterReport.waterReportAmmonia}</p>
        <p>Water Report Nitrite: {waterReport.waterReportNitrite}</p>
        <p>Water Report Nitrate: {waterReport.waterReportNitrate}</p>
        <p>Water Report Carbonate: {waterReport.waterReportCarbonate}</p>
        <p>Water Report Salt: {waterReport.waterReportSalt}</p>
        <p>
          Water Report Carbon Dioxide: {waterReport.waterReportCarbonDioxide}
        </p>
        <Button onClick={handleAddWaterReport}>Add Water Report</Button>
        <Button onClick={handleDelete}>Delete Water Report</Button>
      </div>
      <Button onClick={() => navigate("/managerPond")}>Back</Button>
    </div>
  );
}

export default PondInfo;
