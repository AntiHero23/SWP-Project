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
      alert("Package added successfully");
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
      title: "Package Name",
      dataIndex: "name",
      key: "name",
      render: (text) =>
        text ? text.charAt(0).toUpperCase() + text.slice(1) : "N/A",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value) => VND.format(value),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (text) => `${text} months`,
    },
    {
      title: "Detail",
      dataIndex: "id",
      key: "id",
      render: (value) => (
        <Button
          type="primary"
          onClick={() => {
            navigate(`/admin/package/shop/${value}`);
          }}
        >
          Detail
        </Button>
      ),
    },
  ];
  const memberPackageColumns = [
    {
      title: "Package Name",
      dataIndex: "name",
      key: "name",
      render: (text) =>
        text ? text.charAt(0).toUpperCase() + text.slice(1) : "N/A",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value) => VND.format(value),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (text) => `${text} months`,
    },
    {
      title: "Detail",
      dataIndex: "id",
      key: "id",
      render: (value) => (
        <Button
          type="primary"
          onClick={() => {
            navigate(`/admin/package/member/${value}`);
          }}
        >
          Detail
        </Button>
      ),
    },
  ];
  return (
    <>
      <h1>Package Manage</h1>
      <br />
      <div style={{ textAlign: "center" }}>
        <Button
          type="primary"
          onClick={() => setIsOpenModal(true)}
          style={{ width: "25%" }}
        >
          Add Package
        </Button>
        <Modal
          title="Add Package"
          open={isOpenModal}
          onOk={handleSubmit}
          onCancel={handleCancel}
        >
          <Form form={form} onFinish={handleSubmit} labelAlign="left">
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
              <Input />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please input price!" }]}
            >
              <InputNumber
                placeholder="₫"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
            <Form.Item
              label="Duration"
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
              <Input.TextArea autoSize={{ minRows: 4, maxRows: 6 }} />
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
        </Modal>
      </div>
      <br />
      <br />
      <h2>Member Package</h2>
      <Table dataSource={memberPackage} columns={memberPackageColumns} />
      <h2>Shop Package</h2>
      <Table dataSource={shopPackage} columns={shopPackageColumns} />
    </>
  );
}

export default Package;
