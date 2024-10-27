import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { useForm } from "antd/es/form/Form";
import { Button, Card, DatePicker, Form, Input, Modal, Upload } from "antd";
import dayjs from "dayjs";
import uploadFile from "../../../assets/hook/useUpload";
import { PlusOutlined } from "@ant-design/icons";

function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState({});
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const [form] = useForm();
  const navigate = useNavigate();

  const fetchBlog = async () => {
    try {
      const res = await api.get(`/blog/${id}`);
      console.log(res.data.result);
      console.log(res.data.result.id);
      setBlog(res.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (values) => {
    try {
      if (fileList.length > 0) {
        const url = await uploadFile(fileList[0].originFileObj);
        values.image = url;
      }
      await api.put(`/blog/${id}`, values);
      alert("Blog updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 500);
      setIsUpdateModal(false);
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
    setIsUpdateModal(false);
  };
  useEffect(() => {
    fetchBlog();
  }, []);
  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1>Blog Details</h1>
        <br />
        {blog && (
          <Card style={{ backgroundColor: "#6495ed" }}>
            <Card>
              <h2>{blog.title}</h2>
              <img
                src={blog?.mainImage}
                alt={blog?.title}
                style={{ width: "100px" }}
              />
            </Card>
            <Card>
              <b>Author: </b>
              {blog.author}
            </Card>
            <Card>
              <b>Content: </b>
              <p>
                {blog?.content?.split("\n")?.map((item, index) => (
                  <React.Fragment key={index}>
                    {item}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            </Card>
            <Card>
              <b>Published Date: </b>
              {dayjs(blog.publishedDate).format("MMMM D, YYYY h:mm A")}
            </Card>
            <Card>
              <Button
                type="primary"
                onClick={() => setIsUpdateModal(true)}
                style={{
                  marginTop: "10px",
                  width: "100px",
                  textAlign: "center",
                }}
              >
                Update
              </Button>
              <Modal
                title="Update Package"
                style={{ textAlign: "center" }}
                open={isUpdateModal}
                footer={null}
                closable={false}
                onCancel={handleCancel}
              >
                <Form
                  form={form}
                  name="basic"
                  onFinish={handleSubmit}
                  initialValues={{ ...blog }}
                >
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
                    <img
                      src={blog?.mainImage}
                      alt={blog?.title}
                      style={{ width: "100px" }}
                    />
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
                      autoSize={{ minRows: 4, maxRows: 6 }}
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
              <Button
                type="primary"
                danger
                onClick={() => setIsDeleteModal(true)}
                style={{
                  marginTop: "10px",
                  marginLeft: "10px",
                  width: "100px",
                }}
              >
                Delete
              </Button>
              <Modal
                title="Are you sure you want to Delete this blog?"
                style={{
                  textAlign: "center",
                }}
                open={isDeleteModal}
                footer={null}
                closable={false}
                onCancel={() => setIsDeleteModal(false)}
              >
                <Button
                  type="primary"
                  onClick={() => {
                    api
                      .delete(`/blog/${id}`)
                      .then(() => {
                        fetchBlog();
                      })
                      .catch((error) => console.log(error));
                    alert("Blog deleted successfully!");
                    setTimeout(() => navigate("/admin/blogs"), 1000);
                    setIsDeleteModal(false);
                  }}
                  style={{
                    width: "100px",
                    marginTop: "10px",
                  }}
                >
                  Yes
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => setIsDeleteModal(false)}
                  style={{
                    width: "100px",
                    marginLeft: "50px",
                  }}
                >
                  No
                </Button>
              </Modal>
            </Card>
          </Card>
        )}
      </div>
    </>
  );
}

export default BlogDetails;
