import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { Button, Form, Image, Modal, Select, Table, Tag } from "antd";
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
      title: "Package Type",
      dataIndex: "name",
      key: "name",
      render: (text) => text.charAt(0).toUpperCase() + text.slice(1),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Number of Posts",
      dataIndex: "numberOfPosts",
      key: "numberOfPosts",
      render: (text) => text + " posts",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (text) => text + " months",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value) => VND.format(value),
    },
  ];

  return (
    <>
      <h1>Welcome to Sunside Koi Care!</h1>
      <br />
      <p>Thank you for trusting and choosing our service. </p>
      <p>
        From now on, you can post to our website by selecting the “Post Manage”
        function on the navigation bar.
      </p>
      <br />
      <h4>
        To be able to post, you need to register for one of our service packages
        below.
      </h4>
      <Table dataSource={dataPostPakage} columns={columns} />
      <Button
        type="primary"
        onClick={showModal}
        style={{ width: "35%", marginLeft: "32.5%" }}
      >
        Choose Post Package
      </Button>
      <Modal
        style={{ textAlign: "center" }}
        title="Post Package"
        open={isOpenModal}
        onOk={() => form.submit()}
        onCancel={handleCancel}
      >
        <p style={{ textAlign: "left" }}>Please Chosse A Package</p>
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Post Type: "
            name="postType"
            rules={[{ required: true, message: "Please select a post type!" }]}
          >
            <Select options={postType} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ShopHome;
