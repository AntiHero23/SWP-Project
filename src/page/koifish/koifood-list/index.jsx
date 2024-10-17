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

  console.log(data);
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
    <div>
      <h1 style={{ textAlign: "center" }}>Calculate Food List</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div className="site-card-wrapper">
            <Row gutter={16}>
              {koiFishList.map((koi) => (
                <Col span={6} key={koi.koiFishID}>
                  <Card title={koi.koiName} extra={<p>{koi.koiVariety}</p>}>
                    <img
                      src={koi.image}
                      alt={koi.koiName}
                      className="koi-fish-image"
                    />
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
                    <p>
                      <span style={{ fontWeight: "bold" }}>Food:</span>{" "}
                      {koi.food} g
                    </p>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      )}
    </div>
  );
};

export default KoiFoodList;
