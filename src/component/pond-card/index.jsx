import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import api from "../../config/axios";

function PondCard({ pond }) {
  const {
    pondID,
    pondName,
    pondImage,
    area,
    depth,
    volume,
    drainCount,
    skimmerCount,
    pumpingCapacity,
    amountFish,
  } = pond;
  const navigate = useNavigate();
  return (
    <div className="card-pond">
      <div className="card-left">
      <p className="pond-name">Pond Name: {pondName}</p>
      <p className="pond-id">PondID : {pondID}</p>
      <img src={pondImage} alt="pond" className="pond-image" />
      </div>
      <div className="card-right">
      <p>Area: {area} m2</p>
      <p>Depth: {depth} m</p>
      <p>Volume: {volume} m3</p>
      <p>Drain Count: {drainCount}</p>
      <p>Skimmer Count: {skimmerCount}</p>
      <p>Pump Capacity: {pumpingCapacity} m3/h</p>
      <p>Amount of Fish: {amountFish}</p>
      <Button className="detail-button"
        onClick={() => {
          console.log(pondID);
          navigate(`/pondInfo/${pondID}`);
        }}
      >
        Detail
      </Button>
      </div>
    </div>
  );
}

export default PondCard;
