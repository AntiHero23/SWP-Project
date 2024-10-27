import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { Button, Card, Form, InputNumber, Modal, Table } from "antd";

function FeedingStandardDetails() {
  const { id } = useParams();
  const dataId = id;
  const [data, setData] = useState([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isUpdateModal, setIsUpdateModal] = useState(false);

  const [form] = useForm();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await api.get(`feedcoef/view/${dataId}`);
      setData(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdate = async () => {
    try {
      const response = await api.put(
        `feedcoef/update/${id}`,
        form.getFieldsValue()
      );
      alert("Feeding coefficient updated successfully!");
      window.location.reload();
      setIsUpdateModal(false);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancel = () => {
    form.resetFields();
    setIsUpdateModal(false);
    setIsDeleteModal(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const columns = [
    {
      title: "Low Level",
      dataIndex: "low",
      key: "low",
    },
    {
      title: "Medium Level",
      dataIndex: "medium",
      key: "medium",
    },
    {
      title: "High Level",
      dataIndex: "high",
      key: "high",
    },
  ];
  return (
    <>
      <h1>Feeding Coefficient Details</h1>
      <br />
      <div style={{ textAlign: "center" }}>
        {data && (
          <Card style={{ backgroundColor: "#6495ed" }}>
            <Card>
              <h3>Age Range (day): </h3>
              {`${data.ageFrom}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                " - " +
                `${data.ageTo}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </Card>
            <Card>
              <h3>Feeding Level</h3>
              <Table pagination={false} dataSource={[data]} columns={columns} />
            </Card>
            <Button
              type="primary"
              style={{ width: "auto", margin: "5px 5px 5px 5px" }}
              onClick={() => setIsUpdateModal(true)}
            >
              Update
            </Button>
            <Modal
              title="Update Feeding Coefficient"
              open={isUpdateModal}
              style={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
              }}
              onCancel={handleCancel}
              closable={false}
              footer={null}
            >
              <Form
                form={form}
                name="basic"
                initialValues={{ ...data }}
                onFinish={handleUpdate}
              >
                <Form.Item
                  label="Age From (day):"
                  name="ageFrom"
                  rules={[
                    {
                      required: true,
                      message: "Please input age from!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Age from"
                    style={{ float: "right", width: "125px" }}
                    min={0}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item
                  label="Age To (day):"
                  name="ageTo"
                  rules={[
                    {
                      required: true,
                      message: "Please input age to!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Age to"
                    style={{ float: "right", width: "125px" }}
                    min={0}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item
                  label="Low Level"
                  name="low"
                  rules={[
                    {
                      required: true,
                      message: "Please input low level!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Low level"
                    style={{ float: "right", width: "125px" }}
                    min={0}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item
                  label="Medium Level"
                  name="medium"
                  rules={[
                    {
                      required: true,
                      message: "Please input medium level!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Medium level"
                    style={{ float: "right", width: "125px" }}
                    min={0}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item
                  label="High Level"
                  name="high"
                  rules={[
                    {
                      required: true,
                      message: "Please input high level!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="High level"
                    style={{ float: "right", width: "125px" }}
                    min={0}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
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
              style={{ width: "auto", margin: "5px 5px 5px 5px" }}
              onClick={() => setIsDeleteModal(true)}
            >
              Delete
            </Button>
            <Modal
              title="Are you sure you want to delete this standard?"
              open={isDeleteModal}
              style={{ textAlign: "center" }}
              onCancel={handleCancel}
              closable={false}
              footer={null}
            >
              <Button
                type="primary"
                onClick={() => {
                  api
                    .delete(`feedcoef/delete/${id}`)
                    .then(() => {
                      fetchData();
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                  alert("Feeding coefficient deleted successfully!");
                  handleCancel();
                  setTimeout(() => {
                    navigate("/admin/feedingCoefficient");
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
      </div>
    </>
  );
}

export default FeedingStandardDetails;
