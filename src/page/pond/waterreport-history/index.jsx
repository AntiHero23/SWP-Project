import React, { useState, useEffect } from "react";
import { Button, Table, Form, Popconfirm, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import CreateWaterReportModal from "./CreateWaterReportModal";
import EditWaterReportModal from "./EditWaterReportModal";
import "./index.scss";
import api from "../../../config/axios";

const WaterReportHistory = ({ pondId }) => {
  const [waterReports, setWaterReports] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWaterReport, setEditingWaterReport] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  const fetchWaterReports = async () => {
    try {
      const response = await api.get(`/waterreport/${pondId}`);
      setWaterReports(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching water reports:", error);
      message.error("Failed to fetch water reports");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaterReports();
  }, [pondId]);

  const handleCreateWaterReport = async (values) => {
    try {
      await api.post(`/waterreport/${pondId}`, values);
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
    try {
      await api.put(`/waterreport/${editingWaterReport.waterReportID}`, values);
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
      await api.delete(`/waterreport/${id}`);
      message.success("Water report deleted successfully");
      fetchWaterReports();
    } catch (error) {
      console.error("Error deleting water report:", error);
      message.error("Failed to delete water report");
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm"),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: "Temperature (°C)",
      dataIndex: "temperature",
      key: "temperature",
    },
    {
      title: "Oxygen (mg/L)",
      dataIndex: "dissolvedOxygen",
      key: "dissolvedOxygen",
    },
    {
      title: "pH",
      dataIndex: "pH",
      key: "pH",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="action-buttons">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingWaterReport(record);
              setIsEditModalOpen(true);
              form.setFieldsValue(record);
            }}
          />
          <Popconfirm
            title="Are you sure you want to delete this report?"
            onConfirm={() => handleDelete(record.waterReportID)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="waterreport-history">
      <div className="header">
        <h1>Water Report History</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Water Report
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={waterReports}
        rowKey="waterReportID"
        loading={loading}
        scroll={{ x: true }}
      />

      <CreateWaterReportModal
        isModalOpen={isModalOpen}
        handleCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        form={form}
        handleCreateWaterReport={handleCreateWaterReport}
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
