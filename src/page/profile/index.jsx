import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../zustand/useAuthStore";
import { Avatar, Button, Card, Col, Row, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import "./index.scss";

function Profile() {
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
      <Col xs={20} sm={16} md={12} lg={8}>
        <Card title="Profile">
          <div className="profile-content">
            <Avatar size={100} src={userInfo?.avatar} />
            <Typography.Title level={3}>{userInfo?.username}</Typography.Title>
            <div className="profile-info">
              <Typography.Text>Name: {userInfo?.name}</Typography.Text>
              <Typography.Text>Email: {userInfo?.email}</Typography.Text>
              <Typography.Text>Phone: {userInfo?.phone}</Typography.Text>
              <Typography.Text>Role: {userInfo?.role}</Typography.Text>
              <Typography.Text>
                Premium:{" "}
                {userInfo?.premiumStatus === 0
                  ? "Basic"
                  : userInfo?.premiumStatus === 1
                  ? "Premium"
                  : "Unknown"}
              </Typography.Text>
            </div>
            <Button type="primary" danger onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Card>
      </Col>
    </Row>
  );
}

export default Profile;
