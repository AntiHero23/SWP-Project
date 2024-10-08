import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { useQueryClient } from "react-query";
import { Button, Form, Input, Modal } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { MdDelete } from "react-icons/md";
import "./index.scss";

import dayjs from "dayjs";
import { Delete } from "lucide-react";
function KoiInfo() {
  const { id } = useParams();
  const koiId = parseInt(id);
  const [form] = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [koi, setKoi] = useState(null);
  const [koiReport, setKoiReport] = useState([]);
  const [koiReportError, setKoiReportError] = useState(null);
  const [koiReportLatest, setKoiReportLatest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDeleteKoiReport = async (koiReportID) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this koi report?"
    );
    if (isConfirmed) {
      try {
        await api.delete(`koireport/${koiReportID}`);
        fetchKoiReport();
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const fetchKoiReport = async () => {
    setLoading(true);
    try {
      const koiReportResponse = await api.get(`koireport/koiReports/${id}`);
      console.log(koiReportResponse.data.result);
      setKoiReport(koiReportResponse.data.result);
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
      form.resetFields();
      setIsModalOpen(false);
      fetchKoiReport();
    } catch (error) {
      console.log("koi report adding failed", error);
    }
  };
  useEffect(() => {
    const fetchKoi = async () => {
      setLoading(true);
      try {
        const { data: koi } = await api.get(`koifish/${id}`);
        setKoi(koi.result);
        console.log(koi.result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchKoiLatestReport = async () => {
      setLoading(true);
      try {
        const koiReportLatestResponse = await api.get(
          `koireport/latestKoiReport/${id}`
        );
        setKoiReportLatest(koiReportLatestResponse.data.result);
      } catch (error) {
        console.log(error);
        setKoiReportError("You dont have any koi report yet");
      } finally {
        setLoading(false);
      }
    };
    fetchKoi();
    fetchKoiReport();
    fetchKoiLatestReport();
  }, []);

  return (
    <div className="koi-page">
      <div className="koi-container">
        <h1 className="info-title">Koi Info</h1>
        {!loading && (
          <div className="koi-info-container">
            <div className="koi-info">
              <img className="koi-img" src={koi?.image} alt="koi" />
              <div className="koi-stats">
                <p className="koi-name"> Name: {koi?.koiName}</p>
                <p>Sex: {koi?.koiSex}</p>
                <p>Birthday: {dayjs(koi?.birthday).format("DD MMM YYYY")}</p>
                <p>Pond : {koi?.pondName}</p>
                <p>Variety : {koi?.koiVariety}</p>
                <p>Koi Fish ID : {koi?.koiFishID}</p>
                {koiReportLatest && (
                  <div>
                    <h1>Koi Lastest Status</h1>
                    <h3>Koi Length: {koiReportLatest.length || "N/A"}</h3>
                    <h3>Koi Weight: {koiReportLatest.weight || "N/A"}</h3>
                    <h3>Koi Status: {koiReportLatest.koiStatus || "N/A"}</h3>
                  </div>
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
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                  <Form.Item label="Date" name="updateDate">
                    <Input type="date" placeholder="Date" />
                  </Form.Item>
                  <Form.Item label="Length" name="length">
                    <Input type="number" placeholder="Length" />
                  </Form.Item>
                  <Form.Item label="Weight" name="weight">
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
                          <p>Length : {report.length}</p>
                          <p>Weight : {report.weight}</p>
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
