import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
  Table,
  Upload,
} from "antd";
import dayjs from "dayjs";
import uploadFile from "../../../assets/hook/useUpload";
import { PlusOutlined } from "@ant-design/icons";

function Blog() {
  const [blog, setBlog] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const [form] = useForm();
  const navigate = useNavigate();

  const fetchBlog = async () => {
    try {
      const response = await api.get("blog");
      setBlog(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (values) => {
    try {
      const url = await uploadFile(fileList[0].originFileObj);
      values.mainImage = url;
      await api.post("blog", values);
      setIsOpenModal(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
      alert("Blog created successfully!");
      fetchBlog();
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
  const handleCancel = () => {
    form.resetFields();
    setTimeout(() => {
      window.location.reload();
    }, 500);
    setIsOpenModal(false);
  };
  useEffect(() => {
    fetchBlog();
  }, []);
  const columns = [
    {
      title: <b style={{ fontSize: "18px" }}>Title</b>,
      dataIndex: "title",
      key: "title",
    },
    {
      title: <b style={{ fontSize: "18px" }}>Author</b>,
      dataIndex: "author",
      key: "author",
    },
    {
      title: <b style={{ fontSize: "18px" }}>Published Date</b>,
      dataIndex: "publishedDate",
      key: "publishedDate",
      render: (value) => <p>{dayjs(value).format("MMMM D, YYYY h:mm A")}</p>,
    },
    {
      title: <b style={{ fontSize: "18px" }}>Main Image</b>,
      dataIndex: "mainImage",
      key: "mainImage",
      render: (value) => <Image src={value} style={{ width: "100px" }} />,
    },
    {
      title: <b style={{ fontSize: "18px" }}>Details</b>,
      dataIndex: "id",
      key: "id",
      render: (value) => (
        <Button
          type="primary"
          onClick={() => {
            navigate(`/admin/blogs/details/${value}`);
          }}
        >
          Details
        </Button>
      ),
    },
  ];
  return (
    <>
      <h1 style={{ textAlign: "center" }}>Blogs</h1>
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          type="primary"
          style={{ width: "200px" }}
          onClick={() => setIsOpenModal(true)}
        >
          New Blog
        </Button>
        <Modal
          title="Add Blog"
          open={isOpenModal}
          style={{
            textAlign: "center",
            justifyContent: "center",
          }}
          footer={null}
          closable={false}
          onCancel={() => handleCancel()}
        >
          <Form form={form} name="basic" onFinish={handleSubmit}>
            <Form.Item
              label="Title"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please input blog title!",
                },
              ]}
            >
              <Input placeholder="Title" />
            </Form.Item>
            <Form.Item
              label="Author"
              name="author"
              rules={[
                {
                  required: true,
                  message: "Please input author!",
                },
              ]}
            >
              <Input placeholder="Author" />
            </Form.Item>
            <Form.Item
              label="Main Image"
              name="mainImage"
              rules={[
                {
                  required: true,
                  message: "Please upload main image!",
                },
              ]}
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
              label="Content"
              name="content"
              rules={[
                {
                  required: true,
                  message: "Please input content!",
                },
              ]}
            >
              <Input.TextArea
                style={{ width: "100%", maxWidth: "600px" }}
                autoSize={{ minRows: 8, maxRows: 12 }}
                placeholder="Enter content"
              />
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
      <br />
      <Table dataSource={blog} columns={columns} />
    </>
  );
}

export default Blog;
