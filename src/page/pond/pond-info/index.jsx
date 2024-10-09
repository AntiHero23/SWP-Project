import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { Button, Form, Input, InputNumber } from "antd";
import "./index.scss";
import dayjs from "dayjs";

function PondInfo() {
  const { id } = useParams();
  const pondId = Number(id);
  const [pond, setPond] = useState({});
  const [waterReport, setWaterReport] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
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
    setLoading(true);
    try {
      const waterReportResponse = await api.get(
        `waterreport/view/latestreport/${pondId}`
      );
      console.log(waterReportResponse.data.result);
      setWaterReport(waterReportResponse.data.result);
    } catch (error) {
      console.error("Failed to fetch water report:", error);
      setError("Failed to fetch water report.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
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
          >
            {" "}
            <div className="pond-info-columns">
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
              <Button
                className="delete-button"
                danger
                style={{ marginLeft: 8 }}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </Form>
        </div>

        <Form
          name="water-report-form"
          className="water-report"
          initialValues={waterReport}
          onFinish={(values2) => {
            const updateWaterReport = async (values2) => {
              try {
                await api.put(
                  `waterreport/update/latestreport/${pondId}`,
                  values2
                );
                alert("Water report updated successfully");
              } catch (error) {
                console.error("Failed to update water report:", error);
              }
            };

            updateWaterReport();
          }}
        >
          <div className="content">
            <h2>Water Report</h2>
            <Form.Item label="Water Report ID" name="waterReportId">
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="Water Report Updated Date"
              name="waterReportUpdatedDate"
            >
              <Input disabled />
            </Form.Item>{" "}
            <Form.Item
              label="Water Report Temperature"
              name="waterReportTemperature"
            >
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Water Report Oxygen" name="waterReportOxygen">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Water Report pH" name="waterReport_pH">
              <InputNumber min={0} max={14} />
            </Form.Item>
            <Form.Item label="Water Report Hardness" name="waterReportHardness">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Water Report Ammonia" name="waterReportAmmonia">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Water Report Nitrite" name="waterReportNitrite">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Water Report Nitrate" name="waterReportNitrate">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item
              label="Water Report Carbonate"
              name="waterReportCarbonate"
            >
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Water Report Salt" name="waterReportSalt">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item
              label="Water Report Carbon Dioxide"
              name="waterReportCarbonDioxide"
            >
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update Water Report
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default PondInfo;
