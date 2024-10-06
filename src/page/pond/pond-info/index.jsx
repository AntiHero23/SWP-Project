import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { Button } from "antd";

function PondInfo() {
  const { id } = useParams();
  const [pond, setPond] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPond = async () => {
      try {
        const response = await api.get(`pond/${id}`);
        setPond(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPond();
  }, [id]);

  return (
    <div className="pond-info">
      <div>
        <img src={pond.pondImage} alt="pond" className="pond-image" />
        <p>Area: {pond.area} m2</p>
        <p>Depth: {pond.depth} m</p>
        <p>Volume: {pond.volume} m3</p>
        <p>Drain Count: {pond.drainCount}</p>
        <p>Skimmer Count: {pond.skimmerCount}</p>
        <p>Pumping Capacity: {pond.pumpingCapacity} m3/h</p>
        <p>Amount of Fish: {pond.amountFish}</p>
      </div>
      <Button onClick={() => navigate("/managerPond")}>Back</Button>
    </div>
  );
}

export default PondInfo;
