import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import dayjs from "dayjs";
import {
  Button,
  Card,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Select,
  Tag,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../../assets/hook/useUpload";

function PostDetail() {
  const { id } = useParams();
  const postId = parseInt(id);
  const [form] = useForm();
  const [postDetail, setPostDetail] = useState(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  const [isRemoveModal, setIsRemoveModal] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [productTypeOptions, setProductTypeOptions] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
  const handleSubmit = async (values) => {
    console.log(values);
    try {
      if (fileList.length > 0) {
        const url = await uploadFile(fileList[0].originFileObj);
        values.image = url;
      }
      await api.put(`post/update/${postId}`, values);
      alert("Post Updated successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      setIsUpdateModal(false);
      form.resetFields();
    } catch (error) {
      // console.log("post adding failed", error);
      alert(error.response.data.message);
    }
  };
  const handleCancel = () => {
    form.resetFields();
    setIsDeleteModal(false);
    setIsUpdateModal(false);
    setIsRemoveModal(false);
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
  const fetchPostDetail = async () => {
    setLoading(true);
    try {
      const response = await api.get(`post/view/postdetail/${postId}`);
      setPostDetail(response.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPostDetail();
    fetchProductType();
  }, []);
  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Post Detail</h1>
      <br />
      {!loading && (
        <Card style={{ background: "#6495ed" }}>
          <Card>
            <h2>{postDetail.productName}</h2>
            <img
              src={postDetail?.image}
              alt={postDetail.productName}
              style={{ width: "100px" }}
            />
          </Card>
          <Card>
            <b>Product Type: </b>
            {postDetail.productTypeName}
          </Card>
          <Card>
            <b>Description: </b>
            <p>{postDetail.description}</p>
          </Card>
          <Card>
            <b>Link: </b>
            <a
              href={postDetail.link}
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {postDetail.link}
            </a>
          </Card>
          <Card>
            <b>Price: </b>
            {VND.format(postDetail.productPrice)}
          </Card>
          <Card>
            <b>Post Date: </b>
            {dayjs(postDetail.postDate).format("MMMM D, YYYY h:mm A")}
          </Card>
          <Card>
            <b>Expiration Date: </b>
            {dayjs(postDetail.expiredDate).format("MMMM D, YYYY h:mm A")}
          </Card>
          <Card>
            <b>Post Status: </b>
            <Tag color={postDetail.postStatus ? "green" : "red"}>
              {postDetail.postStatus ? "Approve" : "Pending"}
            </Tag>
          </Card>
          {postDetail.postStatus ? (
            <Card>
              <Button
                type="primary"
                danger
                onClick={() => setIsDeleteModal(true)}
                style={{
                  marginTop: "10px",
                  width: "100px",
                }}
              >
                Delete
              </Button>
              <Modal
                style={{
                  textAlign: "center",
                }}
                title="Are you sure you want to DELETE this post?"
                open={isDeleteModal}
                footer={null}
                closeIcon={null}
                onCancel={handleCancel}
              >
                <Button
                  type="primary"
                  onClick={() => {
                    setIsDeleteModal(false);
                    api
                      .delete(`/post/delete/${postId}`)
                      .then(() => {
                        fetchPostDetail();
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                    alert(
                      "Post deleted successfully! Please wait for a while!"
                    );
                    setTimeout(() => {
                      navigate("/shop/post");
                    }, 1000);
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
                  onClick={handleCancel}
                  style={{
                    width: "100px",
                    marginLeft: "50px",
                  }}
                >
                  No
                </Button>
              </Modal>
            </Card>
          ) : (
            <Card>
              <Button
                type="primary"
                onClick={() => {
                  setIsUpdateModal(true);
                }}
                style={{
                  marginTop: "10px",
                  width: "100px",
                  textAlign: "center",
                }}
              >
                Update
              </Button>
              <Modal
                title="Updating post"
                style={{
                  textAlign: "center",
                }}
                open={isUpdateModal}
                footer={null}
                closeIcon={null}
                onCancel={() => {
                  handleCancel();
                }}
              >
                <Form
                  form={form}
                  name="basic"
                  onFinish={handleSubmit}
                  initialValues={{ ...postDetail }}
                >
                  <Form.Item
                    label="Product Name: "
                    name="productName"
                    rules={[
                      { required: true, message: "Please input product name!" },
                    ]}
                  >
                    <Input placeholder="Enter product name" />
                  </Form.Item>
                  <Form.Item
                    label="Description: "
                    name="description"
                    rules={[
                      { required: true, message: "Please input description!" },
                    ]}
                  >
                    <Input.TextArea
                      autoSize={{ minRows: 8, maxRows: 12 }}
                      placeholder="Enter description"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Link: "
                    name="link"
                    rules={[{ required: true, message: "Please input link!" }]}
                  >
                    <Input placeholder="Enter link" />
                  </Form.Item>
                  <Form.Item
                    label="Image: "
                    name="image"
                    rules={[
                      { required: true, message: "Please upload image!" },
                    ]}
                  >
                    <img
                      src={postDetail?.image}
                      alt={postDetail?.productName}
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
                    label="Product Price (₫): "
                    name="productPrice"
                    rules={[{ required: true, message: "Please input price!" }]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder="Enter price (₫)"
                      min={0}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Product Type: "
                    name="producTypeID"
                    rules={[
                      { required: true, message: "Please input product type!" },
                    ]}
                  >
                    <Select
                      options={productTypeOptions}
                      placeholder="Enter product type"
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
                {/* {previewImage && (
                  <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                  />
                )} */}
              </Modal>
              <Button
                type="primary"
                danger
                onClick={() => {
                  setIsRemoveModal(true);
                }}
                style={{
                  marginTop: "10px",
                  marginLeft: "10px",
                  width: "100px",
                }}
              >
                Remove
              </Button>
              <Modal
                title="Are you sure you want to Remove this post?"
                style={{
                  textAlign: "center",
                }}
                open={isRemoveModal}
                footer={null}
                closeIcon={null}
                onCancel={() => {
                  handleCancel();
                }}
              >
                <Button
                  type="primary"
                  onClick={() => {
                    setIsRemoveModal(false);
                    api
                      .delete(`/post/delete/${postId}`)
                      .then(() => {
                        fetchPostDetail();
                      })
                      .catch((error) => console.log(error));
                    alert(
                      "Post removed successfully! Please wait for a while!"
                    );
                    setTimeout(() => {
                      navigate("/shop/post");
                    }, 1000);
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
                  onClick={handleCancel}
                  style={{
                    width: "100px",
                    marginLeft: "50px",
                  }}
                >
                  No
                </Button>
              </Modal>
            </Card>
          )}
        </Card>
      )}
    </div>
  );
}

export default PostDetail;
