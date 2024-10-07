
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { Button } from "antd";
import { useQueryClient } from "react-query";
import "./index.scss";

function PondInfo() {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const pondId = Number(id);
  const [pond, setPond] = useState({});
  const [waterReport, setWaterReport] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPond = async () => {
      setLoading(true);
      try {
        const pondResponse = await api.get(`pond/${pondId}`);
        setPond(pondResponse.data.result);
        console.log(pondId);
        console.log(pondResponse.data.result);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch pond data.");
      } finally {
        setLoading(false);
      }
    };
    const fetchWaterReport = async () => {
      try {
        const waterReportResponse = await api.get(`waterreport/view/${pondId}`);
        setWaterReport(waterReportResponse.data);
      } catch (error) {
        console.error("Failed to fetch water report:", error);
        setError("Failed to fetch water report.");
      }
    };

    fetchWaterReport();
    fetchPond();
  }, [pondId]);

  const handleDelete = async () => {
    try {
      await api.delete(`pond/${pondId}`);
      queryClient.invalidateQueries("pond");
      alert("Pond deleted successfully");
      navigate("/managerPond");
    } catch (error) {
      console.error("Failed to delete pond:", error);
    }
  };

  const handleAddWaterReport = async () => {
    // try {
    //   const response = await api.post(`waterreport`, { pondID: pondId });
    //   if (response.data.message === "WaterReport not existed") {
    //     alert("Please create a water report.");
    //   } else {
    //     alert("Water report created successfully.");
    //     const waterReportResponse = await api.get(`waterreport/${pondId}`);
    //     setWaterReport(waterReportResponse.data);
    //   }
    // } catch (error) {
    //   console.error("Failed to create water report:", error);
    //   alert("An error occurred while creating the water report.");
    // }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pond-water-container">
      <div className="pond-info">
        <h2>Pond Info</h2>
        <h3>Name: {pond.pondName}</h3>
        <img src={pond.pondImage} alt="Pond Image" />
        <p>Area: {pond.area} m²</p>
        <p>Depth: {pond.depth} m</p>
        <p>Volume: {pond.volume} m³</p>
        <p>Drain Count: {pond.drainCount}</p>
        <p>Skimmer Count: {pond.skimmerCount}</p>
        <p>Pumping Capacity: {pond.pumpingCapacity} m³/h</p>
        <p>Amount of Fish: {pond.amountFish}</p>
        <div>
          <Button onClick={() => navigate(`/editPond/${pondId}`)}>Edit</Button>
        </div>
        <div>
          <Button danger onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
      <div className="pond-waterreport">
        <h2>Water Report</h2>
        <p>Water Report ID: {waterReport.waterReportId}</p>
        <p>Water Report Updated Date: {waterReport.waterReportUpdatedDate}</p>
        <p>Water Report Temperature: {waterReport.waterReportTemperature}</p>
        <p>Water Report Oxygen: {waterReport.waterReportOxygen}</p>
        <p>Water Report pH: {waterReport.waterReport_pH}</p>
        <p>Water Report Hardness: {waterReport.waterReportHardness}</p>
        <p>Water Report Ammonia: {waterReport.waterReportAmmonia}</p>
        <p>Water Report Nitrite: {waterReport.waterReportNitrite}</p>
        <p>Water Report Nitrate: {waterReport.waterReportNitrate}</p>
        <p>Water Report Carbonate: {waterReport.waterReportCarbonate}</p>
        <p>Water Report Salt: {waterReport.waterReportSalt}</p>
        <p>
          Water Report Carbon Dioxide: {waterReport.waterReportCarbonDioxide}
        </p>
        <Button onClick={handleAddWaterReport}>Add Water Report</Button>
        <Button onClick={handleDelete}>Delete Water Report</Button>
      </div>
      <Button onClick={() => navigate("/managerPond")}>Back</Button>
    </div>
  );
}

export default PondInfo;
