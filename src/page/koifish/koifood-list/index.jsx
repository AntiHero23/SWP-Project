import { useSelector } from "react-redux";
import api from "../../../config/axios";
import { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import "./index.scss";

const KoiFoodList = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const pondID = urlParams.get("pondID");
  const temp = urlParams.get("temp");
  const growth = urlParams.get("growth");
  const [koiFishList, setKoiFishList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const data = { pondID, temperature: temp, level: growth };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await api.post("koifood/koilist", data);
        setKoiFishList(response.data.result);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="koi-food-page">
      <div className="koi-food-container">
        <h1>Calculate Food List</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="site-card-wrapper">
            {koiFishList.map((koi) => (
              <Card
                className="koi-card"
                key={koi.koiFishID}
                title={
                  <div className="card-header">
                    <span className="koi-name">{koi.koiName}</span>
                    <span className="koi-variety">{koi.koiVariety}</span>
                  </div>
                }
              >
                <div className="card-content">
                  <div className="info-section">
                    <p><span>Age:</span> {koi.age}</p>
                    <p><span>Weight:</span> {koi.weight} g</p>
                    <p><span>Length:</span> {koi.length} cm</p>
                    <p><span>Food:</span> {koi.food} g</p>
                  </div>
                  <div className="image-section">
                    <img src={koi.image} alt={koi.koiName} className="koi-image" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KoiFoodList;
