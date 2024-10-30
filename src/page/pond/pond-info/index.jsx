import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { Button, Form, Image, Input, InputNumber, Upload } from "antd";
import "./index.scss";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../../assets/hook/useUpload";
import dayjs from "dayjs";
import { fetchWaterParameters } from "../../../constants/waterValidation";

function PondInfo() {
  const { id } = useParams();
  const pondId = Number(id);
  const [pond, setPond] = useState({});
  const [waterReport, setWaterReport] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [waterParameters, setWaterParameters] = useState(null);
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const parameters = await fetchWaterParameters();
      setWaterParameters(parameters);
      fetchData();
    };
    initialize();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pondResponse, waterReportResponse] = await Promise.all([
        api.get(`pond/${pondId}`),
        api.get(`waterreport/view/latestreport/${pondId}`),
      ]);
      setPond(pondResponse.data.result);
      setWaterReport(waterReportResponse.data.result);
    } catch (error) {
      setError("Failed to fetch pond data or water report.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
        color: "black",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleDelete = async () => {
    if (pond.amountFish > 0) {
      alert("This pond has fish, you cannot delete it.");
      return;
    }
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this pond?\nThis action cannot be undone."
    );
    if (!confirmDelete) return;
    try {
      await api.delete(`pond/${pondId}`);
      alert("Pond deleted successfully");
      navigate("/managerPond");
    } catch (error) {
      console.error("Failed to delete pond:", error);
    }
  };

  if (loading || !waterParameters) return <div>Loading...</div>;
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
                  if (fileList.length > 0) {
                    const url = await uploadFile(fileList[0].originFileObj);
                    values.pondImage = url;
                  } else {
                    values.pondImage = pond.pondImage;
                  }
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
            <h2>Pond Information</h2>
            <Form.Item label="Name" name="pondName">
              <Input placeholder="Enter pond name" />
            </Form.Item>

            <div className="pond-image-section">
              <Form.Item label="Pond Image" name="pondImage">
                <img src={pond.pondImage} alt="Pond" />
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  className="upload-container"
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
              </Form.Item>
            </div>

            <div className="form-grid">
              <Form.Item label="Volume (L)" name="volume">
                <InputNumber min={0} placeholder="Enter volume" />
              </Form.Item>

              <Form.Item label="Drain Count" name="drainCount">
                <InputNumber min={0} placeholder="Enter drain count" />
              </Form.Item>

              <Form.Item label="Skimmer Count" name="skimmerCount">
                <InputNumber min={0} placeholder="Enter skimmer count" />
              </Form.Item>

              <Form.Item label="Pumping Capacity (L)" name="pumpingCapacity">
                <InputNumber min={0} placeholder="Enter capacity" />
              </Form.Item>

              <Form.Item label="Area (m²)" name="area">
                <InputNumber min={0} placeholder="Enter area" />
              </Form.Item>

              <Form.Item label="Depth (m)" name="depth">
                <InputNumber min={0} placeholder="Enter depth" />
              </Form.Item>

              <Form.Item label="Amount of Fish" name="amountFish">
                <InputNumber disabled min={0} />
              </Form.Item>
            </div>

            <div className="button-container">
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              <Button className="delete-button" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </Form>
        </div>
        {previewImage && (
          <Image
            className="image-preview"
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}

        <div className="water-report">
          <h2>Water Report Latest</h2>
          <p>
            <span>Updated Date:</span>
            <span>
              {dayjs(waterReport?.waterReportUpdatedDate).format("DD MMM YYYY")}
            </span>
          </p>
          <p
            style={{
              color:
                waterReport.waterReportTemperature <
                  waterParameters.temperature.min ||
                waterReport.waterReportTemperature >
                  waterParameters.temperature.max
                  ? "red"
                  : "",
            }}
          >
            <span>Temperature:</span>
            <span>
              {waterReport.waterReportTemperature}{" "}
              {waterParameters.temperature.unit}
            </span>
          </p>
          <p
            style={{
              color:
                waterReport.waterReportOxygen < waterParameters.oxygen.min ||
                waterReport.waterReportOxygen > waterParameters.oxygen.max
                  ? "red"
                  : "",
            }}
          >
            <span>Oxygen:</span>
            <span>
              {waterReport.waterReportOxygen} {waterParameters.oxygen.unit}
            </span>
          </p>
          <p
            style={{
              color:
                waterReport.waterReport_pH < waterParameters.pH.min ||
                waterReport.waterReport_pH > waterParameters.pH.max
                  ? "red"
                  : "",
            }}
          >
            <span>pH:</span>
            <span>{waterReport?.waterReport_pH}</span>
          </p>
          <p
            style={{
              color:
                waterReport.waterReportHardness <
                  waterParameters.hardness.min ||
                waterReport.waterReportHardness > waterParameters.hardness.max
                  ? "red"
                  : "",
            }}
          >
            <span>Hardness:</span>
            <span>
              {waterReport.waterReportHardness} {waterParameters.hardness.unit}
            </span>
          </p>
          <p
            style={{ color: waterReport.waterReportAmmonia > 0.1 ? "red" : "" }}
          >
            <span>Ammonia:</span>
            <span>{waterReport.waterReportAmmonia} mg/L</span>
          </p>
          <p
            style={{ color: waterReport.waterReportNitrite > 0.1 ? "red" : "" }}
          >
            <span>Nitrite:</span>
            <span>{waterReport.waterReportNitrite} mg/L</span>
          </p>
          <p
            style={{ color: waterReport.waterReportNitrate > 20 ? "red" : "" }}
          >
            <span>Nitrate:</span>
            <span>{waterReport.waterReportNitrate} mg/L</span>
          </p>
          <p
            style={{
              color: waterReport.waterReportCarbonate > 180 ? "red" : "",
            }}
          >
            <span>Carbonate:</span>
            <span>{waterReport.waterReportCarbonate} mg/L</span>
          </p>
          <p style={{ color: waterReport.waterReportSalt > 0.5 ? "red" : "" }}>
            <span>Salt:</span>
            <span>{waterReport.waterReportSalt}%</span>
          </p>
          <p
            style={{
              color: waterReport?.waterReportCarbonDioxide > 40 ? "red" : "",
            }}
          >
            <span>Carbon Dioxide:</span>
            <span>{waterReport?.waterReportCarbonDioxide} mg/L</span>
          </p>
          <Button
            type="primary"
            onClick={() => navigate(`/waterReportHistory/${pondId}`)}
          >
            See Water Report History
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PondInfo;
