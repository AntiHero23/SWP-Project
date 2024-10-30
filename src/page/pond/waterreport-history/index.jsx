import React, { useState, useEffect } from "react";
import { Button, Card, Form, Row, Col, Modal } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { WATER_PARAMETERS, fetchWaterParameters } from "../../../constants/waterValidation";

import CreateWaterReportModal from "./CreateWaterReportModal";
import EditWaterReportModal from "./EditWaterReportModal";
import "./index.scss";
import api from "../../../config/axios";

const WaterReportHistory = () => {
  const { pondId } = useParams();
  const [waterReports, setWaterReports] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWaterReport, setEditingWaterReport] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [parameters, setParameters] = useState(WATER_PARAMETERS);

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
      alert("Failed to fetch water reports");
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const updatedParameters = await fetchWaterParameters();
      setParameters(updatedParameters);
      fetchWaterReports();
    };
    initialize();
  }, []);

  const isOutOfRange = (value, paramName) => {
    const param = parameters[paramName];
    if (!param) return false;
    return value !== null && (value < param.min || value > param.max);
  };

  const handleCreateWaterReport = async (values) => {
    try {
      await api.post(`waterreport/create`, values);
      alert("Water report created successfully");
      setIsModalOpen(false);
      form.resetFields();
      fetchWaterReports();
    } catch (error) {
      console.error("Error creating water report:", error);
      alert("Failed to create water report");
    }
  };

  const handleEdit = async (values) => {
    try {
      await api.put(
        `waterreport/update/${editingWaterReport.waterReportId}`,
        values
      );
      alert("Water report updated successfully");
      setIsEditModalOpen(false);
      setEditingWaterReport(null);
      form.resetFields();
      fetchWaterReports();
    } catch (error) {
      console.error("Error updating water report:", error);
      alert("Failed to update water report");
    }
  };

  const showDeleteModal = (report) => {
    setReportToDelete(report);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`waterreport/delete/${reportToDelete.waterReportId}`);
      alert("Water report deleted successfully");
      setDeleteModalVisible(false);
      setReportToDelete(null);
      fetchWaterReports();
    } catch (error) {
      console.error("Error deleting water report:", error);
      alert("Failed to delete water report");
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
                  {dayjs(report.waterReportUpdatedDate).format("YYYY-MM-DD")}
                </h3>
                <div className="report-details">
                  <p
                    className={
                      isOutOfRange(report.waterReportTemperature, "temperature")
                        ? "out-of-range"
                        : ""
                    }
                  >
                    Temperature: {report.waterReportTemperature}°C
                  </p>
                  <p
                    className={
                      isOutOfRange(report.waterReportOxygen, "oxygen")
                        ? "out-of-range"
                        : ""
                    }
                  >
                    Oxygen: {report.waterReportOxygen} mg/L
                  </p>
                  <p
                    className={
                      isOutOfRange(report.waterReport_pH, "pH")
                        ? "out-of-range"
                        : ""
                    }
                  >
                    pH: {report.waterReport_pH}
                  </p>
                  <p
                    className={
                      isOutOfRange(report.waterReportHardness, "hardness")
                        ? "out-of-range"
                        : ""
                    }
                  >
                    Hardness: {report.waterReportHardness} dGH
                  </p>
                  <p
                    className={
                      isOutOfRange(report.waterReportAmmonia, "ammonia")
                        ? "out-of-range"
                        : ""
                    }
                  >
                    Ammonia: {report.waterReportAmmonia} mg/L
                  </p>
                  <p
                    className={
                      isOutOfRange(report.waterReportNitrite, "nitrite")
                        ? "out-of-range"
                        : ""
                    }
                  >
                    Nitrite: {report.waterReportNitrite} mg/L
                  </p>
                  <p
                    className={
                      isOutOfRange(report.waterReportNitrate, "nitrate")
                        ? "out-of-range"
                        : ""
                    }
                  >
                    Nitrate: {report.waterReportNitrate} mg/L
                  </p>
                  <p
                    className={
                      isOutOfRange(report.waterReportCarbonate, "carbonate")
                        ? "out-of-range"
                        : ""
                    }
                  >
                    Carbonate: {report.waterReportCarbonate} mg/L
                  </p>
                  <p
                    className={
                      isOutOfRange(report.waterReportSalt, "salt")
                        ? "out-of-range"
                        : ""
                    }
                  >
                    Salt: {report.waterReportSalt} %
                  </p>
                  <p
                    className={
                      isOutOfRange(
                        report.waterReportCarbonDioxide,
                        "carbonDioxide"
                      )
                        ? "out-of-range"
                        : ""
                    }
                  >
                    CO₂: {report.waterReportCarbonDioxide} mg/L
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
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => showDeleteModal(report)}
                  />
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

      <Modal
        title="Delete Water Report"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => {
          setDeleteModalVisible(false);
          setReportToDelete(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this report?</p>
        <p style={{ color: "#999" }}>This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default WaterReportHistory;
