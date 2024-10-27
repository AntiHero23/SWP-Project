import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { render } from "react-dom";
import { Button, Card, Form, Input, InputNumber, Modal, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useNavigate, useParams } from "react-router-dom";

function ShopPackage() {
  const { id } = useParams();
  const postId = id;
  const [loading, setLoading] = useState(false);
  const [shopPackage, setShopPackage] = useState([]);
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const [form] = useForm();
  const navigate = useNavigate();
  // const showModal = () => {
  //   setIsOpenModal(true);
  // };
  const handleCancelUpdate = () => {
    form.resetFields();
    setIsUpdateModal(false);
  };
  const handleSubmitUpdate = async (value) => {
    try {
      await api.put(`/admin/package/update/${postId}`, value);
      alert("Package updated successfully!");
      setIsUpdateModal(false);
      navigate("/admin/package");
    } catch (error) {
      console.log("Package updating failed", error);
    }
  };
  const fetchShopPackage = async () => {
    setLoading(true);
    try {
      const responseShopPackage = await api.get(`admin/package/view/${postId}`);
      setShopPackage(responseShopPackage.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopPackage();
  }, []);
  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1>Shop Package</h1>
        <br />
        {!loading && (
          <Card style={{ backgroundColor: "#6495ed" }}>
            <Card>
              <h2>{shopPackage.name}</h2>
            </Card>
            <Card>
              <b>{"Package For " + shopPackage.role}</b>
            </Card>
            <Card>
              <b>Description: </b>
              <p>{shopPackage.description}</p>
            </Card>
            <Card>
              <b>Price: </b>
              {VND.format(shopPackage.price)}
            </Card>
            <Card>
              <b>Duration: </b>
              {shopPackage.duration} months
            </Card>
            <Card>
              <b>Number of Posts: </b>
              {shopPackage.numberOfPosts} posts
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
                style={{
                  textAlign: "center",
                }}
                open={isUpdateModal}
                footer={null}
                closable={false}
                onCancel={() => handleCancelUpdate()}
              >
                <Form
                  form={form}
                  name="basic"
                  onFinish={handleSubmitUpdate}
                  initialValues={{ ...shopPackage }}
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
                    <Input
                      placeholder="Name"
                      defaultValue={shopPackage?.name}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Role"
                    name="role"
                    rules={[
                      {
                        required: true,
                        message: "Please input your role!",
                      },
                    ]}
                  >
                    <Select defaultValue={shopPackage?.role}>
                      <Select.Option value="MEMBER">MEMBER</Select.Option>
                      <Select.Option value="SHOP">SHOP</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Price (₫)"
                    name="price"
                    rules={[
                      {
                        required: true,
                        message: "Please input your price!",
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Price (₫)"
                      defaultValue={shopPackage?.price}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: "Please input your description!",
                      },
                    ]}
                  >
                    <Input.TextArea
                      placeholder="Description"
                      defaultValue={shopPackage?.description}
                      autoSize={{ minRows: 4, maxRows: 6 }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Duration (in months)"
                    name="duration"
                    rules={[
                      {
                        required: true,
                        message: "Please input your duration!",
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="months"
                      defaultValue={shopPackage?.duration}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Number of Posts"
                    name="numberOfPosts"
                    rules={[
                      {
                        required: true,
                        message: "Please input your number of posts!",
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="posts"
                      defaultValue={shopPackage?.numberOfPosts}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </Form>
                <Button
                  type="primary"
                  onClick={() => handleSubmitUpdate(form.getFieldValue())}
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
                  onClick={handleCancelUpdate}
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
                title="Are you sure you want to Delete this package?"
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
                      .delete(`/admin/package/delete/${postId}`)
                      .then(() => {
                        fetchShopPackage();
                      })
                      .catch((error) => console.log(error));
                    alert("Package deleted successfully!");
                    setTimeout(() => navigate("/admin/package"), 1000);
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

export default ShopPackage;
