import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../zustand/useAuthStore";
import {
  Alert,
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
import api from "../../config/axios";
import { UserOutlined } from "@ant-design/icons";
import "./index.scss";
import dayjs from "dayjs";

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [userInfo, setUserInfo] = useState({});
  const [isModalVisibleUpdate, setIsModalVisibleUpdate] = useState(false);
  const [isModalVisibleChangePassword, setIsModalVisibleChangePassword] =
    useState(false);
  const [form] = Form.useForm();
  const fetchUser = async () => {
    try {
      const response = await api.get("currentAccount");
      setUserInfo(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  const showModalUpdate = () => {
    setIsModalVisibleUpdate(true);
  };

  const handleUpdateProfile = async (values) => {
    try {
      const response = await api.put("member/update", values);
      alert("Profile updated successfully");
      setIsModalVisibleUpdate(false);
      form.resetFields();
      fetchUser();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelUpdate = () => {
    setIsModalVisibleUpdate(false);
  };

  const showModalChangePassword = () => {
    setIsModalVisibleChangePassword(true);
  };

  const handleChangePassword = async (values) => {
    console.log(values);
    try {
      const response = await api.put("changepassword", values);
      alert("Password changed successfully");
      setIsModalVisibleChangePassword(false);
      form.resetFields();
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  };

  const handleCancelChangePassword = () => {
    setIsModalVisibleChangePassword(false);
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
              Your Current Plan:{" "}
              {userInfo?.premiumStatus === 0
                ? "Basic "
                : userInfo?.premiumStatus === 1
                ? "Premium"
                : "Unknown"}
            </Typography.Text>
            {userInfo?.premiumStatus === 0 && (
              <Button
                type="primary"
                className="profile-button profile-button-upgrade"
                onClick={() => navigate("/buyPlan")}
              >
                Upgrade to Premium
              </Button>
            )}
            {userInfo?.premiumStatus === 1 && (
              <Typography className="profile-text">
                Your Premium Plan will expire on{" "}
                {dayjs(userInfo?.expiredDate).format("MMMM D, YYYY")}
              </Typography>
            )}
            <Button
              type="primary"
              className="profile-button"
              onClick={showModalUpdate}
            >
              Update Profile
            </Button>
            <Button
              type="primary"
              className="profile-button"
              onClick={showModalChangePassword}
            >
              Change Password
            </Button>
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
      <Modal
        title="Update Profile"
        visible={isModalVisibleUpdate}
        onCancel={handleCancelUpdate}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ ...userInfo }}
          onFinish={handleUpdateProfile}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please input your phone!" },
              {
                pattern: /^0\d{9,10}$/, // 10 digits
                message: "Phone number must start with 0 and have 10 digits",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Change Password"
        visible={isModalVisibleChangePassword}
        onCancel={handleCancelChangePassword}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          name="changePassword"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={handleChangePassword}
          autoComplete="off"
        >
          <Form.Item
            label="Current Password"
            name="oldPassword"
            rules={[
              {
                required: true,
                message: "Please input your current password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please input your new password!" },
              {
                min: 6,
                message: "Password must contain at least 6 characters",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm New Password"
            name="confirmNewPassword"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your new password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
}

export default Profile;
