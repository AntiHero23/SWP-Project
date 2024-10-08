import React from "react";
import { useNavigate } from "react-router-dom";
function KoiCard({
  koi: { koiFishID, koiName, birthday, koiSex, image, pondName, koiVariety },
}) {
  const navigate = useNavigate();
  return (
    <div key={koiFishID} className="koi-fish">
      <div className="koi-fish-info">
        <h2 className="koi-fish-name">{koiName}</h2>
        <img src={image} alt={koiName} className="koi-fish-image" />
        <hr />
        <p className="koi-fish-birthday">Birthday: {birthday}</p>
        <p className="koi-fish-sex">Sex: {koiSex}</p>
        <p className="koi-fish-pond">Pond: {pondName}</p>
        <p className="koi-fish-variety">Variety: {koiVariety}</p>

        <button
          className="see-more-button"
          onClick={() => navigate(`/koiInfo/${koiFishID}`)}
        >
          See More Details
        </button>
      </div>
    </div>
  );
}

export default KoiCard;
