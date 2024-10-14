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
  Upload,
} from "antd";

import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../../assets/hook/useUpload";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";

function PostView() {
  const [dataSourcePending, setDataSourcePending] = useState([]);
  const [dataSourceApproved, setDataSourceApproved] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataPostDetail, setDataPostDetail] = useState({});

  const [form] = useForm();

  const [priceOptions, setPriceOptions] = useState([]);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [productTypeOptions, setProductTypeOptions] = useState([]);

  const navigate = useNavigate();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleSubmit = async (values) => {
    console.log(values);
    try {
      // const url = await uploadFile(values.image.file.originFileObj);
      const url = await uploadFile(fileList[0].originFileObj);
      values.image = url;
      await api.post("post/create", values);
      alert("Post added successfully");
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.log("post adding failed", error);
    }
  };
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };
  const fetchPostDetail = async (values) => {
    try {
      const response = await api.get(`/post/view/postDetail/${values}`);
      setDataPostDetail(response.data.result);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
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
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
        color: "black",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
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
      setDataSourcePending(responsePeding.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchDataApproved = async () => {
    try {
      const responseApproved = await api.get("admin/post/view/approved");
      setDataSourceApproved(responseApproved.data.result);
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
    // {
    //   title: "Description",
    //   dataIndex: "description",
    //   key: "description",
    // },
    // {
    //   title: "Link",
    //   dataIndex: "link",
    //   key: "link",
    // },
    // {
    //   title: "Post Date",
    //   dataIndex: "postDate",
    //   key: "postDate",
    //   render: (value) => <p>{dayjs(value).format("MMMM D, YYYY h:mm A")}</p>,
    // },
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
    {
      title: "Details",
      dataIndex: "postDetailId",
      key: "postDetailId",
      render: (value) => (
        <Button
          type="primary"
          onClick={() => {
            api.get(`/post/view/postDetail/${value}`).then(() => {
              fetchPostDetail(value);
            });
          }}
          // onClick={navigate(`/postDetail/${value}`)}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={showModal}>
        New Post
      </Button>
      <Modal
        title="Add New Post"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Product Name: "
            name="productName"
            rules={[{ required: true, message: "Please input product name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description: "
            name="description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <Input.TextArea autoSize={{ minRows: 4, maxRows: 6 }} />
          </Form.Item>
          <Form.Item
            label="Link: "
            name="link"
            rules={[{ required: true, message: "Please input link!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Image: "
            name="image"
            rules={[{ required: true, message: "Please upload image!" }]}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            label="Product Price: "
            name="productPrice"
            rules={[{ required: true, message: "Please input price!" }]}
          >
            <InputNumber />
          </Form.Item>
          {/* <Form.Item
            label="Payment: "
            name="paymentID"
            rules={[{ required: true, message: "Please input payment!" }]}
          >
            <Select options={paymentOptions} />
          </Form.Item> */}
          <Form.Item
            label="Product Type: "
            name="producTypeID"
            rules={[{ required: true, message: "Please input product type!" }]}
          >
            <Select options={productTypeOptions} />
          </Form.Item>
          {/* <Form.Item
            label="Price: "
            name="priceID"
            rules={[{ required: true, message: "Please input way to pay!" }]}
          >
            <Select options={priceOptions} />
          </Form.Item> */}
        </Form>
        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </Modal>
      <h2>Pending</h2>
      <Table dataSource={dataSourcePending} columns={columns} />
      <h2>Approved</h2>
      <Table dataSource={dataSourceApproved} columns={columns} />
    </>
  );
}

export default PostView;
