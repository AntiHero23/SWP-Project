import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Upload,
  Spin,
} from "antd";
import {
  PlusCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { MdDelete } from "react-icons/md";
import "./index.scss";
import dayjs from "dayjs";
import uploadFile from "../../../assets/hook/useUpload";

function KoiInfo() {
  const { id } = useParams();
  const [form] = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [koi, setKoi] = useState(null);
  const [koiReport, setKoiReport] = useState([]);
  const [koiReportError, setKoiReportError] = useState(null);
  const [koiReportLatest, setKoiReportLatest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ponds, setPonds] = useState([]);
  const [koiVarieties, setKoiVarieties] = useState([]);
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [koiStandard, setKoiStandard] = useState(null);
  const [showKoiReport, setShowKoiReport] = useState(true);

  const handleDateChange = async (date) => {
    try {
      const response = await api.post("koistandard/byPeriodandKoiVarietyID", {
        date,
        koiFishID: koi?.koiFishID,
      });
      setKoiStandard(response.data.result);
      const { hiLength, lowLength, hiWeight, lowWeigh } = response.data.result;
      const avgLength = ((hiLength + lowLength) / 2).toFixed(2);
      const avgWeight = ((hiWeight + lowWeigh) / 2).toFixed(2);
      form.setFieldsValue({
        length: avgLength || "",
        weight: avgWeight || "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/koifish/${id}`);
        navigate("/managerKoi", { replace: true });
      } catch (error) {
        console.error(error);
      }
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

  const handleDeleteKoiReport = async (koiReportID) => {
    if (!window.confirm("Are you sure you want to delete this koi report?"))
      return;
    try {
      await api.delete(`koireport/${koiReportID}`);
      alert("Koi report deleted successfully");
      fetchKoiReport();
      fetchAllData();
    } catch (error) {
      console.error("Failed to delete koi report:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const showModal = () => setIsModalOpen(true);

  const fetchKoiReport = async () => {
    setLoading(true);
    try {
      const koiReportResponse = await api.get(`koireport/koiReports/${id}`);
      setKoiReport(koiReportResponse.data.result || []);
    } catch (error) {
      console.log(error);
      setKoiReportError("You don't have any koi report yet");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      await api.post("koireport/create", values);
      alert("Koi Report Add Successfully");
      setIsModalOpen(false);
      fetchKoiReport();
      fetchAllData();
    } catch (error) {
      alert(error.response.data.message);
    } finally {
      form.resetFields();
    }
  };

  const handleSubmitKoiInfo = async (values) => {
    try {
      if (fileList.length > 0) {
        const url = await uploadFile(fileList[0].originFileObj);
        values.image = url;
      }
      await api.put(`koifish/${id}`, values);
      alert("Koi updated successfully");
      navigate("/managerKoi");
      fetchAllData();
    } catch (error) {
      console.log("Koi updating failed", error);
    }
  };

  const fetchAllData = async () => {
    try {
      const [
        pondResponse,
        koiVarietyResponse,
        koiResponse,
        koiReportResponse,
        koiReportLatestResponse,
      ] = await Promise.all([
        api.get("pond"),
        api.get("koivariety"),
        api.get(`koifish/${id}`),
        api.get(`koireport/koiReports/${id}`),
        api.get(`koireport/latestKoiReport/${id}`),
      ]);
      setPonds(pondResponse.data);
      setKoiVarieties(koiVarietyResponse.data);
      setKoi(koiResponse.data.result || null);
      setKoiReport(koiReportResponse.data.result || []);
      setKoiReportLatest(koiReportLatestResponse.data.result || null);
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAllData();
  }, []);

  return (
    <div className="koi-page">
      <div className="koi-container">
        <h1 className="info-title">Koi Information</h1>
        {loading ? (
          <Spin size="large" />
        ) : (
          <div className="koi-info-container">
            <div className="koi-stats">
              <div className="koi-info">
                <Form
                  className="koi-form"
                  layout="vertical"
                  form={form}
                  initialValues={{
                    ...koi,
                    birthday: koi?.birthday
                      ? dayjs(koi.birthday).format("YYYY-MM-DD")
                      : null,
                  }}
                  onFinish={handleSubmitKoiInfo}
                >
                  <Row className="koi-row-1">
                    <div className="koi-image-name">
                      <Form.Item label="Name" name="koiName">
                        <Input defaultValue={koi?.koiName} />
                      </Form.Item>
                      <Form.Item
                        className="koi-img-container"
                        label="Pond Image"
                        name="image"
                      >
                        <img
                          className="koi-img"
                          src={fileList.length ? fileList[0].url : koi?.image}
                          alt="image"
                        />
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
                    </div>
                  </Row>
                  <Row className="koi-row-2">
                    <Form.Item label="Sex" name="koiSex">
                      <Select defaultValue={koi?.koiSex}>
                        <Select.Option value="male">Male</Select.Option>
                        <Select.Option value="female">Female</Select.Option>
                      </Select>
                    </Form.Item>

                    <Form.Item label="Birthday" name="birthday">
                      <input type="date" defaultValue={koi?.birthday} />
                    </Form.Item>
                  </Row>
                  <Row className="koi-row-3">
                    <Form.Item label="Pond" name="pondID">
                      <Select
                        defaultValue={koi?.pondID}
                        options={ponds.map((pond) => ({
                          value: pond.pondID,
                          label: pond.pondName,
                        }))}
                      />
                    </Form.Item>

                    <Form.Item label="Variety" name="koiVarietyID">
                      <Select
                        defaultValue={koi?.koiVarietyID}
                        options={koiVarieties.map((variety) => ({
                          value: variety.koiVarietyID,
                          label: variety.varietyName,
                        }))}
                      />
                    </Form.Item>
                  </Row>
                  <Row className="koi-row-4">
                    <Button type="primary" htmlType="submit">
                      Edit
                    </Button>
                    <Button
                      className="delete-button"
                      danger
                      style={{ marginLeft: 8 }}
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  </Row>
                </Form>
              </div>
              {koiReportLatest && (
                <div className="koi-report-latest">
                  <h2>Latest Koi Report</h2>
                  <h4>Koi Length: {koiReportLatest.length || "N/A"} cm</h4>
                  <h4>Koi Weight: {koiReportLatest.weight || "N/A"} g</h4>
                  <h4>Koi Status: {koiReportLatest.koiStatus || "N/A"}</h4>
                </div>
              )}
            </div>

            <Button
              type="primary"
              className="show-report-btn"
              onClick={() => setShowKoiReport(!showKoiReport)}
            >
              {showKoiReport ? "Hide Koi Report" : "Show Koi Report"}
            </Button>

            {showKoiReport && (
              <div className="koi-report">
                <div className="report-header">
                  <h2 className="report-title">Koi Report History</h2>
                  <PlusCircleOutlined onClick={showModal} />
                </div>

                <Modal
                  title="Add Koi Report"
                  open={isModalOpen}
                  onCancel={handleCancel}
                  footer={null}
                >
                  <Form form={form} onFinish={handleSubmit}>
                    <Form.Item
                      label="Date"
                      name="updateDate"
                      rules={[{ required: true }]}
                    >
                      <input
                        type="date"
                        onChange={(e) => handleDateChange(e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Length (cm)"
                      name="length"
                      rules={[{ required: true }]}
                    >
                      <Input type="number" step="0.01" />
                    </Form.Item>
                    <Form.Item
                      label="Weight (g)"
                      name="weight"
                      rules={[{ required: true }]}
                    >
                      <Input type="number" step="0.01" />
                    </Form.Item>
                    <Form.Item hidden name="koiFishID" initialValue={id}>
                      <Input />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                </Modal>

                <div className="report-content">
                  {koiReport
                    .sort(
                      (a, b) => new Date(b.updateDate) - new Date(a.updateDate)
                    )
                    .map((report) => (
                      <div
                        className="report-history-card"
                        key={report.koiReportID}
                      >
                        <div className="report-info">
                          <p className="date">
                            Date:{" "}
                            {dayjs(report.updateDate).format("MMMM D, YYYY")}
                          </p>
                          <p>Length: {report.length} cm</p>
                          <p>Weight: {report.weight} g</p>
                        </div>
                        <DeleteOutlined
                          className="delete-icon"
                          onClick={() =>
                            handleDeleteKoiReport(report.koiReportID)
                          }
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
        <Button className="go-back-button" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    </div>
  );
}

export default KoiInfo;
