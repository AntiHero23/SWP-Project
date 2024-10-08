import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
  Tag,
} from "antd";

import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import { useForm } from "antd/es/form/Form";

function PostPackage() {
  const [dataSourcePending, setDataSourcePending] = useState([]);
  const [dataSourceApproved, setDataSourceApproved] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = useForm();
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [priceID, setPriceID] = useState("");
  const [productTypeID, setProductTypeID] = useState("");
  const [paymentID, setPaymentID] = useState("");
  const [priceOptions, setPriceOptions] = useState([]);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [productTypeOptions, setProductTypeOptions] = useState([]);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleSubmit = async (values) => {
    console.log(values);
    try {
      const response = await api.post("post/create", values);
      console.log(response.data);
      setIsModalOpen(false);
      alert("Post added successfully");
      form.resetFields();
    } catch (error) {
      console.log("post adding failed", error);
    }
  };
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };
  const fetchPayment = async () => {
    try {
      const response = await api.get("admin/payment/viewall");
      setPaymentOptions(
        response.data.map((payment) => ({
          value: payment.paymentID,
          label: payment.paymentType,
        }))
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchPrice = async () => {
    try {
      const response = await api.get("admin/postprice/view");
      setPriceOptions(
        response.data.map((pricePost) => ({
          value: pricePost.priceID,
          label: `${pricePost.price} VND, ${pricePost.duration} months`,
        }))
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProductType = async () => {
    try {
      const response = await api.get("productType/view");
      setProductTypeOptions(
        response.data.map((productType) => ({
          value: productType.productTypeID,
          label: productType.productTypeName,
        }))
      );
      console.log(response.data);
    } catch (error) {
      console.log("fetch productType failed", error);
    }
  };
  const fetchDataPending = async () => {
    try {
      const responsePeding = await api.get("admin/post/view/pending");
      setDataSourcePending(responsePeding.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchDataApproved = async () => {
    try {
      const responseApproved = await api.get("admin/post/view/approved");
      setDataSourceApproved(responseApproved.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDataApproved();
    fetchDataPending();
    fetchPrice();
    fetchPayment();
    fetchProductType();
  }, []);
  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Product Price",
      dataIndex: "productPrice",
      key: "productPrice",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (value) => <Image src={value} />,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
    },
    {
      title: "Post Date",
      dataIndex: "postDate",
      key: "postDate",
      render: (value) => <p>{dayjs(value).format("MMMM D, YYYY h:mm A")}</p>,
    },
    {
      title: "Post Status",
      dataIndex: "postStatus",
      key: "postStatus",
      render: (value) => (
        <Tag color={value ? "green" : "red"}>
          {value ? "Approve" : "Pending"}
        </Tag>
      ),
    },
  ];

  return (
    <>
      <Button onClick={showModal}>New Post</Button>
      <Modal
        title="Add New Post"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item label="Product Name: " name="productName">
            <Input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Price: " name="productPrice">
            <InputNumber
              value={productPrice}
              onChange={(value) => setProductPrice(value)}
            />
          </Form.Item>
          <Form.Item label="Image: " name="image">
            <Input value={image} onChange={(e) => setImage(e.target.value)} />
          </Form.Item>
          <Form.Item label="Description: " name="description">
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Product Type: " name="producTypeID">
            <Select
              options={productTypeOptions}
              value={productTypeID}
              onChange={(value) => setProductTypeID(value)}
              placeholder="Select Product Type"
            />
          </Form.Item>
          <Form.Item label="Link: " name="link">
            <Input value={link} onChange={(e) => setLink(e.target.value)} />
          </Form.Item>
        </Form>
        <Form.Item label="Price Options" name="priceID">
          <Select
            options={priceOptions}
            value={priceID}
            onChange={(value) => setPriceID(value)}
            placeholder="Select Price"
          />
        </Form.Item>
        <Form.Item label="Payment" name="paymentID">
          <Select
            options={paymentOptions}
            value={paymentID}
            onChange={(value) => setPaymentID(value)}
            placeholder="Select Payment"
          />
        </Form.Item>
      </Modal>
      <h1>Post Pending Table</h1>
      <Table dataSource={dataSourcePending} columns={columns} />
      <h1>Post Approved Table</h1>
      <Table dataSource={dataSourceApproved} columns={columns} />
    </>
  );
}

export default PostPackage;
