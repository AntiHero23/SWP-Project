import React, { useEffect, useState } from "react";
import "./index.scss";
import api from "../../config/axios";
import { Card, Col, Row, Button, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";

function Plan() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPurchase, setLoadingPurchase] = useState(false);
  const navigate = useNavigate();

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("admin/package/view/memberpackage");
      console.log(response.data.result);
      setPackages(response.data.result);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      message.error("Failed to load packages.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleBuyPlan = async (packageId) => {
    setLoadingPurchase(true);
    try {
      const response = await api.post("order", {
        detail: [
          {
            packageID: packageId,
          },
        ],
      });
      window.open(response.data);
      message.success("Processing your order...");
      // Optionally redirect to a confirmation page
      // navigate(`/confirmation/${packageId}`);
    } catch (error) {
      console.error("There was a problem with the buy operation:", error);
      message.error("Failed to process your order.");
    } finally {
      setLoadingPurchase(false);
    }
  };

  return (
    <div className="pricing-page">
      <h1>Pricing</h1>
      {isLoading ? (
        <Spin tip="Loading packages..." />
      ) : (
        <Row gutter={16}>
          {packages.map((pkg) => (
            <Col span={8} key={pkg.id}>
              <Card title={pkg.name} bordered={false}>
                <p>{pkg.description}</p>
                <p>Duration: {pkg.duration} months</p>
                <p>Price: {pkg.price}</p>
                <Button
                  type="primary"
                  onClick={() => handleBuyPlan(pkg.id)}
                  loading={loadingPurchase}
                >
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
