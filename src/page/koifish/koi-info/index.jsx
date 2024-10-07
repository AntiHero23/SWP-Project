import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { useQueryClient } from "react-query";
function KoiInfo() {
  const { id } = useParams();
  const KoiId = Number(id);
  const queryClient = useQueryClient();
  const [koi, setKoi] = useState(null);
  const [koiReport, setKoiReport] = useState(null);
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
    fetchKoi();
  }, [KoiId]);

  return (
    <div>
      <div>
        <h1>Koi Info</h1>
        {!loading && (
          <>
            <p>Name: {koi?.koiName}</p>
            <p>Image: {koi?.image}</p>
            <p>Sex: {koi?.koiSex}</p>
            <p>Birthday: {koi?.birthday}</p>
            <p>Pond ID: {koi?.pondID}</p>
            <p>Variety ID: {koi?.koiVarietyID}</p>
            <button onClick={() => navigate(-1)}>Go Back</button>
          </>
        )}
      </div>
    </div>
  );
}

export default KoiInfo;
