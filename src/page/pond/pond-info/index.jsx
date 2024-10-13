import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { Button, Form, Image, Input, InputNumber, Upload } from "antd";
import "./index.scss";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../../assets/hook/useUpload";

function PondInfo() {
  const { id } = useParams();
  const pondId = Number(id);
  const [pond, setPond] = useState({});
  const [waterReport, setWaterReport] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
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

  useEffect(() => {
    fetchData();
  }, []);

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
                  if (fileList.length > 0) {
                    const url = await uploadFile(fileList[0].originFileObj);
                    console.log(url);
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
            {" "}
            <div className="pond-info-columns">
              <div className="left-column">
                <h2>Pond Report</h2>
                <Form.Item label="Name" name="pondName">
                  <Input />
                </Form.Item>
                <Form.Item label="Pond Image" name="pondImage">
                  <img src={pond.pondImage} alt="pondImage" />
                  <Upload
                    // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    className="upload-container"
                  >
                    {fileList.length >= 8 ? null : uploadButton}
                  </Upload>
                </Form.Item>
                <Form.Item label="Area: m2" name="area">
                  <InputNumber min={0} />
                </Form.Item>
                <Form.Item label="Depth: m" name="depth">
                  <InputNumber min={0} />
                </Form.Item>
              </div>
              <div className="right-column">
                <Form.Item label="Volume: m3" name="volume">
                  <InputNumber min={0} />
                </Form.Item>
                <Form.Item label="Drain Count: " name="drainCount">
                  <InputNumber min={0} />
                </Form.Item>
                <Form.Item label="Skimmer Count: " name="skimmerCount">
                  <InputNumber min={0} />
                </Form.Item>
                <Form.Item label="Pumping Capacity: L" name="pumpingCapacity">
                  <InputNumber min={0} />
                </Form.Item>
                <Form.Item label="Amount of Fish: " name="amountFish">
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

        <Form
          name="water-report-form"
          className="water-report"
          initialValues={{
            ...waterReport,
            waterReportUpdatedDate: dayjs(
              waterReport.waterReportUpdatedDate
            ).format("YYYY-MM-DD"),
          }}
          onFinish={async (values) => {
            try {
              const response = await api.put(
                `waterreport/update/latestreport/${pondId}`,
                values
              );
              console.log(response.data);
              alert("Water report updated successfully");
              navigate("/managerPond");
            } catch (error) {
              console.error("Failed to update water report:", error);
            }
          }}
        >
          <div className="content">
            <h2>Water Report</h2>
            <Form.Item label="Water Report ID" name="waterReportId">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Updated Date" name="waterReportUpdatedDate">
              <Input disabled />
            </Form.Item>{" "}
            <Form.Item label="Temperature(°C):" name="waterReportTemperature">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Oxygen(mg/L):" name="waterReportOxygen">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="pH" name="waterReport_pH">
              <InputNumber min={0} max={14} />
            </Form.Item>
            <Form.Item label="Hardness(ppm):" name="waterReportHardness">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Ammonia(ppm):" name="waterReportAmmonia">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Nitrite(ppm):" name="waterReportNitrite">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Nitrate(ppm):" name="waterReportNitrate">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Carbonate(ppm):" name="waterReportCarbonate">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Salt Level(%): " name="waterReportSalt">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item
              label="Carbon Dioxide(ppm):"
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
