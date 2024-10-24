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
    <div className="koi-food-list">
      <h1 className="title" style={{ textAlign: "center" }}>Calculate Food List</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="koi-card-container">
          <div className="site-card-wrapper">
          
              {koiFishList.map((koi) => (
                <Col className="koi-card-col" span={6} key={koi.koiFishID}>
                  <Card className="koi-card">
                  <div className="info-container">
                    <div className="koi-important-info">
                      <p className="koi-name">{koi.koiName}</p>
                    <div className="koi-food container">
                      <p className="koi-food-text">FOOD</p>
                      <p className="koi-food-ammount">{koi.food} g</p>
                    </div>
                    </div>
                    {/* <img
                      src={koi.image}
                      alt={koi.koiName}
                      className="koi-fish-image"
                    /> */}
                    <p>
                      <span style={{ fontWeight: "bold" }}>Variety: </span> {koi.koiVariety}
                    </p>
                    <p>
                      <span style={{ fontWeight: "bold" }}>Age:</span> {koi.age}
                    </p>
                    <p>
                      <span style={{ fontWeight: "bold" }}>Weight:</span>{" "}
                      {koi.weight} g
                    </p>
                    <p>
                      <span style={{ fontWeight: "bold" }}>Length:</span>{" "}
                      {koi.length} cm
                    </p>
                  </div>
                    {/* <p>
                      <span style={{ fontWeight: "bold" }}>Food:</span>{" "}
                      {koi.food} g
                    </p> */}
                  </Card>
                </Col>
              ))}
            
          </div>
        </div>
      )}
    </div>
  );
};

export default KoiFoodList;
