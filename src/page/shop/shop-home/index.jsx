import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { Button, Card, Form, Image, Modal, Select, Table, Tag } from "antd";
import dayjs from "dayjs";
import { useForm } from "antd/es/form/Form";
import { useNavigate } from "react-router-dom";

function ShopHome() {
  const [dataPostPakage, setDataPostPackage] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [postType, setPostType] = useState([]);

  const [form] = useForm();

  const navigate = useNavigate();
  const showModal = () => {
    setIsOpenModal(true);
  };
  const handleCancel = () => {
    form.resetFields();
    setIsOpenModal(false);
  };

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      const response = await api.post("order", {
        detail: [
          {
            packageID: values.postType,
          },
        ],
      });
      console.log(response.data);
      window.open(response.data);
      // window.location.href = response.data;
      alert("Processing...");
      setIsOpenModal(false);
      form.resetFields();
    } catch (error) {
      console.log("Buying failed", error);
    }
  };
  const fetchPostType = async () => {
    try {
      const responsePostType = await api.get("admin/package/view/shoppackage");
      setPostType(
        responsePostType.data.result.map((postType) => ({
          value: postType.id,
          label: postType.name,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };
  const fetchPostPackage = async () => {
    try {
      const responsePostPackage = await api.get(
        "admin/package/view/shoppackage"
      );
      setDataPostPackage(responsePostPackage.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchPostPackage();
    fetchPostType();
  }, []);
  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  const columns = [
    {
      title: <b style={{ fontSize: "18px" }}>Package Type</b>,
      dataIndex: "name",
      key: "name",
      render: (text) => text.charAt(0).toUpperCase() + text.slice(1),
    },
    {
      title: <b style={{ fontSize: "18px" }}>Description</b>,
      dataIndex: "description",
      key: "description",
    },
    {
      title: <b style={{ fontSize: "18px" }}>Number of posts</b>,
      dataIndex: "numberOfPosts",
      key: "numberOfPosts",
      render: (text) => text + " posts",
    },
    {
      title: <b style={{ fontSize: "18px" }}>Duration (months)</b>,
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: <b style={{ fontSize: "18px" }}>Price (₫)</b>,
      dataIndex: "price",
      key: "price",
      render: (value) => VND.format(value),
    },
  ];

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Welcome to Sunside Koi Care!</h1>
      <br />
      <Card style={{ background: "#f5f5f5" }}>
        <p style={{ fontSize: "18px", textAlign: "center" }}>
          Thank you for trusting and choosing our service.{" "}
        </p>
        <p style={{ fontSize: "18px", textAlign: "center" }}>
          From now on, you can post to our website by selecting the “Post
          Manage” function on the navigation bar.
        </p>
      </Card>
      <br />
      <h3 style={{ textAlign: "center" }}>
        To be able to post, you need to register for one of our service packages
        below.
      </h3>
      <br />
      <Table
        dataSource={dataPostPakage.sort((a, b) => a.price - b.price)}
        columns={columns}
      />
      <div style={{ textAlign: "center" }}>
        <Button type="primary" onClick={showModal} style={{ width: "15%" }}>
          Choose Post Package
        </Button>
        <Modal
          style={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
          }}
          title="Please Chosse A Package"
          open={isOpenModal}
          footer={null}
          closable={false}
          onCancel={handleCancel}
        >
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item
              label="Post Type: "
              name="postType"
              rules={[
                { required: true, message: "Please select a post type!" },
              ]}
            >
              <Select placeholder="Select a post type" options={postType} />
            </Form.Item>
          </Form>
          <Button
            type="primary"
            onClick={() => form.submit()}
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
    </>
  );
}

export default ShopHome;
