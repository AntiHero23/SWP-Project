import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { useQueryClient } from "react-query";
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
            <p>Pond ID: {koi?.pondID}</p>
            <p>Variety ID: {koi?.koiVarietyID}</p>
            <h2>Koi Report History </h2>
            {koiReportError && <p style={{ color: "red" }}>{koiReportError}</p>}
            {!koiReportError && (
              <>
                {koiReport
                  .sort((a, b) => b.koiReportID - a.koiReportID)
                  .map((report) => (
                    <>
                      <p>Date : {report.updateDate}</p>
                      <p>Length : {report.length}</p>
                      <p>Weight : {report.weight}</p>
                    </>
                  ))}
                <h1>Koi Status Latest : {koiReportLatest.koiStatus} </h1>
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
