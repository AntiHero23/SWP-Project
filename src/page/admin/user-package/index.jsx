import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { useForm } from "antd/es/form/Form";
import { Button, Form, Input, InputNumber, Modal, Select } from "antd";

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
        {!loading && (
          <div>
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <h2>{memberPackage.name}</h2>
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <b>Package for {memberPackage.role}</b>
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <b>Description: </b>
            <p>{memberPackage.description}</p>
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <b>Price: </b>
            {VND.format(memberPackage.price)}
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <b>Duration: </b>
            {memberPackage.duration} months
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
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
              onOk={() => handleSubmitUpdate(form.getFieldsValue())}
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
                  <Input defaultValue={memberPackage?.name} />
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
                  <InputNumber defaultValue={memberPackage?.price} />
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
                  <InputNumber defaultValue={memberPackage?.duration} />
                </Form.Item>
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
              onOk={() => {
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
              onCancel={() => {
                setIsDeleteModal(false);
              }}
            />
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
          </div>
        )}
      </div>
    </>
  );
}

export default MemberPackage;
