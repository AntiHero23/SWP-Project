import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../zustand/useAuthStore";
import { Avatar, Button, Card, Col, Row, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { UserOutlined } from "@ant-design/icons";

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
    <Row justify="center">
      <Col span={8}>
        <Card title="Profile" style={{ marginTop: 16 }}>
          <Space direction="vertical" size="large">
            <Avatar size={100} icon={<UserOutlined />} />
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
          </Space>
        </Card>
      </Col>
    </Row>
  );
}

export default Profile;
