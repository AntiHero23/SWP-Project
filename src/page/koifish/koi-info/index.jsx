import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { useQueryClient } from "react-query";
function KoiInfo() {
  const { id } = useParams();
  const KoiId = Number(id);
  const [koi, setKoi] = useState(null);
  const [koiReport, setKoiReport] = useState([]);
  const [koiReportError, setKoiReportError] = useState(null);
  const [koiReportLatest, setKoiReportLatest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKoi = async () => {
      setLoading(true);
      try {
        const koiResponse = await api.get(`koifish/${KoiId}`);
        setKoi(koiResponse.data.result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    const fetchKoiReport = async () => {
      setLoading(true);
      try {
        const koiReportResponse = await api.get(
          `koireport/koiReports/${KoiId}`
        );
        setKoiReport(koiReportResponse.data.result);
      } catch (error) {
        console.log(error);
        setKoiReportError("You dont have any koi report yet");
      } finally {
        setLoading(false);
      }
    };
    const fetchKoiLatestReport = async () => {
      setLoading(true);
      try {
        const koiReportLatestResponse = await api.get(
          `koireport/latestKoiReport/${KoiId}`
        );
        setKoiReportLatest(koiReportLatestResponse.data.result);
      } catch (error) {
        console.log(error);
        setKoiReportError("You dont have any koi report yet");
      } finally {
        setLoading(false);
      }
    };
    fetchKoiLatestReport();
    fetchKoiReport();
    fetchKoi();
  }, [KoiId]);

  return (
    <div>
      <div>
        <h1>Koi Info</h1>
        {!loading && (
          <>
            <p>Name: {koi?.koiName}</p>
            <img src={koi?.image} alt="koi" />
            <p>Sex: {koi?.koiSex}</p>
            <p>Birthday: {koi?.birthday}</p>
            <p>Pond : {koi?.pondName}</p>
            <p>Variety : {koi?.koiVariety}</p>
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
                {koiReportLatest && (
                  <h1>
                    Koi Status Latest : {koiReportLatest.koiStatus || "N/A"}
                  </h1>
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
