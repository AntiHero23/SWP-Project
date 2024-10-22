import React, { useEffect, useState } from "react";
import "./index.scss";
import api from "../../config/axios";
import { Card, Col, Row, Button } from "antd";
import { useNavigate } from "react-router-dom";

function Plan() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("admin/package/view/memberpackage");
      console.log(response.data.result);
      setPackages(response.data.result);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleBuyPlan = async (packageId) => {
    console.log(packageId);
    try {
      const response = await api.post("order", {
        detail: [
          {
            packageID: packageId,
          },
        ],
      });
      window.open(response.data);
      alert("Processing...");
    } catch (error) {
      console.error("There was a problem with the buy operation:", error);
    }
  };

  return (
    <div className="pricing-page">
      <h1>Pricing</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Row gutter={16}>
          {packages.map((pkg) => (
            <Col span={8} key={pkg.id}>
              <Card title={pkg.name} bordered={false}>
                <p>{pkg.description}</p>
                <p>Duration: {pkg.duration} months</p>
                <p>Price: {pkg.price}</p>
                <Button type="primary" onClick={() => handleBuyPlan(pkg.id)}>
                  Buy Plan
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default Plan;
