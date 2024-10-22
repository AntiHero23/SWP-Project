import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../config/axios";
import {
  Card,
  Row,
  Button,
  Modal,
  Form,
  InputNumber,
  Input,
  Col,
  Popover,
} from "antd";
import dayjs from "dayjs";
import "./index.scss";
import { AiOutlineExclamationCircle } from "react-icons/ai";

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
      alert(error.response.data.message);
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
    <div className="waterreport-history">
      <div className="waterreport-container">
        <h1 className="history-title" style={{ textAlign: "center" }}>
          Water Report History
        </h1>
        <Button
          className="create-button"
          type="primary"
          onClick={handleOpenModal}
        >
          Create Water Report
        </Button>
        <Row className="water-report-history-container" gutter={[16, 16]}>
          {waterReportHistory
            .slice()
            .sort(
              (a, b) =>
                new Date(b.waterReportUpdatedDate) -
                new Date(a.waterReportUpdatedDate)
            )
            .map((waterReport, index) => (
              <Card
                className="water-report-card"
                key={index}
                title={dayjs(waterReport.waterReportUpdatedDate).format(
                  "DD MMM YYYY"
                )}
                style={{
                  marginBottom: 16,
                  width: "100%",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  borderRadius: "20px",
                  padding: "20px",
                  background: "rgba(255, 255, 255, 0.9)",
                  color: "#1890ff",
                }}
              >
                <div className="water-report-info">
                  <div className="column-1">
                    <p>
                      Temperature: {waterReport.waterReportTemperature} &deg;C
                    </p>
                    <p>Oxygen: {waterReport.waterReportOxygen} mg/L</p>
                    <p>pH: {waterReport.waterReport_pH}</p>
                    <p>Hardness: {waterReport.waterReportHardness} dGH</p>
                    <p>Ammonia: {waterReport.waterReportAmmonia} mg/L</p>
                  </div>
                  <div className="column-2">
                    <p>Nitrite: {waterReport.waterReportNitrite} mg/L</p>
                    <p>Nitrate: {waterReport.waterReportNitrate} mg/L</p>
                    <p>Carbonate: {waterReport.waterReportCarbonate} mg/L</p>
                    <p>Salt: {waterReport.waterReportSalt} %</p>
                    <p>
                      Carbon Dioxide: {waterReport.waterReportCarbonDioxide}{" "}
                      mg/L
                    </p>
                  </div>
                </div>
                <Button
                  className="edit-button"
                  type="primary"
                  onClick={() => {
                    setIsEditModalOpen(true);
                    setEditingWaterReport(waterReport);
                  }}
                >
                  Edit
                </Button>
                <Button
                  className="delete-button"
                  danger
                  type="primary"
                  onClick={() => handleDelete(waterReport.waterReportId)}
                >
                  Delete
                </Button>
              </Card>
            ))}
          <Modal
            className="create-popup"
            title={<h2 style={{ fontSize: "24px" }}>Edit Water Report</h2>}
            open={isEditModalOpen}
            onOk={() => form.submit()}
            onCancel={() => setIsEditModalOpen(false)}
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={editingWaterReport}
              onFinish={handleEdit}
            >
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
                    ]}
                  >
                    <InputNumber />
                    <Popover
                      content={"Temperature must be between 5°C and 26°C"}
                    >
                      <AiOutlineExclamationCircle />
                    </Popover>
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
                    ]}
                  >
                    <InputNumber min={0} />
                    <Popover content={"Oxygen must be greater than 6.5mg/L"}>
                      <AiOutlineExclamationCircle />
                    </Popover>
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
                    ]}
                  >
                    <InputNumber />
                    <Popover content={"pH must be between 6.9 and 8"}>
                      <AiOutlineExclamationCircle />
                    </Popover>
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
                    ]}
                  >
                    <InputNumber />
                    <Popover content={"Hardness must be between 0 and 21 dGH"}>
                      <AiOutlineExclamationCircle />
                    </Popover>
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
                    ]}
                  >
                    <InputNumber min={0} />
                    <Popover
                      content={"Ammonia must be between 0mg/L and 0.1mg/L"}
                    >
                      <AiOutlineExclamationCircle />
                    </Popover>
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
                    ]}
                  >
                    <InputNumber min={0} />
                    <Popover
                      content={"Nitrite must be between 0mg/L and 0.1mg/L"}
                    >
                      <AiOutlineExclamationCircle />
                    </Popover>
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
                    ]}
                  >
                    <InputNumber placeholder="Nitrate" />
                    <Popover
                      content={"Nitrate must be between 0mg/L and 20mg/L"}
                    >
                      <AiOutlineExclamationCircle />
                    </Popover>
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
                    ]}
                  >
                    <InputNumber placeholder="Carbonate" min={0} />
                  </Form.Item>
                  <Popover
                    content={
                      <div>Carbonate must be between 0mg/L and 10mg/L</div>
                    }
                  >
                    <AiOutlineExclamationCircle />
                  </Popover>
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
                    ]}
                  >
                    <InputNumber min={0} placeholder="Salt" />
                    <Popover
                      content={<div>Salt must be between 0% and 10%</div>}
                    >
                      <AiOutlineExclamationCircle />
                    </Popover>
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
                    ]}
                  >
                    <InputNumber placeholder="Carbon Dioxide" min={0} />
                    <Popover
                      content={
                        <div>
                          Carbon dioxide must be between 0mg/L and 10mg/L
                        </div>
                      }
                    >
                      <AiOutlineExclamationCircle />
                    </Popover>
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
            initialValues={{
              waterReportUpdatedDate: dayjs().format("YYYY-MM-DD"),
              waterReportTemperature: 0,
              waterReportOxygen: 0,
              waterReport_pH: 0,
              waterReportHardness: 0,
              waterReportAmmonia: 0,
              waterReportNitrite: 0,
              waterReportNitrate: 0,
              waterReportCarbonate: 0,
              waterReportSalt: 0,
              waterReportCarbonDioxide: 0,
            }}
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
                    ]}
                  >
                    <InputNumber
                      style={{
                        borderColor:
                          form.getFieldValue("waterReportTemperature") < 5 ||
                          form.getFieldValue("waterReportTemperature") > 26
                            ? "red"
                            : "",
                      }}
                      value={form.getFieldValue("waterReportTemperature")}
                    />
                    <Popover content="Temperature should be between 5 and 26 degrees Celsius">
                      <AiOutlineExclamationCircle />
                    </Popover>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Oxygen(mg/L): "
                    name="waterReportOxygen"
                    rules={[{ required: true, message: "Please enter oxygen" }]}
                  >
                    <InputNumber min={0} />
                    <Popover
                      content="Oxygen should be between 0mg/L and 10mg/L"
                      trigger="click"
                    >
                      <AiOutlineExclamationCircle
                        style={{ marginLeft: 8, cursor: "pointer" }}
                      />
                    </Popover>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="pH:"
                    name="waterReport_pH"
                    rules={[{ required: true, message: "Please enter pH" }]}
                  >
                    <InputNumber
                      style={{
                        color:
                          form.getFieldValue("waterReport_pH") < 6.9 ||
                          form.getFieldValue("waterReport_pH") > 8
                            ? "red"
                            : "inherit",
                      }}
                      min={0}
                    />
                    <Popover
                      content="pH should be between 6.9 and 8"
                      trigger="click"
                    >
                      <AiOutlineExclamationCircle
                        style={{ marginLeft: 8, cursor: "pointer" }}
                      />
                    </Popover>
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
                    ]}
                  >
                    <InputNumber />
                    <Popover
                      content="Hardness should be between 0 and 21 dGH"
                      trigger="click"
                    >
                      <AiOutlineExclamationCircle
                        style={{ marginLeft: 8, cursor: "pointer" }}
                      />
                    </Popover>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Ammonia(mg/L): "
                    name="waterReportAmmonia"
                    rules={[
                      { required: true, message: "Please enter ammonia" },
                    ]}
                  >
                    <InputNumber min={0} />
                    <Popover
                      content="Ammonia must be between 0 and 0.1 mg/L"
                      trigger="click"
                    >
                      <AiOutlineExclamationCircle
                        style={{ marginLeft: 8, cursor: "pointer" }}
                      />
                    </Popover>
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
                    ]}
                  >
                    <InputNumber min={0} />
                    <Popover
                      content="Nitrite must be between 0 and 0.1 mg/L"
                      trigger="click"
                    >
                      <AiOutlineExclamationCircle
                        style={{ marginLeft: 8, cursor: "pointer" }}
                      />
                    </Popover>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Nitrate(mg/L): "
                    name="waterReportNitrate"
                    rules={[
                      { required: true, message: "Please enter nitrate" },
                    ]}
                  >
                    <InputNumber min={0} />
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
                    <InputNumber min={0} />
                    <Popover
                      content="Carbonate must be between 0 and 180 mg/L"
                      trigger="click"
                    >
                      <AiOutlineExclamationCircle
                        style={{ marginLeft: 8, cursor: "pointer" }}
                      />
                    </Popover>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Salt(%):"
                    name="waterReportSalt"
                    rules={[{ required: true, message: "Please enter salt" }]}
                  >
                    <InputNumber min={0} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Carbon Dioxide(mg/L): "
                    name="waterReportCarbonDioxide"
                    rules={[
                      {
                        required: true,
                        message: "Please enter carbon dioxide",
                      },
                    ]}
                  >
                    <InputNumber min={0} />
                    <Popover
                      content="Carbon dioxide must be between 5 and 35 mg/L"
                      trigger="click"
                    >
                      <AiOutlineExclamationCircle
                        style={{ marginLeft: 8, cursor: "pointer" }}
                      />
                    </Popover>
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
    </div>
  );
};

export default WaterReportHistory;
