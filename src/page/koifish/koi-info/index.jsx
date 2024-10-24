import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { useQueryClient } from "react-query";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Upload,
} from "antd";
import { PlusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { MdDelete } from "react-icons/md";
import "./index.scss";
import dayjs from "dayjs";
import { Delete } from "lucide-react";
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
      fetchKoiReport();
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
      setKoiReportError("You dont have any koi report yet");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (values) => {
    try {
      await api.post("koireport/create", values);
      setIsModalOpen(false);
      fetchKoiReport();
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
        console.log(url);
        values.image = url;
      }
      await api.put(`koifish/${id}`, values);
      alert("Koi updated successfully");
      navigate("/managerKoi");
    } catch (error) {
      console.log("koi updating failed", error);
    }
  };
  useEffect(() => {
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
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchAllData();
  }, []);
  return (
    <div className="koi-page">
      <div className="koi-container">
        <h1 className="info-title">Koi Info</h1>
        {!loading && (
          <div className="koi-info-container">
            <div className="koi-info">
              <div className="koi-stats">
                <Col span={12}>
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
                      {koiReportLatest && (
                        <div className="koi-report-latest">
                          <h3>Koi Length: {koiReportLatest.length || "N/A"} cm</h3>
                          <h3>Koi Weight: {koiReportLatest.weight || "N/A"} g</h3>
                          <h3>
                            Koi Status: {koiReportLatest.koiStatus || "N/A"}
                          </h3>
                        </div>
                      )}
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
                </Col>
                {previewImage && (
                  <Image
                    className="image-preview"
                    wrapperStyle={{ display: "none" }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                  />
                )}
              </div>
            </div>
            <div className="koi-report">
              <div className="report-header">
                <h2 className="report-title">Koi Report History </h2>
                <PlusCircleOutlined
                  style={{ fontSize: "24px" }}
                  onClick={showModal}
                />
              </div>
              <Modal
                className="report-popup"
                title="Add Koi Report"
                initialValues={{
                  updateDate: "",
                  length: 0,
                  weight: 0,
                  koiFishID: 0,
                }}
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={handleCancel}
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  rules={[{ required: true, message: "Field is required" }]}
                >
                  <Form.Item
                    label="Date"
                    name="updateDate"
                    rules={[{ required: true, message: "Date is required" }]}
                  >
                    <Input type="date" placeholder="Date" />
                  </Form.Item>
                  <Form.Item
                    label="Length"
                    name="length"
                    rules={[{ required: true, message: "Length is required" }]}
                  >
                    <Input type="number" placeholder="Length" />
                  </Form.Item>
                  <Form.Item
                    label="Weight"
                    name="weight"
                    rules={[{ required: true, message: "Weight is required" }]}
                  >
                    <Input type="number" placeholder="Weight" />
                  </Form.Item>
                  <Form.Item
                    name="koiFishID"
                    initialValue={koi?.koiFishID}
                    hidden
                  ></Form.Item>
                </Form>
              </Modal>
              {koiReportError && (
                <p style={{ color: "red" }}>{koiReportError}</p>
              )}
              {!koiReportError && (
                <>
                  {koiReport
                    .sort(
                      (a, b) => new Date(b.updateDate) - new Date(a.updateDate)
                    )
                    .map((report) => (
                      <>
                        <div className="report-history-card">
                          <p>
                            Date :{" "}
                            {dayjs(report.updateDate).format("MMMM D, YYYY")}
                          </p>
                          <p>Length : {report.length} cm</p>
                          <p>Weight : {report.weight} g</p>
                          <MdDelete
                            style={{ fontSize: "24px", cursor: "pointer" }}
                            onClick={() =>
                              handleDeleteKoiReport(report.koiReportID)
                            }
                          />
                        </div>
                      </>
                    ))}
                </>
              )}
            </div>
            <Button onClick={() => navigate(-1)}>Go Back </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default KoiInfo;
