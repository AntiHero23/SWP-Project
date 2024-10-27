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
  const [isOpenPasswordModal, setIsOpenPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatedUserInfo, setUpdatedUserInfo] = useState(null);
  const [form] = useForm();

  const showModal = () => {
    setIsOpenModal(true);
  };
  const handleCancel = () => {
    form.resetFields();
    setIsOpenModal(false);
  };
  const handleSubmit = async (values) => {
    if (values.name === "") {
      alert("Name is required");
      return;
    }
    if (!values.email.endsWith("@gmail.com")) {
      alert("Email must end with '@gmail.com'");
      return;
    }
    if (!values.phone.startsWith("0") || values.phone.length !== 10) {
      alert("Phone must start with 0 and have 10 numbers");
      return;
    }
    try {
      await api.put("shop/update", values);
      alert("Profile updated successfully!");
      setIsOpenModal(false);
      window.location.reload();
    } catch (error) {
      console.log("Profile update failed", error);
    }
  };

  const showModalPassword = () => {
    setIsOpenPasswordModal(true);
  };
  const handleCancelPassword = () => {
    form.resetFields();
    setIsOpenPasswordModal(false);
  };
  const handleChangePassword = async (values) => {
    if (values.newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    if (values.newPassword !== values.confirmPassword) {
      form.setFields([
        {
          name: "password",
          errors: ["Password and confirm password do not match"],
        },
      ]);
      alert("Password and confirm password do not match");
      return;
    }
    try {
      await api.put("changepassword", values);
      alert("Password changed successfully!");
      form.resetFields();
      setIsOpenPasswordModal(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        alert("Password change failed");
        console.log("Password change failed", error);
      }
      console.log("Password change failed", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await api.get("currentAccount");
        setUserInfo(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // const handleLogout = () => {
  //   logout();
  //   localStorage.removeItem("token");
  //   navigate("/login");
  // };

  return (
    <>
      {!loading && (
        <Row
          className="profile-container"
          style={{ textAlign: "center", justifyContent: "center" }}
        >
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
                  <b>Name: </b>
                  {userInfo?.name || "-"}
                </Typography.Text>
                <Typography.Text className="profile-text">
                  <b>Email: </b>
                  {userInfo?.email || "-"}
                </Typography.Text>
                <Typography.Text className="profile-text">
                  <b>Phone: </b>
                  {userInfo?.phone || "-"}
                </Typography.Text>
                <Typography.Text className="profile-text">
                  <b>Role: </b>
                  {userInfo?.role || "-"}
                </Typography.Text>
                <Typography.Text className="profile-text">
                  <b>Your Current Posts: </b>
                  {userInfo?.numberOfPosts || "-"}
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
                  open={isOpenModal}
                  style={{
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  footer={null}
                  closable={false}
                  onCancel={handleCancel}
                >
                  <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ ...userInfo }}
                    onFinish={handleSubmit}
                  >
                    <Form.Item
                      label="Name"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Please input your name!",
                        },
                      ]}
                    >
                      <Input defaultValue={userInfo?.name} />
                    </Form.Item>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Please input your email!",
                        },
                      ]}
                    >
                      <Input defaultValue={userInfo?.email} />
                    </Form.Item>
                    <Form.Item
                      label="Phone"
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: "Please input your phone!",
                        },
                      ]}
                    >
                      <Input defaultValue={userInfo?.phone} />
                    </Form.Item>
                  </Form>
                  <Button
                    type="primary"
                    onClick={() => handleSubmit(form.getFieldsValue())}
                    style={{
                      width: "100px",
                      marginTop: "10px",
                    }}
                  >
                    Confirm
                  </Button>
                  <Button
                    type="primary"
                    danger
                    onClick={handleCancel}
                    style={{
                      width: "100px",
                      marginLeft: "50px",
                    }}
                  >
                    Cancel
                  </Button>
                </Modal>
                <Button type="primary" onClick={showModalPassword}>
                  Change Password
                </Button>
                <Modal
                  title="Change Password"
                  open={isOpenPasswordModal}
                  style={{
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  footer={null}
                  closable={false}
                  onCancel={handleCancelPassword}
                >
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleChangePassword}
                    initialValues={userInfo}
                  >
                    <Form.Item
                      label="Old Password"
                      name="oldPassword"
                      rules={[
                        {
                          required: true,
                          message: "Please input your old password!",
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Form.Item
                      label="New Password"
                      name="newPassword"
                      rules={[
                        {
                          required: true,
                          message: "Please input your new password!",
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Form.Item
                      label="Confirm Password"
                      name="confirmPassword"
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your new password!",
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </Form>
                  <Button
                    type="primary"
                    onClick={() => handleChangePassword(form.getFieldsValue())}
                    style={{
                      width: "100px",
                      marginTop: "10px",
                    }}
                  >
                    Confirm
                  </Button>
                  <Button
                    type="primary"
                    danger
                    onClick={handleCancel}
                    style={{
                      width: "100px",
                      marginLeft: "50px",
                    }}
                  >
                    Cancel
                  </Button>
                </Modal>
                {/* <Button
              type="primary"
              danger
              className="profile-button profile-button-logout"
              onClick={handleLogout}
            >
              Logout
            </Button> */}
              </Space>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
}

export default ShopProfile;
