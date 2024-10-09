import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { useQueryClient } from "react-query";
import { useForm } from "antd/es/form/Form";
import "./index.scss";
import { Form, Input, Modal } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
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
  const navigate = useNavigate();

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
          <>
            <p>Name: {koi?.koiName}</p>
            <img src={koi?.image} alt="koi" />
            <p>Sex: {koi?.koiSex}</p>
            <p>Birthday: {koi?.birthday}</p>
            <p>Pond : {koi?.pondName}</p>
            <p>Variety : {koi?.koiVariety}</p>
            <h2>Koi Report History </h2>
            <PlusCircleOutlined
              style={{ fontSize: "24px" }}
              onClick={showModal}
            />
            <Modal
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
            {koiReportError && <p style={{ color: "red" }}>{koiReportError}</p>}
            {!koiReportError && (
              <>
                {koiReport.map((report) => (
                  <>
                    <p>Date : {report.updateDate}</p>
                    <p>Length : {report.length}</p>
                    <p>Weight : {report.weight}</p>
                  </>
                ))}
                {koiReportLatest && (
                  <div>
                    <h1>
                      Koi Length Latest : {koiReportLatest.length || "N/A"}
                    </h1>
                    <h1>
                      Koi Weight Latest : {koiReportLatest.weight || "N/A"}
                    </h1>
                    <h1>
                      Koi Status Latest : {koiReportLatest.koiStatus || "N/A"}
                    </h1>
                  </div>
                )}
              </>
            )}
            <button onClick={() => navigate(-1)}>Go Back</button>
          </>
        )}
      </div>
    </div>
  );
}

export default KoiInfo;
