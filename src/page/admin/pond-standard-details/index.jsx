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
        {!loading && (
          <div>
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <div style={{ margin: "5px" }}>
                <Card style={{ background: "#6495ed" }}>
                  <b>Depth: </b>
                  {PondStandardDetails.minDepth +
                    " - " +
                    PondStandardDetails.maxDepth +
                    " m"}
                </Card>
                <Card style={{ background: "#6495ed", marginTop: "10px" }}>
                  <b>Volume: </b>
                  {PondStandardDetails.minVolume +
                    " - " +
                    PondStandardDetails.maxVolume +
                    " l"}
                </Card>
              </div>
              <div style={{ margin: "5px" }}>
                <Card style={{ background: "#6495ed" }}>
                  <b>Acreage: </b>
                  {PondStandardDetails.area + " m²"}
                </Card>
                <Card style={{ background: "#6495ed", marginTop: "10px" }}>
                  <b>Drain Count: </b>
                  {PondStandardDetails.drainCount + " drains"}
                </Card>
                <Card style={{ background: "#6495ed", marginTop: "10px" }}>
                  <b>Skimmer Count: </b>
                  {PondStandardDetails.skimmerCount + " skimmers"}
                </Card>
              </div>
              <div style={{ margin: "5px" }}>
                <Card style={{ background: "#6495ed", marginTop: "10px" }}>
                  <b>Number of Fish: </b>
                  {PondStandardDetails.minAmountFish +
                    " - " +
                    PondStandardDetails.maxAmountFish +
                    " fish"}
                </Card>
                <Card style={{ background: "#6495ed", marginTop: "10px" }}>
                  <b>Pumping Capacity: </b>
                  {PondStandardDetails.minPumpingCapacity +
                    " - " +
                    PondStandardDetails.maxPumpingCapacity +
                    " l/h"}
                </Card>
                {/* <Card style={{ background: "#6495ed" }}>
                  <b>Max Depth: </b>
                  {PondStandardDetails.maxDepth}
                </Card>
                <Card style={{ background: "#6495ed", marginTop: "10px" }}>
                  <b>Max Volume: </b>
                  {PondStandardDetails.maxVolume}
                </Card>
                <Card style={{ background: "#6495ed", marginTop: "10px" }}>
                  <b>Max Number of Fish: </b>
                  {PondStandardDetails.maxAmountFish}
                </Card>
                <Card style={{ background: "#6495ed", marginTop: "10px" }}>
                  <b>Max Pumping Capacity: </b>
                  {PondStandardDetails.maxPumpingCapacity}
                </Card> */}
              </div>
            </div>
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
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
              onOk={() => form.submit()}
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
                      <InputNumber min={0} placeholder="m²" />
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
                      <InputNumber min={0} placeholder="drains" />
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
                      <InputNumber min={0} placeholder="skimmers" />
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
                      <InputNumber min={0} placeholder="m" />
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
                      <InputNumber min={0} placeholder="l" />
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
                      <InputNumber min={0} placeholder="fish" />
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
                      <InputNumber min={0} placeholder="l/h" />
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
                      <InputNumber min={0} placeholder="m" />
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
                      <InputNumber min={0} placeholder="l" />
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
                      <InputNumber min={0} placeholder="fish" />
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
                      <InputNumber min={0} placeholder="l/h" />
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
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
              onOk={() => {
                api
                  .delete(`admin/deletePondStandard/${pondStandardId}`)
                  .then(() => {
                    fetchPondStandardDetail();
                    window.location.reload();
                    setIsDeleteModal(false);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
                alert("Pond standard deleted successfully!");
              }}
              onCancel={() => setIsDeleteModal(false)}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default PondStandardDetails;
