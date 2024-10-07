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
        setPond(pondResponse.data);
        const waterReportResponse = await api.get(`waterreport/${pondId}`);
        if (waterReportResponse.data) {
          setWaterReport(waterReportResponse.data);
        } else {
          console.error("WaterReport not existed");
        }
        console.log(pondId);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch pond data.");
      } finally {
        setLoading(false);
      }
    };
    fetchPond();
  }, [id]);

  return (
    <div className="pond-info">
      <div>
        <img src={pond.pondImage} alt="pond" className="pond-image" />
        <p>Area: {pond.area} m2</p>

  const handleDelete = async () => {
    try {
      await api.delete(`pond/${pondId}`);
      queryClient.invalidateQueries("ponds");
      navigate("/managerPond");
    } catch (error) {
      console.error("Failed to delete pond:", error);
    }
  };

  const handleAddWaterReport = async () => {
    try {
      const response = await api.post(`waterreport`, { pondID: pondId });
      if (response.data.message === "WaterReport not existed") {
        alert("Please create a water report.");
      } else {
        alert("Water report created successfully.");
        const waterReportResponse = await api.get(`waterreport/${pondId}`);
        setWaterReport(waterReportResponse.data);
      }
    } catch (error) {
      console.error("Failed to create water report:", error);
      alert("An error occurred while creating the water report.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pond-water-container">
      <h1 className="pond-title">{pond.pondName}</h1>
      <div className="pond-info">
        <h2>Pond Info</h2>
        <p>Name: {pond.pondName}</p>
        <p>Area: {pond.area} m²</p>
        <p>Depth: {pond.depth} m</p>
        <p>Volume: {pond.volume} m³</p>
        <p>Drain Count: {pond.drainCount}</p>
        <p>Skimmer Count: {pond.skimmerCount}</p>
        <p>Pumping Capacity: {pond.pumpingCapacity} m³/h</p>
        <p>Amount of Fish: {pond.amountFish}</p>
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
        <p>Pond ID: {waterReport.pondID}</p>
      </div>
      <Button onClick={() => navigate("/managerPond")}>Back</Button>
      <button className="delete-button" onClick={handleDelete}>
        Delete
      </button>
      <Button onClick={handleAddWaterReport} type="primary">
        Add Water Report
      </Button>
    </div>
  );
}

export default PondInfo;
