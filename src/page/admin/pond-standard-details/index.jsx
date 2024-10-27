import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { Button, Card, Col, Form, InputNumber, Modal, Row } from "antd";
import { useForm } from "antd/es/form/Form";

function PondStandardDetails() {
  const { id } = useParams();
  const pondStandardId = id;
  const [loading, setLoading] = useState(true);
  const [PondStandardDetails, setPondStandardDetail] = useState(null);
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const [form] = useForm();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await api.put(
        `admin/pondstandard/update/${pondStandardId}`,
        form.getFieldsValue()
      );
      alert("Pond standard updated successfully!");
      window.location.reload();
      setIsUpdateModal(false);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancel = async () => {
    form.resetFields();
    setIsUpdateModal(false);
  };
  const fetchPondStandardDetail = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `admin/viewPondstandard/${pondStandardId}`
      );
      setPondStandardDetail(response.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPondStandardDetail();
  }, []);

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1>Pond Standard Details</h1>
        <br />
        {!loading && (
          <Card>
            <Card style={{ backgroundColor: "#6495ed" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <div style={{ margin: "5px" }}>
                  <Card>
                    <b>Acreage: </b>
                    {`${PondStandardDetails.area}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    ) + " m²"}
                  </Card>
                  <Card style={{ marginTop: "10px" }}>
                    <b>Depth: </b>
                    {`${PondStandardDetails.minDepth}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    ) +
                      " - " +
                      `${PondStandardDetails.maxDepth}`.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      ) +
                      " m"}
                  </Card>
                  <Card style={{ marginTop: "10px" }}>
                    <b>Volume: </b>
                    {`${PondStandardDetails.minVolume}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    ) +
                      " - " +
                      `${PondStandardDetails.maxVolume}`.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      ) +
                      " l"}
                  </Card>
                </div>
                <div style={{ margin: "5px" }}>
                  <Card>
                    <b>Drain Count: </b>
                    {`${PondStandardDetails.drainCount}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    ) + " drains"}
                  </Card>
                  <Card style={{ marginTop: "10px" }}>
                    <b>Skimmer Count: </b>
                    {`${PondStandardDetails.skimmerCount}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    ) + " skimmers"}
                  </Card>
                </div>
                <div style={{ margin: "5px" }}>
                  <Card>
                    <b>Number of Fish: </b>
                    {`${PondStandardDetails.minAmountFish}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    ) +
                      " - " +
                      `${PondStandardDetails.maxAmountFish}`.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      ) +
                      " fish"}
                  </Card>
                  <Card style={{ marginTop: "10px" }}>
                    <b>Pumping Capacity: </b>
                    {`${PondStandardDetails.minPumpingCapacity}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    ) +
                      " - " +
                      `${PondStandardDetails.maxPumpingCapacity}`.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      ) +
                      " l/h"}
                  </Card>
                </div>
              </div>
            </Card>
            <Button
              type="primary"
              onClick={() => {
                setIsUpdateModal(true);
              }}
              style={{
                marginTop: "10px",
                width: "200px",
              }}
            >
              Update
            </Button>
            <Modal
              title="Update Pond Standard Details"
              open={isUpdateModal}
              style={{ textAlign: "center" }}
              footer={null}
              closable={false}
              onCancel={handleCancel}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form
                    form={form}
                    name="basic"
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    initialValues={{
                      ...PondStandardDetails,
                    }}
                    onFinish={handleSubmit}
                  >
                    <Form.Item
                      label="Acreage"
                      name="area"
                      rules={[
                        {
                          required: true,
                          message: "Please input your area!",
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        placeholder="m²"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Drain Count"
                      name="drainCount"
                      rules={[
                        {
                          required: true,
                          message: "Please input your drain count!",
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        placeholder="drains"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Skimmer Count"
                      name="skimmerCount"
                      rules={[
                        {
                          required: true,
                          message: "Please input your skimmer count!",
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        placeholder="skimmers"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      />
                    </Form.Item>
                  </Form>
                </Col>
                <Col span={8}>
                  <Form
                    form={form}
                    name="basic"
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    initialValues={{
                      ...PondStandardDetails,
                    }}
                    onFinish={handleSubmit}
                  >
                    <Form.Item
                      label="Min Depth"
                      name="minDepth"
                      rules={[
                        {
                          required: true,
                          message: "Please input your min depth!",
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        placeholder="m"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Min Volume"
                      name="minVolume"
                      rules={[
                        {
                          required: true,
                          message: "Please input your min volume!",
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        placeholder="l"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Min Number of Fish"
                      name="minAmountFish"
                      rules={[
                        {
                          required: true,
                          message: "Please input your min amount of fish!",
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        placeholder="fish"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Min Pumping Capacity"
                      name="minPumpingCapacity"
                      rules={[
                        {
                          required: true,
                          message: "Please input your min pumping capacity!",
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        placeholder="l/h"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      />
                    </Form.Item>
                  </Form>
                </Col>
                <Col span={8}>
                  <Form
                    form={form}
                    name="basic"
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    initialValues={{
                      ...PondStandardDetails,
                    }}
                    onFinish={handleSubmit}
                  >
                    <Form.Item
                      label="Max Depth"
                      name="maxDepth"
                      rules={[
                        {
                          required: true,
                          message: "Please input your max depth!",
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        placeholder="m"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Max Volume"
                      name="maxVolume"
                      rules={[
                        {
                          required: true,
                          message: "Please input your max volume!",
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        placeholder="l"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Max Number of Fish"
                      name="maxAmountFish"
                      rules={[
                        {
                          required: true,
                          message: "Please input your max amount of fish!",
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        placeholder="fish"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Max Pumping Capacity"
                      name="maxPumpingCapacity"
                      rules={[
                        {
                          required: true,
                          message: "Please input your max pumping capacity!",
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        placeholder="l/h"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      />
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
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
              onClick={() => {
                setIsDeleteModal(true);
              }}
              style={{
                marginTop: "10px",
                marginLeft: "10px",
                width: "200px",
              }}
            >
              Delete
            </Button>
            <Modal
              title="Are you sure you want to delete this pond standard details?"
              open={isDeleteModal}
              style={{ textAlign: "center" }}
              footer={null}
              closable={false}
              onCancel={() => setIsDeleteModal(false)}
            >
              <Button
                type="primary"
                onClick={() => {
                  api
                    .delete(`admin/deletePondStandard/${pondStandardId}`)
                    .then(() => {
                      fetchPondStandardDetail();
                      navigate("/admin/pondStandards");
                      setIsDeleteModal(false);
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                  alert("Pond standard deleted successfully!");
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
        )}
      </div>
    </>
  );
}

export default PondStandardDetails;
