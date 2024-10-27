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
                    {"Temperature Standard (°C): " +
                      item.minTempStandard.toFixed(2) +
                      " - " +
                      item.maxTempStandard.toFixed(2) +
                      " °C"}
                  </Card>
                  <br />
                  <Card style={{ width: "100%", background: "#6495ed" }}>
                    {"Oxygen Standard (O₂): " +
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
                    {"Hardness Standard (GH): " +
                      item.minHardnessStandard.toFixed(1) +
                      " - " +
                      item.maxHardnessStandard.toFixed(1) +
                      " °dH"}
                  </Card>
                  <br />
                  <Card style={{ width: "100%", background: "#6495ed" }}>
                    {"Ammonia Standard (NH₃): " +
                      item.minAmmoniaStandard.toFixed(3) +
                      " - " +
                      item.maxAmmoniaStandard.toFixed(3) +
                      " mg/l"}
                  </Card>
                </Col>
                <Col span={12}>
                  <Card style={{ width: "100%", background: "#6495ed" }}>
                    {"Nitrite Standard (NO₂): " +
                      item.minNitriteStandard.toFixed(3) +
                      " - " +
                      item.maxNitriteStandard.toFixed(3) +
                      " mg/l"}
                  </Card>
                  <br />
                  <Card style={{ width: "100%", background: "#6495ed" }}>
                    {"Nitrate Standard (NO₃): " +
                      item.minNitrateStandard.toFixed(3) +
                      " - " +
                      item.maxNitrateStandard.toFixed(3) +
                      " mg/l"}
                  </Card>
                  <br />
                  <Card style={{ width: "100%", background: "#6495ed" }}>
                    {"Carbonate Standard (KH): " +
                      item.minCarbonateStandard.toFixed(1) +
                      " - " +
                      item.maxCarbonateStandard.toFixed(1) +
                      " °dH"}
                  </Card>
                  <br />
                  <Card style={{ width: "100%", background: "#6495ed" }}>
                    {"Salt Standard (%): " +
                      item.minSaltStandard.toFixed(3) +
                      " - " +
                      item.maxSaltStandard.toFixed(3) +
                      " %"}
                  </Card>
                  <br />
                  <Card style={{ width: "100%", background: "#6495ed" }}>
                    {"Carbon Dioxide Standard (CO₂): " +
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
                style={{ textAlign: "center" }}
                footer={null}
                closable={false}
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
                      {[
                        { label: "Temperature", unit: "°C", key: "Temp" },
                        { label: "Oxygen", unit: "mg/l", key: "Oxygen" },
                        { label: "pH", unit: "pH", key: "_pH_" },
                        { label: "Hardness", unit: "mg/l", key: "Hardness" },
                        { label: "Ammonia", unit: "mg/l", key: "Ammonia" },
                        { label: "Nitrite", unit: "mg/l", key: "Nitrite" },
                        { label: "Carbonate", unit: "mg/l", key: "Carbonate" },
                        { label: "Salt", unit: "%", key: "Salt" },
                        {
                          label: "Carbon Dioxide",
                          unit: "mg/l",
                          key: "CarbonDioxide",
                        },
                      ].map(({ label, unit, key }) => (
                        <Form.Item
                          key={`min${key}Standard`}
                          label={`Min ${label} Standard (${unit})`}
                          name={`min${key}Standard`}
                          rules={[
                            {
                              required: true,
                              message: `Please input min ${label.toLowerCase()} standard!`,
                            },
                          ]}
                        >
                          <InputNumber
                            defaultValue={item[`min${key}Standard`]}
                            formatter={(value) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) => value.replace(/,(?=\d{3})/g, "")}
                            style={{ float: "right" }}
                            placeholder={unit}
                            min={0}
                          />
                        </Form.Item>
                      ))}
                    </Form>
                  </Col>
                  <Col span={12}>
                    <Form
                      form={form}
                      name="basic"
                      labelAlign="left"
                      initialValues={item}
                    >
                      {[
                        { label: "Temperature", unit: "°C", key: "Temp" },
                        { label: "Oxygen", unit: "mg/l", key: "Oxygen" },
                        { label: "pH", unit: "pH", key: "_pH_" },
                        { label: "Hardness", unit: "mg/l", key: "Hardness" },
                        { label: "Ammonia", unit: "mg/l", key: "Ammonia" },
                        { label: "Nitrite", unit: "mg/l", key: "Nitrite" },
                        { label: "Carbonate", unit: "mg/l", key: "Carbonate" },
                        { label: "Salt", unit: "%", key: "Salt" },
                        {
                          label: "Carbon Dioxide",
                          unit: "mg/l",
                          key: "CarbonDioxide",
                        },
                      ].map(({ label, unit, key }) => (
                        <Form.Item
                          key={`max${key}Standard`}
                          label={`Max ${label} Standard (${unit})`}
                          name={`max${key}Standard`}
                          rules={[
                            {
                              required: true,
                              message: `Please input max ${label.toLowerCase()} standard!`,
                            },
                          ]}
                        >
                          <InputNumber
                            defaultValue={item[`max${key}Standard`]}
                            formatter={(value) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) => value.replace(/,(?=\d{3})/g, "")}
                            style={{ float: "right" }}
                            placeholder={unit}
                            min={0}
                          />
                        </Form.Item>
                      ))}
                    </Form>
                  </Col>
                </Row>
                <Button
                  type="primary"
                  onClick={() => {
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
