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

  const [isTemparatureInputValid, setIsTemparatureInputValid] = useState(true);
  const handleChangeTemparatureInput = (value) => {
    if (value >= 5 && value <= 30) {
      setIsTemparatureInputValid(true);
    } else {
      setIsTemparatureInputValid(false);
    }
  };

  const [isOxygenInputValid, setIsOxygenInputValid] = useState(true);
  const handleChangeOxygenInput = (value) => {
    if (value >= 6.5) {
      setIsOxygenInputValid(true);
    } else {
      setIsOxygenInputValid(false);
    }
  };

  const [isPHInputValid, setIsPHInputValid] = useState(true);
  const handleChangePHInput = (value) => {
    if (value >= 6.9 && value <= 8) {
      setIsPHInputValid(true);
    } else {
      setIsPHInputValid(false);
    }
  };

  const [isHardnessInputValid, setIsHardnessInputValid] = useState(true);
  const handleChangeHardnessInput = (value) => {
    if (value >= 0 && value <= 21) {
      setIsHardnessInputValid(true);
    } else {
      setIsHardnessInputValid(false);
    }
  };

  const [isAmmoniaInputValid, setIsAmmoniaInputValid] = useState(true);
  const handleChangeAmmoniaInput = (value) => {
    if (value >= 0 && value <= 0.1) {
      setIsAmmoniaInputValid(true);
    } else {
      setIsAmmoniaInputValid(false);
    }
  };

  const [isNitriteInputValid, setIsNitriteInputValid] = useState(true);
  const handleChangeNitriteInput = (value) => {
    if (value >= 0 && value <= 0.1) {
      setIsNitriteInputValid(true);
    } else {
      setIsNitriteInputValid(false);
    }
  };

  const [isNitrateInputValid, setIsNitrateInputValid] = useState(true);
  const handleChangeNitrateInput = (value) => {
    if (value >= 0 && value <= 20) {
      setIsNitrateInputValid(true);
    } else {
      setIsNitrateInputValid(false);
    }
  };

  const [isSaltInputValid, setIsSaltInputValid] = useState(true);
  const handleChangeSaltInput = (value) => {
    if (value >= 0 && value <= 10) {
      setIsSaltInputValid(true);
    } else {
      setIsSaltInputValid(false);
    }
  };
  const [isCarbonateInputValid, setIsCarbonateInputValid] = useState(true);
  const handleChangeCarbonateInput = (value) => {
    if (value >= 0 && value <= 180) {
      setIsCarbonateInputValid(true);
    } else {
      setIsCarbonateInputValid(false);
    }
  };

  const [isCarbonDioxideInputValid, setIsCarbonDioxideInputValid] =
    useState(true);
  const handleChangeCarbonDioxideInput = (value) => {
    if (value >= 0 && value <= 40) {
      setIsCarbonDioxideInputValid(true);
    } else {
      setIsCarbonDioxideInputValid(false);
    }
  };
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
    form.resetFields();
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
      setIsEditModalOpen(false);
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
                      Temperature:{" "}
                      <span
                        style={{
                          color:
                            waterReport.waterReportTemperature < 5 ||
                            waterReport.waterReportTemperature > 30
                              ? "red"
                              : "inherit",
                        }}
                      >
                        {waterReport.waterReportTemperature} &deg;C
                      </span>
                    </p>
                    <p>
                      Oxygen:{" "}
                      <span
                        style={{
                          color:
                            waterReport.waterReportOxygen < 6.5
                              ? "red"
                              : "inherit",
                        }}
                      >
                        {waterReport.waterReportOxygen} mg/L
                      </span>
                    </p>
                    <p>
                      pH:{" "}
                      <span
                        style={{
                          color:
                            waterReport.waterReport_pH < 6.9 ||
                            waterReport.waterReport_pH > 8
                              ? "red"
                              : "inherit",
                        }}
                      >
                        {waterReport.waterReport_pH}
                      </span>
                    </p>
                    <p>
                      Hardness:{" "}
                      <span
                        style={{
                          color:
                            waterReport.waterReportHardness < 0 ||
                            waterReport.waterReportHardness > 21
                              ? "red"
                              : "inherit",
                        }}
                      >
                        {waterReport.waterReportHardness} dGH
                      </span>
                    </p>
                    <p>
                      Ammonia:{" "}
                      <span
                        style={{
                          color:
                            waterReport.waterReportAmmonia < 0 ||
                            waterReport.waterReportAmmonia > 0.1
                              ? "red"
                              : "inherit",
                        }}
                      >
                        {waterReport.waterReportAmmonia} mg/L
                      </span>
                    </p>
                  </div>
                  <div className="column-2">
                    <p>
                      Nitrite:{" "}
                      <span
                        style={{
                          color:
                            waterReport.waterReportNitrite < 0 ||
                            waterReport.waterReportNitrite > 0.1
                              ? "red"
                              : "inherit",
                        }}
                      >
                        {waterReport.waterReportNitrite} mg/L
                      </span>
                    </p>
                    <p>
                      Nitrate:{" "}
                      <span
                        style={{
                          color:
                            waterReport.waterReportNitrate < 0 ||
                            waterReport.waterReportNitrate > 20
                              ? "red"
                              : "inherit",
                        }}
                      >
                        {waterReport.waterReportNitrate} mg/L
                      </span>
                    </p>
                    <p>
                      Carbonate:{" "}
                      <span
                        style={{
                          color:
                            waterReport.waterReportCarbonate < 0 ||
                            waterReport.waterReportCarbonate > 180
                              ? "red"
                              : "inherit",
                        }}
                      >
                        {waterReport.waterReportCarbonate} mg/L
                      </span>
                    </p>
                    <p>
                      Salt:{" "}
                      <span
                        style={{
                          color:
                            waterReport.waterReportSalt < 0 ||
                            waterReport.waterReportSalt > 10
                              ? "red"
                              : "inherit",
                        }}
                      >
                        {waterReport.waterReportSalt} %
                      </span>
                    </p>
                    <p>
                      Carbon Dioxide:{" "}
                      <span
                        style={{
                          color:
                            waterReport.waterReportCarbonDioxide < 0 ||
                            waterReport.waterReportCarbonDioxide > 40
                              ? "red"
                              : "inherit",
                        }}
                      >
                        {waterReport.waterReportCarbonDioxide} mg/L
                      </span>
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
                    label={
                      <span>
                        Temperature(&deg;C):&nbsp;
                        <Popover
                          content={"Temperature must be between 5°C and 30°C"}
                        >
                          <AiOutlineExclamationCircle />
                        </Popover>
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please input water report temperature!",
                      },
                    ]}
                  >
                    <InputNumber
                      onChange={handleChangeTemparatureInput}
                      style={{
                        borderColor: isTemparatureInputValid ? "" : "red",
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="waterReportOxygen"
                    label={
                      <span>
                        Oxygen(mg/L):&nbsp;
                        <Popover
                          content={"Oxygen must be greater than 6.5mg/L"}
                        >
                          <AiOutlineExclamationCircle
                            style={{ float: "right" }}
                          />
                        </Popover>
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please input water report oxygen!",
                      },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      onChange={handleChangeOxygenInput}
                      style={{ borderColor: isOxygenInputValid ? "" : "red" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    name="waterReport_pH"
                    label={
                      <span>
                        pH:&nbsp;
                        <Popover content={"pH must be between 6.9 and 8"}>
                          <AiOutlineExclamationCircle
                            style={{ float: "right" }}
                          />
                        </Popover>
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please input water report pH!",
                      },
                    ]}
                  >
                    <InputNumber
                      onChange={handleChangePHInput}
                      style={{ borderColor: isPHInputValid ? "" : "red" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="waterReportHardness"
                    label={
                      <span>
                        Hardness(dGH):&nbsp;
                        <Popover
                          content={"Hardness must be between 0 and 21 dGH"}
                        >
                          <AiOutlineExclamationCircle />
                        </Popover>
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please input water report hardness!",
                      },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      onChange={handleChangeHardnessInput}
                      style={{ borderColor: isHardnessInputValid ? "" : "red" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    name="waterReportAmmonia"
                    label={
                      <span>
                        Ammonia(mg/L): &nbsp;
                        <Popover
                          content={"Ammonia must be between 0mg/L and 0.1mg/L"}
                        >
                          <AiOutlineExclamationCircle />
                        </Popover>
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please input water report ammonia!",
                      },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      onChange={handleChangeAmmoniaInput}
                      style={{
                        borderColor: isAmmoniaInputValid ? "" : "red",
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="waterReportNitrite"
                    label={
                      <span>
                        Nitrite(mg/L): &nbsp;
                        <Popover
                          content={"Nitrite must be between 0mg/L and 0.1mg/L"}
                        >
                          <AiOutlineExclamationCircle />
                        </Popover>
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please input water report nitrite!",
                      },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      onChange={handleChangeNitriteInput}
                      style={{
                        borderColor: isNitriteInputValid ? "" : "red",
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    name="waterReportNitrate"
                    label={
                      <span>
                        Nitrate(mg/L):&nbsp;
                        <Popover
                          content={"Nitrate must be between 0mg/L and 20mg/L"}
                        >
                          <AiOutlineExclamationCircle />
                        </Popover>
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please input water report nitrate!",
                      },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      onChange={handleChangeNitrateInput}
                      style={{ borderColor: isNitrateInputValid ? "" : "red" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="waterReportCarbonate"
                    label={
                      <span>
                        Carbonate(mg/L): &nbsp;
                        <Popover
                          content={
                            <div>
                              Carbonate must be between 0mg/L and 10mg/L
                            </div>
                          }
                          placement="right"
                        >
                          <AiOutlineExclamationCircle />
                        </Popover>
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please input water report carbonate!",
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Carbonate"
                      min={0}
                      onChange={handleChangeCarbonateInput}
                      style={{
                        borderColor: isCarbonateInputValid ? "" : "red",
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    name="waterReportSalt"
                    label={
                      <span>
                        Salt(%):&nbsp;
                        <Popover content={"Salt must be between 0% and 10%"}>
                          <AiOutlineExclamationCircle />
                        </Popover>
                      </span>
                    }
                    rules={[{ required: true, message: "Please enter salt" }]}
                  >
                    <InputNumber
                      min={0}
                      placeholder="Salt"
                      onChange={handleChangeSaltInput}
                      style={{
                        borderColor: isSaltInputValid ? "" : "red",
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="waterReportCarbonDioxide"
                    label={
                      <span>
                        Carbon Dioxide(mg/L):&nbsp;
                        <Popover
                          content={
                            "Carbon dioxide must be between 0mg/L and 40mg/L"
                          }
                        >
                          <AiOutlineExclamationCircle />
                        </Popover>
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Please input water report carbon dioxide!",
                      },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      onChange={handleChangeCarbonDioxideInput}
                      style={{
                        borderColor: isCarbonDioxideInputValid ? "" : "red",
                      }}
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
                    label={
                      <span>
                        Temperature(°C):&nbsp;
                        <Popover
                          placement="right"
                          content="Temperature should be between 5 and 26 degrees Celsius"
                        >
                          <AiOutlineExclamationCircle />
                        </Popover>
                      </span>
                    }
                    name="waterReportTemperature"
                    rules={[
                      { required: true, message: "Please enter temperature" },
                    ]}
                  >
                    <InputNumber
                      onChange={handleChangeTemparatureInput}
                      style={{
                        borderColor: isTemparatureInputValid ? "" : "red",
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span>
                        Oxygen(mg/L):&nbsp;
                        <Popover
                          placement="right"
                          content="Oxygen should be >= 6.5mg/L "
                        >
                          <AiOutlineExclamationCircle
                            style={{ cursor: "pointer" }}
                          />
                        </Popover>
                      </span>
                    }
                    name="waterReportOxygen"
                    rules={[{ required: true, message: "Please enter oxygen" }]}
                  >
                    <InputNumber
                      min={0}
                      onChange={handleChangeOxygenInput}
                      style={{ borderColor: isOxygenInputValid ? "" : "red" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span>
                        pH:&nbsp;
                        <Popover
                          placement="right"
                          content="pH should be between 6.9 and 8"
                        >
                          <AiOutlineExclamationCircle
                            style={{ cursor: "pointer" }}
                          />
                        </Popover>
                      </span>
                    }
                    name="waterReport_pH"
                    rules={[{ required: true, message: "Please enter pH" }]}
                  >
                    <InputNumber
                      min={0}
                      onChange={handleChangePHInput}
                      style={{
                        borderColor: isPHInputValid ? "" : "red",
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span>
                        Hardness(dGH): &nbsp;
                        <Popover
                          placement="right"
                          content="Hardness should be between 0 and 21 dGH"
                        >
                          <AiOutlineExclamationCircle
                            style={{ cursor: "pointer" }}
                          />
                        </Popover>
                      </span>
                    }
                    name="waterReportHardness"
                    rules={[
                      { required: true, message: "Please enter hardness" },
                    ]}
                  >
                    <InputNumber
                      onChange={handleChangeHardnessInput}
                      style={{ borderColor: isHardnessInputValid ? "" : "red" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span>
                        Ammonia(mg/L):&nbsp;
                        <Popover
                          placement="right"
                          content="Ammonia must be between 0 and 0.1 mg/L"
                        >
                          <AiOutlineExclamationCircle
                            style={{ cursor: "pointer" }}
                          />
                        </Popover>
                      </span>
                    }
                    name="waterReportAmmonia"
                    rules={[
                      { required: true, message: "Please enter ammonia" },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      onChange={handleChangeAmmoniaInput}
                      style={{ borderColor: isAmmoniaInputValid ? "" : "red" }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span>
                        Nitrite(mg/L):&nbsp;
                        <Popover
                          placement="right"
                          content="Nitrite must be between 0 and 0.1 mg/L"
                        >
                          <AiOutlineExclamationCircle
                            style={{ cursor: "pointer" }}
                          />
                        </Popover>
                      </span>
                    }
                    name="waterReportNitrite"
                    rules={[
                      { required: true, message: "Please enter nitrite" },
                    ]}
                  >
                    <InputNumber
                      onChange={handleChangeNitriteInput}
                      style={{
                        borderColor: isNitriteInputValid ? "" : "red",
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span>
                        Nitrate(mg/L):&nbsp;
                        <Popover
                          placement="right"
                          content="Nitrate must be between 0 and 20 mg/L"
                        >
                          <AiOutlineExclamationCircle
                            style={{ cursor: "pointer" }}
                          />
                        </Popover>
                      </span>
                    }
                    name="waterReportNitrate"
                    rules={[
                      { required: true, message: "Please enter nitrate" },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      onChange={handleChangeNitrateInput}
                      style={{
                        borderColor: isNitrateInputValid ? "" : "red",
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span>
                        Carbonate(mg/L):&nbsp;
                        <Popover
                          placement="right"
                          content="Carbonate must be between 0 and 180 mg/L"
                        >
                          <AiOutlineExclamationCircle
                            style={{ cursor: "pointer" }}
                          />
                        </Popover>
                      </span>
                    }
                    name="waterReportCarbonate"
                    rules={[
                      { required: true, message: "Please enter carbonate" },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      onChange={handleChangeCarbonateInput}
                      style={{
                        borderColor: isCarbonateInputValid ? "" : "red",
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span>
                        Salt(%):&nbsp;
                        <Popover
                          placement="right"
                          content="Salt must be between 0 and 10%"
                        >
                          <AiOutlineExclamationCircle
                            style={{ cursor: "pointer" }}
                          />
                        </Popover>
                      </span>
                    }
                    name="waterReportSalt"
                    rules={[{ required: true, message: "Please enter salt" }]}
                  >
                    <InputNumber
                      min={0}
                      onChange={handleChangeSaltInput}
                      style={{
                        borderColor: isSaltInputValid ? "" : "red",
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span>
                        Carbon Dioxide(mg/L):&nbsp;
                        <Popover
                          placement="right"
                          content="Carbon dioxide must be between 0 and 40 mg/L"
                        >
                          <AiOutlineExclamationCircle
                            style={{ cursor: "pointer" }}
                          />
                        </Popover>
                      </span>
                    }
                    name="waterReportCarbonDioxide"
                    rules={[
                      {
                        required: true,
                        message: "Please enter carbon dioxide",
                      },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      onChange={handleChangeCarbonDioxideInput}
                      style={{
                        borderColor: isCarbonDioxideInputValid ? "" : "red",
                      }}
                    />
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
