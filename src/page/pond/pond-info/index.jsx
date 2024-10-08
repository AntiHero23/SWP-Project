import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { Button, Form, Input, InputNumber } from "antd";
import { useQueryClient } from "react-query";
import "./index.scss";
import dayjs from "dayjs";

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
      } catch (error) {
        setError("Failed to fetch pond data.");
      } finally {
        setLoading(false);
      }
    };
    const fetchWaterReport = async () => {
      try {
        const waterReportResponse = await api.get(
          `waterreport/view/latestreport/${pondId}`
        );
        console.log(waterReportResponse.data.result);
        setWaterReport(waterReportResponse.data.result);
      } catch (error) {
        console.error("Failed to fetch water report:", error);
        setError("Failed to fetch water report.");
      }
    };

    fetchPond();
    fetchWaterReport();
  }, [pondId]);

  const handleDelete = async () => {
    if (pond.amountFish > 0) {
      alert("This pond has fish, you cannot delete it.");
      return;
    }
    try {
      await api.delete(`pond/${pondId}`);
      alert("Pond deleted successfully");
      navigate("/managerPond");
    } catch (error) {
      console.error("Failed to delete pond:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pond-water-container">
      <div className="info-report-container">
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
        >  <div className="pond-info-columns">
          <div className="left-column">
          <Form.Item label="Name" name="pondName">
            <Input />
          </Form.Item>
          <Form.Item label="Pond Image" name="pondImage">
            <Input />
            <img
              src={pond.pondImage}
              alt="pond"
              style={{ width: "100%", height: 100 }}
            />
          </Form.Item>
          <Form.Item label="Area" name="area">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Depth" name="depth">
            <InputNumber min={0} />
          </Form.Item>
          </div>
          <div className="right-column">           
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
          </div>
          </div>
          <div className="button-container">
          <Button type="primary" htmlType="submit">
             Update
          </Button>
          <Button className="delete-button" danger style={{ marginLeft: 8 }} onClick={handleDelete}>
             Delete
          </Button>
  </div>
        </Form>
      </div>
      <div className="water-report">
        <div className="content">
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
        <p>Water Report Carbon Dioxide: {waterReport.waterReportCarbonDioxide} </p>
        </div>
        <div className="button-container">
        <Button className="Add-button" onClick={handleAddWaterReport}>Add Water Report</Button>
        <Button danger style={{ marginLeft: 8 }}  className="delete-button"onClick={handleDelete}>Delete Water Report</Button>
        </div>
      </div>
      </div>
    </div>
  );
}

export default PondInfo;

