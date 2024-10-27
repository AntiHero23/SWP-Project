import React, { useState, useEffect } from "react";
import { Button, Card, Form, Popconfirm, message, Row, Col } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { WATER_PARAMETERS } from "../../../constants/waterValidation";

import CreateWaterReportModal from "./CreateWaterReportModal";
import EditWaterReportModal from "./EditWaterReportModal";
import "./index.scss";
import api from "../../../config/axios";

const isOutOfRange = (value, paramName) => {
  const param = WATER_PARAMETERS[paramName];
  if (!param) return false;
  return value !== null && (value < param.min || value > param.max);
};

const WaterReportHistory = () => {
  const { pondId } = useParams();
  const [waterReports, setWaterReports] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWaterReport, setEditingWaterReport] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  const fetchWaterParameters = async () => {
    try {
      const response = await api.get("admin/viewall/waterstandard");
      if (response.data.code === 1000 && response.data.result.length > 0) {
        const standards = response.data.result[0];
        Object.assign(WATER_PARAMETERS, {
          temperature: {
            min: standards.minTempStandard,
            max: standards.maxTempStandard,
            unit: "°C",
            errorMessage: `Temperature should be between ${standards.minTempStandard}°C and ${standards.maxTempStandard}°C`,
          },
          oxygen: {
            min: standards.minOxygenStandard,
            max: standards.maxOxygenStandard,
            unit: "mg/L",
            errorMessage: `Oxygen should be between ${standards.minOxygenStandard} and ${standards.maxOxygenStandard} mg/L`,
          },
          pH: {
            min: standards.min_pH_Standard,
            max: standards.max_pH_Standard,
            unit: "",
            errorMessage: `pH should be between ${standards.min_pH_Standard} and ${standards.max_pH_Standard}`,
          },
          hardness: {
            min: standards.minHardnessStandard,
            max: standards.maxHardnessStandard,
            unit: "dGH",
            errorMessage: `Hardness should be between ${standards.minHardnessStandard} and ${standards.maxHardnessStandard} dGH`,
          },
          ammonia: {
            min: standards.minAmmoniaStandard,
            max: standards.maxAmmoniaStandard,
            unit: "mg/L",
            errorMessage: `Ammonia should be between ${standards.minAmmoniaStandard} and ${standards.maxAmmoniaStandard} mg/L`,
          },
          nitrite: {
            min: standards.minNitriteStandard,
            max: standards.maxNitriteStandard,
            unit: "mg/L",
            errorMessage: `Nitrite should be between ${standards.minNitriteStandard} and ${standards.maxNitriteStandard} mg/L`,
          },
          nitrate: {
            min: standards.minNitrateStandard,
            max: standards.maxNitrateStandard,
            unit: "mg/L",
            errorMessage: `Nitrate should be between ${standards.minNitrateStandard} and ${standards.maxNitrateStandard} mg/L`,
          },
          carbonate: {
            min: standards.minCarbonateStandard,
            max: standards.maxCarbonateStandard,
            unit: "mg/L",
            errorMessage: `Carbonate should be between ${standards.minCarbonateStandard} and ${standards.maxCarbonateStandard} mg/L`,
          },
          salt: {
            min: standards.minSaltStandard,
            max: standards.maxSaltStandard,
            unit: "%",
            errorMessage: `Salt should be between ${standards.minSaltStandard} and ${standards.maxSaltStandard}%`,
          },
          carbonDioxide: {
            min: standards.minCarbonDioxideStandard,
            max: standards.maxCarbonDioxideStandard,
            unit: "mg/L",
            errorMessage: `CO₂ should be between ${standards.minCarbonDioxideStandard} and ${standards.maxCarbonDioxideStandard} mg/L`,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching water parameters:", error);
      message.error("Failed to fetch water parameters");
    }
  };

  const fetchWaterReports = async () => {
    try {
      const response = await api.get(`waterreport/view/${pondId}`);
      const sortedReports = response.data.sort(
        (a, b) =>
          new Date(b.waterReportUpdatedDate) -
          new Date(a.waterReportUpdatedDate)
      );
      setWaterReports(sortedReports);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching water reports:", error);
      message.error("Failed to fetch water reports");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaterReports();
    fetchWaterParameters();
  }, []);

  const handleCreateWaterReport = async (values) => {
    try {
      await api.post(`waterreport/create`, values);
      message.success("Water report created successfully");
      setIsModalOpen(false);
      form.resetFields();
      fetchWaterReports();
    } catch (error) {
      console.error("Error creating water report:", error);
      message.error("Failed to create water report");
    }
  };

  const handleEdit = async (values) => {
    console.log(values);
    try {
      await api.put(
        `waterreport/update/${editingWaterReport.waterReportId}`,
        values
      );
      message.success("Water report updated successfully");
      setIsEditModalOpen(false);
      setEditingWaterReport(null);
      form.resetFields();
      fetchWaterReports();
    } catch (error) {
      console.error("Error updating water report:", error);
      message.error("Failed to update water report");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`waterreport/delete/${id}`);
      message.success("Water report deleted successfully");
      fetchWaterReports();
    } catch (error) {
      console.error("Error deleting water report:", error);
      message.error("Failed to delete water report");
    }
  };

  return (
    <div className="waterreport-history">
      <div className="header">
        <h1>Water Report History</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{ width: "auto" }}
        >
          Add Water Report
        </Button>
      </div>

      {loading ? (
        <div className="loading-container">Loading...</div>
      ) : (
        <Row gutter={[16, 16]}>
          {waterReports.map((report) => (
            <Col xs={24} sm={12} md={8} lg={6} key={report.waterReportId}>
              <Card className="water-report-card">
                <h3>
                  {dayjs(report.waterReportUpdatedDate).format("YYYY-MM-DD ")}
                </h3>
                <div className="report-details">
                  <p>
                    Temperature:
                    <span
                      style={{
                        color: isOutOfRange(
                          report.waterReportTemperature,
                          "temperature"
                        )
                          ? "red"
                          : "inherit",
                      }}
                    >
                      {report.waterReportTemperature}°C
                    </span>
                  </p>
                  <p>
                    Oxygen:
                    <span
                      style={{
                        color: isOutOfRange(report.waterReportOxygen, "oxygen")
                          ? "red"
                          : "inherit",
                      }}
                    >
                      {report.waterReportOxygen} mg/L
                    </span>
                  </p>
                  <p>
                    pH:
                    <span
                      style={{
                        color: isOutOfRange(report.waterReport_pH, "pH")
                          ? "red"
                          : "inherit",
                      }}
                    >
                      {report.waterReport_pH}
                    </span>
                  </p>
                  <p>
                    Hardness:
                    <span
                      style={{
                        color: isOutOfRange(
                          report.waterReportHardness,
                          "hardness"
                        )
                          ? "red"
                          : "inherit",
                      }}
                    >
                      {report.waterReportHardness} dGH
                    </span>
                  </p>
                  <p>
                    Ammonia:
                    <span
                      style={{
                        color: isOutOfRange(
                          report.waterReportAmmonia,
                          "ammonia"
                        )
                          ? "red"
                          : "inherit",
                      }}
                    >
                      {report.waterReportAmmonia} mg/L
                    </span>
                  </p>
                  <p>
                    Nitrite:
                    <span
                      style={{
                        color: isOutOfRange(
                          report.waterReportNitrite,
                          "nitrite"
                        )
                          ? "red"
                          : "inherit",
                      }}
                    >
                      {report.waterReportNitrite} mg/L
                    </span>
                  </p>
                  <p>
                    Nitrate:
                    <span
                      style={{
                        color: isOutOfRange(
                          report.waterReportNitrate,
                          "nitrate"
                        )
                          ? "red"
                          : "inherit",
                      }}
                    >
                      {report.waterReportNitrate} mg/L
                    </span>
                  </p>
                  <p>
                    Carbonate:
                    <span
                      style={{
                        color: isOutOfRange(
                          report.waterReportCarbonate,
                          "carbonate"
                        )
                          ? "red"
                          : "inherit",
                      }}
                    >
                      {report.waterReportCarbonate} mg/L
                    </span>
                  </p>
                  <p>
                    Salt:
                    <span
                      style={{
                        color: isOutOfRange(report.waterReportSalt, "salt")
                          ? "red"
                          : "inherit",
                      }}
                    >
                      {report.waterReportSalt} %
                    </span>
                  </p>
                  <p>
                    CO₂:
                    <span
                      style={{
                        color: isOutOfRange(
                          report.waterReportCarbonDioxide,
                          "carbonDioxide"
                        )
                          ? "red"
                          : "inherit",
                      }}
                    >
                      {report.waterReportCarbonDioxide} mg/L
                    </span>
                  </p>
                </div>
                <div className="card-actions">
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setEditingWaterReport(report);
                      setIsEditModalOpen(true);
                      form.setFieldsValue({
                        temperature: report.waterReportTemperature,
                        oxygen: report.waterReportOxygen,
                        pH: report.waterReport_pH,
                        hardness: report.waterReportHardness,
                        ammonia: report.waterReportAmmonia,
                        nitrite: report.waterReportNitrite,
                        nitrate: report.waterReportNitrate,
                        carbonate: report.waterReportCarbonate,
                        salt: report.waterReportSalt,
                        carbonDioxide: report.waterReportCarbonDioxide,
                      });
                    }}
                  />
                  <Popconfirm
                    title="Are you sure you want to delete this report?"
                    onConfirm={() => handleDelete(report.waterReportId)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="primary" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <CreateWaterReportModal
        isModalOpen={isModalOpen}
        handleCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        form={form}
        handleCreateWaterReport={handleCreateWaterReport}
        pondID={pondId}
      />

      <EditWaterReportModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        form={form}
        handleEdit={handleEdit}
        editingWaterReport={editingWaterReport}
      />
    </div>
  );
};

export default WaterReportHistory;
