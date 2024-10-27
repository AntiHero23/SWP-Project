import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { render } from "react-dom";
import { Button, Form, Input, InputNumber, Modal, Select, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { useForm } from "antd/es/form/Form";

function Package() {
  const [shopPackage, setShopPackage] = useState([]);
  const [memberPackage, setMemberPackage] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [form] = useForm();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await api.post("admin/package/create", form.getFieldsValue()).then(() => {
        fetchShopPackage();
        fetchMemberPackage();
      });
      alert("Package added successfully!");
      form.resetFields();
      setIsOpenModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancel = () => {
    form.resetFields();
    setIsOpenModal(false);
  };
  const fetchShopPackage = async () => {
    try {
      const responseShopPackage = await api.get(
        "admin/package/view/shoppackage"
      );
      setShopPackage(responseShopPackage.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchMemberPackage = async () => {
    try {
      const responseMemberPackage = await api.get(
        "admin/package/view/memberpackage"
      );
      setMemberPackage(responseMemberPackage.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchShopPackage();
    fetchMemberPackage();
  }, []);
  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  const shopPackageColumns = [
    {
      title: <b style={{ fontSize: "18px" }}>Package Name</b>,
      dataIndex: "name",
      key: "name",
      render: (text) =>
        text ? text.charAt(0).toUpperCase() + text.slice(1) : "N/A",
    },
    {
      title: <b style={{ fontSize: "18px" }}>Price (₫)</b>,
      dataIndex: "price",
      key: "price",
      render: (value) => VND.format(value),
    },
    {
      title: <b style={{ fontSize: "18px" }}>Duration (months)</b>,
      dataIndex: "duration",
      key: "duration",
      render: (text) => `${text}`,
    },
    {
      title: <b style={{ fontSize: "18px" }}>Details</b>,
      dataIndex: "id",
      key: "id",
      render: (value) => (
        <Button
          type="primary"
          onClick={() => {
            navigate(`/admin/package/shop/${value}`);
          }}
        >
          Details
        </Button>
      ),
    },
  ];
  const memberPackageColumns = [
    {
      title: <b style={{ fontSize: "18px" }}>Package Name</b>,
      dataIndex: "name",
      key: "name",
      render: (text) =>
        text ? text.charAt(0).toUpperCase() + text.slice(1) : "N/A",
    },
    {
      title: <b style={{ fontSize: "18px" }}>Price (₫)</b>,
      dataIndex: "price",
      key: "price",
      render: (value) => VND.format(value),
    },
    {
      title: <b style={{ fontSize: "18px" }}>Duration (months)</b>,
      dataIndex: "duration",
      key: "duration",
      render: (text) => `${text}`,
    },
    {
      title: <b style={{ fontSize: "18px" }}>Details</b>,
      dataIndex: "id",
      key: "id",
      render: (value) => (
        <Button
          type="primary"
          onClick={() => {
            navigate(`/admin/package/member/${value}`);
          }}
        >
          Details
        </Button>
      ),
    },
  ];
  return (
    <>
      <h1 style={{ textAlign: "center" }}>Packages Management</h1>
      <br />
      <div style={{ textAlign: "center" }}>
        <Button
          type="primary"
          onClick={() => setIsOpenModal(true)}
          style={{ width: "15%" }}
        >
          Add Package
        </Button>
        <Modal
          title="Add Package"
          open={isOpenModal}
          style={{ textAlign: "center", display: "flex" }}
          footer={null}
          closable={false}
          onCancel={handleCancel}
        >
          <Form
            form={form}
            onFinish={handleSubmit}
            labelAlign="left"
            initialValues={{ role: "MEMBER" }}
          >
            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: "Please select role!" }]}
            >
              <Select
                placeholder="Please select role"
                rules={[{ required: true, message: "Please select role!" }]}
              >
                <Select.Option value="MEMBER">MEMBER</Select.Option>
                <Select.Option value="SHOP">SHOP</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Package Name"
              name="name"
              rules={[
                { required: true, message: "Please input package name!" },
              ]}
            >
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item
              label="Price (₫)"
              name="price"
              rules={[{ required: true, message: "Please input price!" }]}
            >
              <InputNumber
                placeholder="Price (₫)"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
            <Form.Item
              label="Duration (in months)"
              name="duration"
              rules={[{ required: true, message: "Please input duration!" }]}
            >
              <InputNumber
                placeholder="Months"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please input description!" }]}
            >
              <Input.TextArea
                placeholder="Description"
                autoSize={{ minRows: 4, maxRows: 6 }}
              />
            </Form.Item>
            <Form.Item
              label="Number of posts (available for shop only)"
              name="numberOfPosts"
              rules={[
                { required: true, message: "Please input number of posts!" },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Number of posts"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          </Form>
          <Button
            type="primary"
            onClick={handleSubmit}
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
      </div>
      <br />
      <br />
      <h2>Member Package</h2>
      <Table
        dataSource={memberPackage.sort((a, b) => a.duration - b.duration)}
        columns={memberPackageColumns}
      />
      <h2>Shop Package</h2>
      <Table
        dataSource={shopPackage.sort((a, b) => a.duration - b.duration)}
        columns={shopPackageColumns}
      />
    </>
  );
}

export default Package;
