import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { useForm } from "antd/es/form/Form";
import { Button, Card, Form, Input, InputNumber, Modal, Select } from "antd";

function MemberPackage() {
  const { id } = useParams();
  const postId = id;
  const [loading, setLoading] = useState(false);
  const [memberPackage, setMemberPackage] = useState([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isUpdateModal, setIsUpdateModal] = useState(false);

  const [form] = useForm();
  const navigate = useNavigate();

  // const showUpdateModal = () => {
  //   setIsUpdateModal(true);
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
  const fetchMemberPackage = async () => {
    setLoading(true);
    try {
      const responseMemberPackage = await api.get(
        `admin/package/view/${postId}`
      );
      setMemberPackage(responseMemberPackage.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMemberPackage();
  }, []);
  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1>Member Package</h1>
        <br />
        {!loading && (
          <Card style={{ backgroundColor: "#6495ed" }}>
            <Card>
              <h2>{memberPackage.name}</h2>
            </Card>
            <Card>
              <b>{"Package for " + memberPackage.role}</b>
            </Card>
            <Card>
              <b>Description: </b>
              <p>{memberPackage.description}</p>
            </Card>

            <Card>
              <b>Price: </b>
              {VND.format(memberPackage.price)}
            </Card>

            <Card>
              <b>Duration: </b>
              {memberPackage.duration} months
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
                onCancel={() => handleCancelUpdate()}
              >
                <Form
                  form={form}
                  name="basic"
                  onFinish={handleSubmitUpdate}
                  initialValues={{ ...memberPackage }}
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
                      defaultValue={memberPackage?.name}
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
                    <Select defaultValue={memberPackage?.role}>
                      <Select.Option value="MEMBER">MEMBER</Select.Option>
                      <Select.Option value="SHOP">SHOP</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Price"
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
                      defaultValue={memberPackage?.price}
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
                      defaultValue={memberPackage?.description}
                      autoSize={{ minRows: 4, maxRows: 6 }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Duration"
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
                      defaultValue={memberPackage?.duration}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                  <Button
                    type="primary"
                    onClick={() => handleSubmitUpdate(form.getFieldsValue())}
                    style={{
                      background: "green",
                      width: "100px",
                      marginTop: "10px",
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    type="primary"
                    onClick={handleCancelUpdate}
                    style={{
                      background: "white",
                      color: "black",
                      border: "0.5px solid black",
                      width: "100px",
                      marginLeft: "50px",
                    }}
                  >
                    No
                  </Button>
                </Form>
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
                        fetchMemberPackage();
                      })
                      .catch((error) => console.log(error));
                    alert("Package deleted successfully!");
                    setTimeout(() => navigate("/admin/package"), 1000);
                    setIsDeleteModal(false);
                  }}
                  style={{
                    background: "green",
                    width: "100px",
                    marginTop: "10px",
                  }}
                >
                  Yes
                </Button>
                <Button
                  type="primary"
                  onClick={() => setIsDeleteModal(false)}
                  style={{
                    background: "white",
                    color: "black",
                    border: "0.5px solid black",
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

export default MemberPackage;
