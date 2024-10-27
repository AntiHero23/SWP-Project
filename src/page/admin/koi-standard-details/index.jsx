import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { Button, Card, Col, Form, InputNumber, Modal, Row, Select } from "antd";

function KoiStandardDetails() {
  const { id } = useParams();
  const [koiStandardDetails, setKoiStandardDetails] = useState({});
  const [koiVariety, setKoiVariety] = useState([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isUpdateModal, setIsUpdateModal] = useState(false);

  const [form] = useForm();
  const navigate = useNavigate();

  const fetchKoiStandardDetails = async () => {
    try {
      const responseDetails = await api.get(`koistandard/view/${id}`);
      setKoiStandardDetails(responseDetails.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchKoiVariety = async () => {
    try {
      const responseVariety = await api.get("koivariety");
      setKoiVariety(responseVariety.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await api.put(
        `koistandard/update/${id}`,
        form.getFieldsValue()
      );
      alert("Koi standard updated successfully!");
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
    setIsDeleteModal(false);
  };

  useEffect(() => {
    fetchKoiStandardDetails();
    fetchKoiVariety();
  }, []);

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1>Koi Standard Details</h1>
        <br />
        {koiStandardDetails && (
          <Card style={{ background: "#778899" }}>
            <Row gutter={16}>
              <Col span={12}>
                <Card style={{ fontSize: "22px" }}>
                  <b>Koi Variety: </b>{" "}
                  {koiVariety.find(
                    (v) => v.koiVarietyID === koiStandardDetails.koiVarietyID
                  )
                    ? koiVariety.find(
                        (v) =>
                          v.koiVarietyID === koiStandardDetails.koiVarietyID
                      ).varietyName
                    : "N/A"}
                </Card>
                <Card
                  bordered={false}
                  style={{ marginTop: "10px", background: "#00bfff" }}
                >
                  <h3>Male</h3>
                  <br />
                  <Card>
                    <b>Length (cm): </b>
                    <br />
                    {`${koiStandardDetails.lowLengthMale}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    ) +
                      " - " +
                      `${koiStandardDetails.medLengthMale}`.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      ) +
                      " - " +
                      `${koiStandardDetails.hiLengthMale}`.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      )}
                  </Card>
                  <Card>
                    <b>Weight (g): </b>
                    <br />
                    {`${koiStandardDetails.lowWeightMale}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    ) +
                      " - " +
                      `${koiStandardDetails.medWeightMale}`.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      ) +
                      " - " +
                      `${koiStandardDetails.hiWeightMale}`.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      )}
                  </Card>
                </Card>
              </Col>
              <Col span={12}>
                <Card style={{ fontSize: "22px" }}>
                  <b>Period (days): </b>{" "}
                  {`${koiStandardDetails.period}`.replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ","
                  )}
                </Card>
                <Card
                  bordered={false}
                  style={{ marginTop: "10px", background: "#ee82ee" }}
                >
                  <h3>Female</h3>
                  <br />
                  <Card>
                    <b>Length (cm): </b>
                    <br />
                    {`${koiStandardDetails.lowLengthFemale}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    ) +
                      " - " +
                      `${koiStandardDetails.medLengthFemale}`.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      ) +
                      " - " +
                      `${koiStandardDetails.hiLengthFemale}`.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      )}
                  </Card>
                  <Card>
                    <b>Weight (g): </b>
                    <br />
                    {`${koiStandardDetails.lowWeightFemale}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    ) +
                      " - " +
                      `${koiStandardDetails.medWeightFemale}`.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      ) +
                      " - " +
                      `${koiStandardDetails.hiWeightFemale}`.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      )}
                  </Card>
                </Card>
              </Col>
            </Row>
            <Card
              style={{
                marginTop: "10px",
              }}
            >
              <Button
                type="primary"
                style={{ width: "auto", margin: "5px 5px 5px 5px" }}
                onClick={() => setIsUpdateModal(true)}
              >
                Update
              </Button>
              <Modal
                title="Update Koi Standard"
                open={isUpdateModal}
                style={{ textAlign: "center" }}
                onCancel={handleCancel}
                closable={false}
                footer={null}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form
                      form={form}
                      name="basic"
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                      initialValues={{ ...koiStandardDetails }}
                      onFinish={handleSubmit}
                    >
                      <Form.Item
                        label="Koi Variety"
                        name="koiVarietyID"
                        rules={[
                          {
                            required: true,
                            message: "Please choose koi variety!",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Koi Variety"
                          style={{ width: "50%" }}
                          initialValue={koiStandardDetails.koiVarietyID}
                        >
                          {koiVariety
                            // .filter((variety) => variety.koiVarietyID <= 5)
                            .map((variety) => (
                              <Select.Option
                                key={variety.koiVarietyID}
                                value={variety.koiVarietyID}
                              >
                                {variety.varietyName}
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label="Male Low Length (cm)"
                        name="lowLengthMale"
                        rules={[
                          {
                            required: true,
                            message: "Please input male koi low length!",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          placeholder="cm"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Male Medium Length (cm)"
                        name="medLengthMale"
                        rules={[
                          {
                            required: true,
                            message: "Please input male koi medium length!",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          placeholder="cm"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Male High Length (cm)"
                        name="hiLengthMale"
                        rules={[
                          {
                            required: true,
                            message: "Please input male koi high length!",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          placeholder="cm"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Male Low Weight (g)"
                        name="lowWeightMale"
                        rules={[
                          {
                            required: true,
                            message: "Please input male koi low weight!",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          placeholder="g"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Male Medium Weight (g)"
                        name="medWeightMale"
                        rules={[
                          {
                            required: true,
                            message: "Please input male koi medium weight!",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          placeholder="g"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Male High Weight (g)"
                        name="hiWeightMale"
                        rules={[
                          {
                            required: true,
                            message: "Please input male koi high weight!",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          placeholder="g"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
                      labelCol={{
                        span: 24,
                      }}
                      wrapperCol={{
                        span: 24,
                      }}
                      onFinish={handleSubmit}
                      initialValues={{ ...koiStandardDetails }}
                    >
                      <Form.Item
                        label="Period (days)"
                        name="period"
                        rules={[
                          {
                            required: true,
                            message: "Please input koi period!",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          placeholder="days"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Female Low Length (cm)"
                        name="lowLengthFemale"
                        rules={[
                          {
                            required: true,
                            message: "Please input female koi low length!",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          placeholder="cm"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Female Medium Length (cm)"
                        name="medLengthFemale"
                        rules={[
                          {
                            required: true,
                            message: "Please input female koi medium length!",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          placeholder="cm"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Female High Length (cm)"
                        name="hiLengthFemale"
                        rules={[
                          {
                            required: true,
                            message: "Please input female koi high length!",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          placeholder="cm"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Female Low Weight (g)"
                        name="lowWeightFemale"
                        rules={[
                          {
                            required: true,
                            message: "Please input female koi low weight!",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          placeholder="g"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Female Medium Weight (g)"
                        name="medWeightFemale"
                        rules={[
                          {
                            required: true,
                            message: "Please input female koi medium weight!",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          placeholder="g"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Female High Weight (g)"
                        name="hiWeightFemale"
                        rules={[
                          {
                            required: true,
                            message: "Please input female koi high weight!",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          placeholder="g"
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
                      .delete(`koistandard/delete/${id}`)
                      .then(() => {
                        fetchKoiStandardDetails();
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                    alert("Koi standard deleted successfully!");
                    handleCancel();
                    setTimeout(() => {
                      navigate("/admin/koiStandards");
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
          </Card>
        )}
      </div>
    </>
  );
}

export default KoiStandardDetails;
