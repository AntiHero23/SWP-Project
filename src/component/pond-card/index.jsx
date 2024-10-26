import "./index.scss";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

function PondCard({ pond }) {
  const navigate = useNavigate();

  return (
    <div className="pond-card">
      <div className="card-header">
        <h2>{pond.pondName}</h2>
        <img src={pond.pondImage} alt={`${pond.pondName} view`} />
      </div>

      <div className="card-details">
        <div className="detail-row">
          <span className="label">Area: </span>
          <span className="value">{pond.area} m²</span>
        </div>

        <div className="detail-row">
          <span className="label">Depth: </span>
          <span className="value">{pond.depth} m</span>
        </div>

        <div className="detail-row">
          <span className="label">Volume: </span>
          <span className="value">{pond.volume} L</span>
        </div>

        <div className="detail-row">
          <span className="label">Drain Count: </span>
          <span className="value">{pond.drainCount}</span>
        </div>

        <div className="detail-row">
          <span className="label">Skimmer Count: </span>
          <span className="value">{pond.skimmerCount}</span>
        </div>

        <div className="detail-row">
          <span className="label">Pump Capacity: </span>
          <span className="value">{pond.pumpingCapacity} L/h</span>
        </div>

        <div className="detail-row">
          <span className="label">Amount of Fish: </span>
          <span className="value">{pond.amountFish}</span>
        </div>

        <Button
          type="primary"
          onClick={() => navigate(`/pondInfo/${pond.pondID}`)}
          className="detail-button"
        >
          Detail
        </Button>
      </div>
    </div>
  );
}

export default PondCard;
