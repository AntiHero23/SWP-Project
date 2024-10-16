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
          <Form form={form} layout="vertical" initialValues={editingWaterReport} onFinish={handleEdit}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="waterReportTemperature"
                  label="Temperature(&deg;C): "
                  rules={[
                    {
                      required: true,
                      message: "Please input water report temperature!",
                    },
                    {
                      validator(_, value) {
                        if (value < 5 || value > 26) {
                          return Promise.reject(
                            new Error(
                              "Temperature must be between 5&deg;C and 26&deg;C"
                            )
                          );
                        }
                        return Promise.resolve();
                      },
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
                  label="Oxygen(mg/L): "
                  rules={[
                    {
                      required: true,
                      message: "Please input water report oxygen!",
                    },
                    {
                      validator(_, value) {
                        if (value < 0 || value > 10) {
                          return Promise.reject(
                            new Error("Oxygen must be between 0mg/L and 10mg/L")
                          );
                        }
                        return Promise.resolve();
                      },
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
                  label="pH:"
                  rules={[
                    {
                      required: true,
                      message: "Please input water report pH!",
                    },
                    {
                      validator(_, value) {
                        if (value < 6.9 || value > 8) {
                          return Promise.reject(
                            new Error("pH must be between 6.9 and 8")
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} placeholder="pH" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="waterReportHardness"
                  label="Hardness(dGH)"
                  rules={[
                    {
                      required: true,
                      message: "Please input water report hardness!",
                    },
                    {
                      validator(_, value) {
                        if (value < 0 || value > 20) {
                          return Promise.reject(
                            new Error("Hardness must be between 0dGH and 20dGH")
                          );
                        }
                        return Promise.resolve();
                      },
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
                  label="Ammonia(mg/L): "
                  rules={[
                    {
                      required: true,
                      message: "Please input water report ammonia!",
                    },
                    {
                      validator(_, value) {
                        if (value < 0 || value > 0.5) {
                          return Promise.reject(
                            new Error(
                              "Ammonia must be between 0mg/L and 0.5mg/L"
                            )
                          );
                        }
                        return Promise.resolve();
                      },
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
                  label="Nitrite(mg/L): "
                  rules={[
                    {
                      required: true,
                      message: "Please input water report nitrite!",
                    },
                    {
                      validator(_, value) {
                        if (value < 0 || value > 1) {
                          return Promise.reject(
                            new Error("Nitrite must be between 0mg/L and 1mg/L")
                          );
                        }
                        return Promise.resolve();
                      },
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
                  label="Nitrate(mg/L): "
                  rules={[
                    {
                      required: true,
                      message: "Please input water report nitrate!",
                    },
                    {
                      validator(_, value) {
                        if (value < 0 || value > 10) {
                          return Promise.reject(
                            new Error(
                              "Nitrate must be between 0mg/L and 10mg/L"
                            )
                          );
                        }
                        return Promise.resolve();
                      },
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
                  label="Carbonate(mg/L): "
                  rules={[
                    {
                      required: true,
                      message: "Please input water report carbonate!",
                    },
                    {
                      validator(_, value) {
                        if (value < 0 || value > 10) {
                          return Promise.reject(
                            new Error(
                              "Carbonate must be between 0mg/L and 10mg/L"
                            )
                          );
                        }
                        return Promise.resolve();
                      },
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
                  label="Salt(%): "
                  rules={[
                    {
                      required: true,
                      message: "Please input water report salt!",
                    },
                    {
                      validator(_, value) {
                        if (value < 0 || value > 10) {
                          return Promise.reject(
                            new Error("Salt must be between 0% and 10%")
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} placeholder="Salt" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="waterReportCarbonDioxide"
                  label="Carbon Dioxide(mg/L): "
                  rules={[
                    {
                      required: true,
                      message: "Please input water report carbon dioxide!",
                    },
                    {
                      validator(_, value) {
                        if (value < 0 || value > 10) {
                          return Promise.reject(
                            new Error(
                              "Carbon dioxide must be between 0mg/L and 10mg/L"
                            )
                          );
                        }
                        return Promise.resolve();
                      },
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
                  label="Temperature(°C): "
                  name="waterReportTemperature"
                  rules={[
                    { required: true, message: "Please enter temperature" },
                    {
                      validator(_, value) {
                        if (value < 5 || value > 26) {
                          return Promise.reject(
                            new Error(
                              "Temperature must be between 5 and 26 degrees Celsius"
                            )
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Oxygen(mg/L): "
                  name="waterReportOxygen"
                  rules={[
                    { required: true, message: "Please enter oxygen" },
                    {
                      validator(_, value) {
                        if (value < 6.8) {
                          return Promise.reject(
                            new Error("Oxygen must be greater than 6.8 mg/L")
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="pH:"
                  name="waterReport_pH"
                  rules={[
                    { required: true, message: "Please enter pH" },
                    {
                      validator(_, value) {
                        if (value < 6.9 || value > 8) {
                          return Promise.reject(
                            new Error("pH must be between 6.9 and 8")
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Hardness(dGH): "
                  name="waterReportHardness"
                  rules={[
                    { required: true, message: "Please enter hardness" },
                    {
                      validator(_, value) {
                        if (value < 0 || value > 21) {
                          return Promise.reject(
                            new Error("Hardness must be between 0 and 21 dGH")
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ammonia(mg/L): "
                  name="waterReportAmmonia"
                  rules={[
                    { required: true, message: "Please enter ammonia" },
                    {
                      validator(_, value) {
                        if (value < 0 || value > 0.1) {
                          return Promise.reject(
                            new Error("Ammonia must be between 0 and 0.1 mg/L")
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Nitrite(mg/L): "
                  name="waterReportNitrite"
                  rules={[
                    { required: true, message: "Please enter nitrite" },
                    {
                      validator(_, value) {
                        if (value < 0 || value > 0.1) {
                          return Promise.reject(
                            new Error("Nitrite must be between 0 and 0.1 mg/L")
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Nitrate(mg/L): "
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
                  label="Carbonate(mg/L): "
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
                  label="Salt(%):"
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
                  label="Carbon Dioxide(mg/L): "
                  name="waterReportCarbonDioxide"
                  rules={[
                    { required: true, message: "Please enter carbon dioxide" },
                    {
                      validator(_, value) {
                        if (value < 5 || value > 35) {
                          return Promise.reject(
                            new Error(
                              "Carbon dioxide must be between 5 and 35 mg/L"
                            )
                          );
                        }
                        return Promise.resolve();
                      },
                    },
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
