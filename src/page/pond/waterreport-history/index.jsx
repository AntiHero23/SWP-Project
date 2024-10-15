import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../config/axios";
import { Card, Row, Button, Modal, Form, InputNumber, Input, Col } from "antd";
import dayjs from "dayjs";

const WaterReportHistory = () => {
  const { id } = useParams();
  const pondID = Number(id);
  const [waterReportHistory, setWaterReportHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWaterReport, setEditingWaterReport] = useState({});

  const [form] = Form.useForm();
  const fetchWaterReportHistory = async () => {
    try {
      const response = await api.get(`/waterreport/view/${pondID}`);
      setWaterReportHistory(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchWaterReportHistory();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCreateWaterReport = async (values) => {
    values.pondID = pondID;
    console.log(values);
    try {
      const response = await api.post(`waterreport/create`, values);
      console.log(response.data);
      fetchWaterReportHistory();
      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      }
    }
  };

  const handleEdit = async (values) => {
    console.log(editingWaterReport.waterReportId);
    values.pondID = pondID;
    console.log(values);
    try {
      const response = await api.put(
        `waterreport/update/${editingWaterReport.waterReportId}`,
        values
      );
      console.log(response.data);
      alert("Water report updated successfully");
      form.resetFields();
      fetchWaterReportHistory();
      setIsModalOpen(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      }
    }
  };
  const handleDelete = async (values) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this water report?"
    );
    if (isConfirmed) {
      try {
        const response = await api.delete(`/waterreport/delete/${values}`);
        console.log(response.data);
        fetchWaterReportHistory();
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Water Report History</h1>
      <Button type="primary" onClick={handleOpenModal}>
        Create Water Report
      </Button>
      <Row gutter={[16, 16]}>
        {waterReportHistory
          .slice()
          .sort(
            (a, b) =>
              new Date(b.waterReportUpdatedDate) -
              new Date(a.waterReportUpdatedDate)
          )
          .map((waterReport, index) => (
            <Card
              key={index}
              title={dayjs(waterReport.waterReportUpdatedDate).format(
                "DD MMM YYYY"
              )}
              style={{
                marginBottom: 16,
                width: "25%",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                borderRadius: "20px",
                padding: "20px",
                background: "rgba(255, 255, 255, 0.9)",
                color: "#1890ff",
              }}
            >
              <p>Temperature: {waterReport.waterReportTemperature} &deg;C</p>
              <p>Oxygen: {waterReport.waterReportOxygen} mg/L</p>
              <p>pH: {waterReport.waterReport_pH}</p>
              <p>Hardness: {waterReport.waterReportHardness} dGH</p>
              <p>Ammonia: {waterReport.waterReportAmmonia} mg/L</p>
              <p>Nitrite: {waterReport.waterReportNitrite} mg/L</p>
              <p>Nitrate: {waterReport.waterReportNitrate} mg/L</p>
              <p>Carbonate: {waterReport.waterReportCarbonate} mg/L</p>
              <p>Salt: {waterReport.waterReportSalt} %</p>
              <p>Carbon Dioxide: {waterReport.waterReportCarbonDioxide} mg/L</p>
              <Button
                type="primary"
                onClick={() => {
                  setIsEditModalOpen(true);
                  setEditingWaterReport(waterReport);
                  console.log(editingWaterReport);
                }}
              >
                Edit
              </Button>
              <Button
                danger
                type="primary"
                onClick={() => handleDelete(waterReport.waterReportId)}
              >
                Delete
              </Button>
            </Card>
          ))}
        <Modal
          title={<h2 style={{ fontSize: "24px" }}>Edit Water Report</h2>}
          open={isEditModalOpen}
          onOk={() => form.submit()}
          onCancel={() => setIsEditModalOpen(false)}
        >
          <Form form={form} layout="vertical" onFinish={handleEdit}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="waterReportTemperature"
                  label="Temperature"
                  rules={[
                    {
                      required: true,
                      message: "Please input water report temperature!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Temperature"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="waterReportOxygen"
                  label="Oxygen"
                  rules={[
                    {
                      required: true,
                      message: "Please input water report oxygen!",
                    },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} placeholder="Oxygen" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="waterReport_pH"
                  label="pH"
                  rules={[
                    {
                      required: true,
                      message: "Please input water report pH!",
                    },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} placeholder="pH" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="waterReportHardness"
                  label="Hardness"
                  rules={[
                    {
                      required: true,
                      message: "Please input water report hardness!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Hardness"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="waterReportAmmonia"
                  label="Ammonia"
                  rules={[
                    {
                      required: true,
                      message: "Please input water report ammonia!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Ammonia"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="waterReportNitrite"
                  label="Nitrite"
                  rules={[
                    {
                      required: true,
                      message: "Please input water report nitrite!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Nitrite"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="waterReportNitrate"
                  label="Nitrate"
                  rules={[
                    {
                      required: true,
                      message: "Please input water report nitrate!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Nitrate"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="waterReportCarbonate"
                  label="Carbonate"
                  rules={[
                    {
                      required: true,
                      message: "Please input water report carbonate!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Carbonate"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="waterReportSalt"
                  label="Salt"
                  rules={[
                    {
                      required: true,
                      message: "Please input water report salt!",
                    },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} placeholder="Salt" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="waterReportCarbonDioxide"
                  label="Carbon Dioxide"
                  rules={[
                    {
                      required: true,
                      message: "Please input water report carbon dioxide!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Carbon Dioxide"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="pondID" hidden>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title={<h2 style={{ fontSize: "24px" }}>Create Water Report</h2>}
          open={isModalOpen}
          onOk={() => form.submit()}
          onCancel={handleCancel}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateWaterReport}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Date"
                  name="waterReportUpdatedDate"
                  rules={[{ required: true, message: "Please enter date" }]}
                >
                  <Input type="date" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Temperature"
                  name="waterReportTemperature"
                  rules={[
                    { required: true, message: "Please enter temperature" },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Oxygen"
                  name="waterReportOxygen"
                  rules={[{ required: true, message: "Please enter oxygen" }]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="pH"
                  name="waterReport_pH"
                  rules={[{ required: true, message: "Please enter pH" }]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Hardness"
                  name="waterReportHardness"
                  rules={[{ required: true, message: "Please enter hardness" }]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ammonia"
                  name="waterReportAmmonia"
                  rules={[{ required: true, message: "Please enter ammonia" }]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Nitrite"
                  name="waterReportNitrite"
                  rules={[{ required: true, message: "Please enter nitrite" }]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Nitrate"
                  name="waterReportNitrate"
                  rules={[{ required: true, message: "Please enter nitrate" }]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Carbonate"
                  name="waterReportCarbonate"
                  rules={[
                    { required: true, message: "Please enter carbonate" },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Salt"
                  name="waterReportSalt"
                  rules={[{ required: true, message: "Please enter salt" }]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Carbon Dioxide"
                  name="waterReportCarbonDioxide"
                  rules={[
                    { required: true, message: "Please enter carbon dioxide" },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="pondID" hidden>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Row>
    </div>
  );
};

export default WaterReportHistory;
