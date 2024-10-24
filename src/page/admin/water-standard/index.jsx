import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  Modal,
  Row,
  Table,
  Tag,
} from "antd";

function WaterStandard() {
  const [waterStandardData, setWaterStandardData] = useState([]);
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isUpdateModal, setIsUpdateModal] = useState(false);

  const [form] = useForm();

  const handleSubmitCreate = (values) => {
    api
      .post("admin/waterstandard/create", values)
      .then((response) => {
        if (response.status === 200) {
          fetchWaterStandard();
          alert("Water Standard created successfully!");
          setIsCreateModal(false);
          form.resetFields();
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleCancel = () => {
    form.resetFields();
    setIsCreateModal(false);
    setIsDeleteModal(false);
    setIsUpdateModal(false);
  };
  const fetchWaterStandard = async () => {
    try {
      const response = await api.get("admin/viewall/waterstandard");
      console.log(response.data.result);
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
        {/* <Button
          type="primary"
          onClick={() => setIsCreateModal(true)}
          style={{ width: "175px", marginBottom: "20px" }}
        >
          Create Water Standard
        </Button>
        <Modal
          title="Create Water Standard"
          open={isCreateModal}
          onOk={() => form.submit()}
          onCancel={handleCancel}
          width={800}
        >
          <Form
            form={form}
            name="createWaterStandard"
            labelAlign="left"
            style={{
              maxWidth: 700,
            }}
            onFinish={handleSubmitCreate}
            autoComplete="off"
          >
            <Row gutter={16}>
              {[
                {
                  label: "Temperature Standard",
                  name: ["minTempStandard", "maxTempStandard"],
                  unit: "°C",
                },
                {
                  label: "Oxygen Standard",
                  name: ["minOxygenStandard", "maxOxygenStandard"],
                  unit: "mg/l",
                },
                {
                  label: "pH Standard",
                  name: ["min_pH_Standard", "max_pH_Standard"],
                  unit: "pH",
                },
                {
                  label: "Hardness Standard",
                  name: ["minHardnessStandard", "maxHardnessStandard"],
                  unit: "°dH",
                },
                {
                  label: "Ammonia Standard",
                  name: ["minAmmoniaStandard", "maxAmmoniaStandard"],
                  unit: "mg/l",
                },
                {
                  label: "Nitrite Standard",
                  name: ["minNitriteStandard", "maxNitriteStandard"],
                  unit: "mg/l",
                },
                {
                  label: "Nitrate Standard",
                  name: ["minNitrateStandard", "maxNitrateStandard"],
                  unit: "mg/l",
                },
                {
                  label: "Carbonate Standard",
                  name: ["minCarbonateStandard", "maxCarbonateStandard"],
                  unit: "°dH",
                },
                {
                  label: "Salt Standard",
                  name: ["minSaltStandard", "maxSaltStandard"],
                  unit: "%",
                },
                {
                  label: "Carbon Dioxide Standard",
                  name: [
                    "minCarbonDioxideStandard",
                    "maxCarbonDioxideStandard",
                  ],
                  unit: "mg/l",
                },
              ].map(({ label, name, unit }) => (
                <Col span={24} key={name[0]}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label={`Min ${label} (${unit})`}
                        name={name[0]}
                        rules={[
                          {
                            required: true,
                            message: `Please input your min ${label.toLowerCase()}!`,
                          },
                        ]}
                      >
                        <InputNumber
                          style={{ float: "right" }}
                          placeholder={unit}
                          min={0}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label={`Max ${label} (${unit})`}
                        name={name[1]}
                        rules={[
                          {
                            required: true,
                            message: `Please input your max ${label.toLowerCase()}!`,
                          },
                        ]}
                      >
                        <InputNumber
                          style={{ float: "right" }}
                          placeholder={unit}
                          min={0}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              ))}
            </Row>
          </Form>
        </Modal> */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {waterStandardData.map((item, index) => (
            <div key={index}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card style={{ width: "100%", background: "#6495ed" }}>
                    {"Temperature Standard: " +
                      item.minTempStandard.toFixed(2) +
                      " - " +
                      item.maxTempStandard.toFixed(2) +
                      " °C"}
                  </Card>
                  <br />
                  <Card style={{ width: "100%", background: "#6495ed" }}>
                    {"Oxygen Standard: " +
                      item.minOxygenStandard.toFixed(3) +
                      " - " +
                      item.maxOxygenStandard.toFixed(3) +
                      " mg/l"}
                  </Card>
                  <br />
                  <Card style={{ width: "100%", background: "#6495ed" }}>
                    {"pH Standard: " +
                      item.min_pH_Standard +
                      " - " +
                      item.max_pH_Standard}
                  </Card>
                  <br />
                  <Card style={{ width: "100%", background: "#6495ed" }}>
                    {"Hardness Standard: " +
                      item.minHardnessStandard.toFixed(1) +
                      " - " +
                      item.maxHardnessStandard.toFixed(1) +
                      " °dH"}
                  </Card>
                  <br />
                  <Card style={{ width: "100%", background: "#6495ed" }}>
                    {"Ammonia Standard: " +
                      item.minAmmoniaStandard.toFixed(3) +
                      " - " +
                      item.maxAmmoniaStandard.toFixed(3) +
                      " mg/l"}
                  </Card>
                </Col>
                <Col span={12}>
                  <Card style={{ width: "100%", background: "#6495ed" }}>
                    {"Nitrite Standard: " +
                      item.minNitriteStandard.toFixed(3) +
                      " - " +
                      item.maxNitriteStandard.toFixed(3) +
                      " mg/l"}
                  </Card>
                  <br />
                  <Card style={{ width: "100%", background: "#6495ed" }}>
                    {"Nitrate Standard: " +
                      item.minNitrateStandard.toFixed(3) +
                      " - " +
                      item.maxNitrateStandard.toFixed(3) +
                      " mg/l"}
                  </Card>
                  <br />
                  <Card style={{ width: "100%", background: "#6495ed" }}>
                    {"Carbonate Standard: " +
                      item.minCarbonateStandard.toFixed(1) +
                      " - " +
                      item.maxCarbonateStandard.toFixed(1) +
                      " °dH"}
                  </Card>
                  <br />
                  <Card style={{ width: "100%", background: "#6495ed" }}>
                    {"Salt Standard: " +
                      item.minSaltStandard.toFixed(3) +
                      " - " +
                      item.maxSaltStandard.toFixed(3) +
                      " %"}
                  </Card>
                  <br />
                  <Card style={{ width: "100%", background: "#6495ed" }}>
                    {"Carbon Dioxide Standard: " +
                      item.minCarbonDioxideStandard.toFixed(3) +
                      " - " +
                      item.maxCarbonDioxideStandard.toFixed(3) +
                      " mg/l"}
                  </Card>
                </Col>
              </Row>
              <br />
              <Button
                type="primary"
                style={{ width: "175px", marginTop: "10px" }}
                onClick={() => setIsUpdateModal(true)}
              >
                Update
              </Button>
              <Modal
                width={800}
                key={index}
                title="Update Water Standard"
                open={isUpdateModal}
                onOk={() => {
                  form
                    .validateFields()
                    .then((values) => {
                      api
                        .put(
                          `/admin/waterstandard/update/${item.waterStandardID}`,
                          {
                            minTempStandard: values.minTempStandard,
                            maxTempStandard: values.maxTempStandard,
                            minOxygenStandard: values.minOxygenStandard,
                            maxOxygenStandard: values.maxOxygenStandard,
                            min_pH_Standard: values.min_pH_Standard,
                            max_pH_Standard: values.max_pH_Standard,
                            minHardnessStandard: values.minHardnessStandard,
                            maxHardnessStandard: values.maxHardnessStandard,
                            minAmmoniaStandard: values.minAmmoniaStandard,
                            maxAmmoniaStandard: values.maxAmmoniaStandard,
                            minNitriteStandard: values.minNitriteStandard,
                            maxNitriteStandard: values.maxNitriteStandard,
                            minNitrateStandard: values.minNitrateStandard,
                            maxNitrateStandard: values.maxNitrateStandard,
                            minCarbonateStandard: values.minCarbonateStandard,
                            maxCarbonateStandard: values.maxCarbonateStandard,
                            minSaltStandard: values.minSaltStandard,
                            maxSaltStandard: values.maxSaltStandard,
                            minCarbonDioxideStandard:
                              values.minCarbonDioxideStandard,
                            maxCarbonDioxideStandard:
                              values.maxCarbonDioxideStandard,
                          }
                        )
                        .then(() => {
                          fetchWaterStandard();
                          window.location.reload();
                          setIsUpdateModal(false);
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }}
                onCancel={handleCancel}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form
                      form={form}
                      name="basic"
                      labelAlign="left"
                      initialValues={{ ...waterStandardData }}
                    >
                      <Form.Item
                        label="Min Temperature Standard (°C)"
                        name="minTempStandard"
                        rules={[
                          {
                            required: true,
                            message: "Please input min temperature standard!",
                          },
                        ]}
                      >
                        <InputNumber
                          defaultValue={item.minTempStandard}
                          initialValue={item.minTempStandard}
                          style={{ float: "right" }}
                          placeholder="°C"
                          min={0}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Min Oxygen Standard (mg/l)"
                        name="minOxygenStandard"
                        rules={[
                          {
                            required: true,
                            message: "Please input min oxygen standard!",
                          },
                        ]}
                      >
                        <InputNumber
                          defaultValue={item.minOxygenStandard}
                          initialValue={item.minOxygenStandard}
                          style={{ float: "right" }}
                          placeholder="mg/l"
                          min={0}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Min pH Standard"
                        name="min_pH_Standard"
                        rules={[
                          {
                            required: true,
                            message: "Please input min pH standard!",
                          },
                        ]}
                      >
                        <InputNumber
                          defaultValue={item.min_pH_Standard}
                          initialValue={item.min_pH_Standard}
                          style={{ float: "right" }}
                          placeholder="pH"
                          min={0}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Min Hardness Standard (mg/l)"
                        name="minHardnessStandard"
                        rules={[
                          {
                            required: true,
                            message: "Please input min hardness standard!",
                          },
                        ]}
                      >
                        <InputNumber
                          defaultValue={item.minHardnessStandard}
                          initialValue={item.minHardnessStandard}
                          style={{ float: "right" }}
                          placeholder="mg/l"
                          min={0}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Min Ammonia Standard (mg/l)"
                        name="minAmmoniaStandard"
                        rules={[
                          {
                            required: true,
                            message: "Please input min ammonia standard!",
                          },
                        ]}
                      >
                        <InputNumber
                          defaultValue={item.minAmmoniaStandard}
                          initialValue={item.minAmmoniaStandard}
                          style={{ float: "right" }}
                          placeholder="mg/l"
                          min={0}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Min Nitrite Standard (mg/l)"
                        name="minNitriteStandard"
                        rules={[
                          {
                            required: true,
                            message: "Please input min nitrite standard!",
                          },
                        ]}
                      >
                        <InputNumber
                          defaultValue={item.minNitriteStandard}
                          initialValue={item.minNitriteStandard}
                          style={{ float: "right" }}
                          placeholder="mg/l"
                          min={0}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Min Carbonate Standard (mg/l)"
                        name="minCarbonateStandard"
                        rules={[
                          {
                            required: true,
                            message: "Please input min carbonate standard!",
                          },
                        ]}
                      >
                        <InputNumber
                          defaultValue={item.minCarbonateStandard}
                          initialValue={item.minCarbonateStandard}
                          style={{ float: "right" }}
                          placeholder="mg/l"
                          min={0}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Min Salt Standard (%)"
                        name="minSaltStandard"
                        rules={[
                          {
                            required: true,
                            message: "Please input min salt standard!",
                          },
                        ]}
                      >
                        <InputNumber
                          defaultValue={item.minSaltStandard}
                          initialValue={item.minSaltStandard}
                          style={{ float: "right" }}
                          placeholder="%"
                          min={0}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Min Carbon Dioxide Standard (mg/l)"
                        name="minCarbonDioxideStandard"
                        rules={[
                          {
                            required: true,
                            message:
                              "Please input min carbon dioxide standard!",
                          },
                        ]}
                      >
                        <InputNumber
                          defaultValue={item.minCarbonDioxideStandard}
                          initialValue={item.minCarbonDioxideStandard}
                          style={{ float: "right" }}
                          placeholder="mg/l"
                          min={0}
                        />
                      </Form.Item>
                    </Form>
                  </Col>
                  <Col span={12}>
                    <Form
                      form={form}
                      name="basic"
                      labelAlign="left"
                      initialValues={item}
                    >
                      <Form.Item
                        label="Max Temperature Standard (°C)"
                        name="maxTempStandard"
                        rules={[
                          {
                            required: true,
                            message: "Please input max temperature standard!",
                          },
                        ]}
                      >
                        <InputNumber
                          defaultValue={item.maxTempStandard}
                          initialValue={item.maxTempStandard}
                          style={{ float: "right" }}
                          placeholder="°C"
                          min={0}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Max Oxygen Standard (mg/l)"
                        name="maxOxygenStandard"
                        rules={[
                          {
                            required: true,
                            message: "Please input max oxygen standard!",
                          },
                        ]}
                      >
                        <InputNumber
                          defaultValue={item.maxOxygenStandard}
                          initialValue={item.maxOxygenStandard}
                          style={{ float: "right" }}
                          placeholder="mg/l"
                          min={0}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Max pH Standard"
                        name="max_pH_Standard"
                        rules={[
                          {
                            required: true,
                            message: "Please input max pH standard!",
                          },
                        ]}
                      >
                        <InputNumber
                          defaultValue={item.max_pH_Standard}
                          initialValue={item.max_pH_Standard}
                          style={{ float: "right" }}
                          placeholder="pH"
                          min={0}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Max Hardness Standard (mg/l)"
                        name="maxHardnessStandard"
                        rules={[
                          {
                            required: true,
                            message: "Please input max hardness standard!",
                          },
                        ]}
                      >
                        <InputNumber
                          defaultValue={item.maxHardnessStandard}
                          initialValue={item.maxHardnessStandard}
                          style={{ float: "right" }}
                          placeholder="mg/l"
                          min={0}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Max Ammonia Standard (mg/l)"
                        name="maxAmmoniaStandard"
                        rules={[
                          {
                            required: true,
                            message: "Please input max ammonia standard!",
                          },
                        ]}
                      >
                        <InputNumber
                          defaultValue={item.maxAmmoniaStandard}
                          initialValue={item.maxAmmoniaStandard}
                          style={{ float: "right" }}
                          placeholder="mg/l"
                          min={0}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Max Nitrite Standard (mg/l)"
                        name="maxNitriteStandard"
                        rules={[
                          {
                            required: true,
                            message: "Please input max nitrite standard!",
                          },
                        ]}
                      >
                        <InputNumber
                          defaultValue={item.maxNitriteStandard}
                          initialValue={item.maxNitriteStandard}
                          style={{ float: "right" }}
                          placeholder="mg/l"
                          min={0}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Max Carbonate Standard (mg/l)"
                        name="maxCarbonateStandard"
                        rules={[
                          {
                            required: true,
                            message: "Please input max carbonate standard!",
                          },
                        ]}
                      >
                        <InputNumber
                          defaultValue={item.maxCarbonateStandard}
                          initialValue={item.maxCarbonateStandard}
                          style={{ float: "right" }}
                          placeholder="mg/l"
                          min={0}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Max Salt Standard (%)"
                        name="maxSaltStandard"
                        rules={[
                          {
                            required: true,
                            message: "Please input max salt standard!",
                          },
                        ]}
                      >
                        <InputNumber
                          defaultValue={item.maxSaltStandard}
                          initialValue={item.maxSaltStandard}
                          style={{ float: "right" }}
                          placeholder="%"
                          min={0}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Max Carbon Dioxide Standard (mg/l)"
                        name="maxCarbonDioxideStandard"
                        rules={[
                          {
                            required: true,
                            message:
                              "Please input max carbon dioxide standard!",
                          },
                        ]}
                      >
                        <InputNumber
                          defaultValue={item.maxCarbonDioxideStandard}
                          initialValue={item.maxCarbonDioxideStandard}
                          style={{ float: "right" }}
                          placeholder="mg/l"
                          min={0}
                        />
                      </Form.Item>
                    </Form>
                  </Col>
                </Row>
              </Modal>
              {/* <Button
                type="primary"
                danger
                style={{
                  width: "100px",
                  marginTop: "10px",
                  marginLeft: "10px",
                }}
                onClick={() => setIsDeleteModal(true)}
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
              /> */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default WaterStandard;
