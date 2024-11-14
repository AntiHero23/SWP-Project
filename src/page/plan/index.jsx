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
    } catch (error) {
      console.error("There was a problem with the buy operation:", error);
      message.error("Failed to process your order.");
    } finally {
      setLoadingPurchase(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VND";
  };

  return (
    <div className="pricing-page">
      <h1>Pricing</h1>
      {isLoading ? (
        <Spin tip="Loading packages..." />
      ) : (
        <Row gutter={[24, 24]} className="pricing-row">
          {packages.map((pkg) => (
            <Col span={8} key={pkg.id}>
              <div className="pricing-card-wrapper">
                <Card className="pricing-card">
                  <div className="pricing-card-content">
                    <h3 className="package-title">{pkg.name}</h3>
                    <p className="package-description">{pkg.description}</p>
                    <p className="package-duration">
                      Duration: {pkg.duration} months
                    </p>
                    <p className="package-price">
                      Price: {formatPrice(pkg.price)}
                    </p>
                    <Button
                      type="primary"
                      onClick={() => handleBuyPlan(pkg.id)}
                      loading={loadingPurchase}
                    >
                      Buy Plan
                    </Button>
                  </div>
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default Plan;
