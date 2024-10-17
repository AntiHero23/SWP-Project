import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../../zustand/useAuthStore";
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { UserOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";

function ShopProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [userInfo, setUserInfo] = useState({});
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [form] = useForm();

  const showModal = () => {
    setIsOpenModal(true);
  };
  const handleCancel = () => {
    form.resetFields();
    setIsOpenModal(false);
  };
  const handleSubmit = async (values) => {
    try {
      await api.put("shop/update", values);
      setIsOpenModal(false);
    } catch (error) {
      console.log(error);
    }
  };
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
        <Card title="Profile" className="profile-card">
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
              Your Current Posts: {userInfo?.numberOfPosts || "-"}
            </Typography.Text>
            <Button
              type="primary"
              className="profile-button profile-button-upgrade"
              onClick={showModal}
            >
              Update Profile
            </Button>
            <Modal
              title="Update Profile"
              visible={isOpenModal}
              onOk={handleSubmit}
              onCancel={handleCancel}
            >
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ message: "Please input your name!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ message: "Please input your email!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[{ message: "Please input your phone!" }]}
                >
                  <Input />
                </Form.Item>
              </Form>
            </Modal>
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
