import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { Button, Col, Form, InputNumber, Modal, Row, Table, Tag } from "antd";

function WaterStandard() {
  const [waterStandardData, setWaterStandardData] = useState([]);
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const [form] = useForm();
  const navigate = useNavigate();

  const showCreateModal = () => {
    setIsCreateModal(true);
  };
  const showDeleteModal = () => {
    setIsDeleteModal(true);
  };
  const handleSubmitCreate = async () => {
    try {
      await api
        .post("admin/waterstandard/create", form.getFieldsValue())
        .then(() => {
          fetchWaterStandard();
        });
      alert("Water Standard created successfully!");
      form.resetFields();
      setIsCreateModal(false);
    } catch (error) {
      alert(error.response.data.message);
      handleCancel();
      console.log(error);
    }
  };
  const handleCancel = () => {
    form.resetFields();
    setIsCreateModal(false);
    setIsDeleteModal(false);
  };
  const fetchWaterStandard = async () => {
    try {
      const response = await api.get("admin/viewall/waterstandard");
      setWaterStandardData(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWaterStandard();
  }, []);
  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1>Water Standard</h1>
        <br />
        <Button
          type="primary"
          onClick={showCreateModal}
          style={{ width: "175px", marginBottom: "20px" }}
        >
          Create Water Standard
        </Button>
        <Modal
          title="Create Water Standard"
          open={isCreateModal}
          onOk={handleSubmitCreate}
          onCancel={handleCancel}
          width={700}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form
                form={form}
                name="basic"
                labelAlign="left"
                style={{
                  maxWidth: 300,
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={handleSubmitCreate}
                autoComplete="off"
              >
                <Form.Item
                  label="Min Temperature Standard"
                  name="minTempStandard"
                  rules={[
                    {
                      required: true,
                      message: "Please input your min temperature standard!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ float: "right" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " °C"
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item
                  label="Min Oxygen Standard"
                  name="minOxygenStandard"
                  rules={[
                    {
                      required: true,
                      message: "Please input your min oxygen standard!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ float: "right" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " mg/l"
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item
                  label="Min pH Standard"
                  name="min_pH_Standard"
                  rules={[
                    {
                      required: true,
                      message: "Please input your min pH standard!",
                    },
                  ]}
                >
                  <InputNumber style={{ float: "right" }} />
                </Form.Item>
                <Form.Item
                  label="Min Hardness Standard"
                  name="minHardnessStandard"
                  rules={[
                    {
                      required: true,
                      message: "Please input your min hardness standard!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ float: "right" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " °dH"
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item
                  label="Min Ammonia Standard"
                  name="minAmmoniaStandard"
                  rules={[
                    {
                      required: true,
                      message: "Please input your min ammonia standard!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ float: "right" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " mg/l"
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item
                  label="Min Nitrite Standard"
                  name="minNitriteStandard"
                  rules={[
                    {
                      required: true,
                      message: "Please input your min nitrite standard!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ float: "right" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " mg/l"
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item
                  label="Min Nitrate Standard"
                  name="minNitrateStandard"
                  rules={[
                    {
                      required: true,
                      message: "Please input your min nitrate standard!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ float: "right" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " mg/l"
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item
                  label="Min Carbonate Standard"
                  name="minCarbonateStandard"
                  rules={[
                    {
                      required: true,
                      message: "Please input your min carbonate standard!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ float: "right" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " °dH"
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item
                  label="Min Salt Standard"
                  name="minSaltStandard"
                  rules={[
                    {
                      required: true,
                      message: "Please input your min salt standard!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ float: "right" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " %"
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item
                  label="Min Carbon Dioxide Standard"
                  name="minCarbonDioxideStandard"
                  rules={[
                    {
                      required: true,
                      message: "Please input your min carbon dioxide standard!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ float: "right" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " mg/l"
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col span={12}>
              <Form
                form={form}
                name="basic"
                labelAlign="left"
                style={{
                  maxWidth: 300,
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={handleSubmitCreate}
                autoComplete="off"
              >
                <Form.Item
                  label="Max Temperature Standard"
                  name="maxTempStandard"
                  rules={[
                    {
                      required: true,
                      message: "Please input your max temperature standard!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ float: "right" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " °C"
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item
                  label="Max Oxygen Standard"
                  name="maxOxygenStandard"
                  rules={[
                    {
                      required: true,
                      message: "Please input your max oxygen standard!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ float: "right" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " mg/l"
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item
                  label="Max pH Standard"
                  name="max_pH_Standard"
                  rules={[
                    {
                      required: true,
                      message: "Please input your max pH standard!",
                    },
                  ]}
                >
                  <InputNumber style={{ float: "right" }} />
                </Form.Item>
                <Form.Item
                  label="Max Hardness Standard"
                  name="maxHardnessStandard"
                  rules={[
                    {
                      required: true,
                      message: "Please input your max hardness standard!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ float: "right" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " °dH"
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item
                  label="Max Ammonia Standard"
                  name="maxAmmoniaStandard"
                  rules={[
                    {
                      required: true,
                      message: "Please input your max ammonia standard!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ float: "right" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " mg/l"
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item
                  label="Max Nitrite Standard"
                  name="maxNitriteStandard"
                  rules={[
                    {
                      required: true,
                      message: "Please input your max nitrite standard!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ float: "right" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " mg/l"
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item
                  label="Max Nitrate Standard"
                  name="maxNitrateStandard"
                  rules={[
                    {
                      required: true,
                      message: "Please input your max nitrate standard!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ float: "right" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " mg/l"
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item
                  label="Max Carbonate Standard"
                  name="maxCarbonateStandard"
                  rules={[
                    {
                      required: true,
                      message: "Please input your max carbonate standard!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ float: "right" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " °dH"
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item
                  label="Max Salt Standard"
                  name="maxSaltStandard"
                  rules={[
                    {
                      required: true,
                      message: "Please input your max salt standard!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ float: "right" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " %"
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item
                  label="Max Carbon Dioxide Standard"
                  name="maxCarbonDioxideStandard"
                  rules={[
                    {
                      required: true,
                      message: "Please input your max carbon dioxide standard!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ float: "right" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " mg/l"
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Modal>
        <div style={{ justifyContent: "space-between" }}>
          {waterStandardData.map((item, index) => (
            <div key={index}>
              <Tag>
                Min Temperature Standard:{" "}
                {item.minTempStandard.toFixed(2) + " °C"}
              </Tag>
              <Tag>
                Max Temperature Standard:{" "}
                {item.maxTempStandard.toFixed(2) + " °C"}
              </Tag>
              <p style={{ marginTop: "10px" }} />
              <Tag>
                Min Oxygen Standard:{" "}
                {item.minOxygenStandard.toFixed(3) + " mg/l"}
              </Tag>
              <Tag>
                Max Oxygen Standard:{" "}
                {item.maxOxygenStandard.toFixed(3) + " mg/l"}
              </Tag>
              <p style={{ marginTop: "10px" }} />
              <Tag>Min pH Standard: {item.min_pH_Standard}</Tag>
              <Tag>Max pH Standard: {item.max_pH_Standard}</Tag>
              <p style={{ marginTop: "10px" }} />
              <Tag>
                Min Hardness Standard:{" "}
                {item.minHardnessStandard.toFixed(1) + " °dH"}
              </Tag>
              <Tag>
                Max Hardness Standard:{" "}
                {item.maxHardnessStandard.toFixed(1) + " °dH"}
              </Tag>
              <p style={{ marginTop: "10px" }} />
              <Tag>
                Min Ammonia Standard:{" "}
                {item.minAmmoniaStandard.toFixed(3) + " mg/l"}
              </Tag>
              <Tag>
                Max Ammonia Standard:{" "}
                {item.maxAmmoniaStandard.toFixed(3) + " mg/l"}
              </Tag>
              <p style={{ marginTop: "10px" }} />
              <Tag>
                Min Nitrite Standard:{" "}
                {item.minNitriteStandard.toFixed(3) + " mg/l"}
              </Tag>
              <Tag>
                Max Nitrite Standard:{" "}
                {item.maxNitriteStandard.toFixed(3) + " mg/l"}
              </Tag>
              <p style={{ marginTop: "10px" }} />
              <Tag>
                Min Nitrate Standard:{" "}
                {item.minNitrateStandard.toFixed(3) + " mg/l"}
              </Tag>
              <Tag>
                Max Nitrate Standard:{" "}
                {item.maxNitrateStandard.toFixed(3) + " mg/l"}
              </Tag>
              <p style={{ marginTop: "10px" }} />
              <Tag>
                Min Carbonate Standard:{" "}
                {item.minCarbonateStandard.toFixed(1) + " °dH"}
              </Tag>
              <Tag>
                Max Carbonate Standard:{" "}
                {item.maxCarbonateStandard.toFixed(1) + " °dH"}
              </Tag>
              <p style={{ marginTop: "10px" }} />
              <Tag>
                Min Salt Standard: {item.minSaltStandard.toFixed(3) + " %"}
              </Tag>
              <Tag>
                Max Salt Standard: {item.maxSaltStandard.toFixed(3) + " %"}
              </Tag>
              <p style={{ marginTop: "10px" }} />
              <Tag>
                Min Carbon Dioxide Standard:{" "}
                {item.minCarbonDioxideStandard.toFixed(3) + " mg/l"}
              </Tag>
              <Tag>
                Max Carbon Dioxide Standard:{" "}
                {item.maxCarbonDioxideStandard.toFixed(3) + " mg/l"}
              </Tag>
              <br />
              <Button
                type="primary"
                danger
                style={{ width: "100px", marginTop: "10px" }}
                onClick={showDeleteModal}
              >
                Delete
              </Button>
              <Modal
                title="Are you sure you want to delete this water standard?"
                open={isDeleteModal}
                onOk={() => {
                  api
                    .delete(
                      `admin/delete/waterstandard/${item.waterStandardID}`
                    )
                    .then(() => {
                      fetchWaterStandard();
                      window.location.reload();
                      setIsDeleteModal(false);
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                  alert("Water Standard deleted successfully!");
                }}
                onCancel={handleCancel}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default WaterStandard;
