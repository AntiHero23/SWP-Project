import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../../zustand/useAuthStore";
import { Avatar, Button, Card, Col, Row, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { UserOutlined } from "@ant-design/icons";

function ShopProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("currentAccount");
        setUserInfo(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Row justify="center" className="profile-container">
      <Col span={6}>
        <Card
          title="Profile"
          className="profile-card"
          cover={<img alt="example" src="/profile-bg.jpg" />}
        >
          <Space direction="vertical" size="large">
            <Avatar
              size={100}
              icon={<UserOutlined />}
              className="profile-avatar"
            />
            <Typography.Title level={3} className="profile-title">
              {userInfo?.username}
            </Typography.Title>
            <Typography.Text className="profile-text">
              Name: {userInfo?.name || "-"}
            </Typography.Text>
            <Typography.Text className="profile-text">
              Email: {userInfo?.email || "-"}
            </Typography.Text>
            <Typography.Text className="profile-text">
              Phone: {userInfo?.phone || "-"}
            </Typography.Text>
            <Typography.Text className="profile-text">
              Role: {userInfo?.role || "-"}
            </Typography.Text>
            <Typography.Text className="profile-text">
              Your Current Posts:{" N/A "}
              {/* {userInfo?.premiumStatus === 0
                ? "Basic "
                : userInfo?.premiumStatus === 1
                ? "Premium"
                : "Unknown"} */}
            </Typography.Text>
            {userInfo?.premiumStatus === 0 && (
              <Button
                type="primary"
                className="profile-button profile-button-upgrade"
                onClick={() => navigate("/")}
              >
                Upgrade to Premium
              </Button>
            )}
            <Button
              type="primary"
              danger
              className="profile-button profile-button-logout"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Space>
        </Card>
      </Col>
    </Row>
  );
}

export default ShopProfile;
