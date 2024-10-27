import {
  Button,
  Col,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
  Table,
} from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";

function KoiStandard() {
  const [koiStandard, setKoiStandard] = useState([]);
  const [varietyName, setVarietyName] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [form] = useForm();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await api.post("koistandard/create", form.getFieldsValue());
      setIsOpenModal(false);
      form.resetFields();
      alert("Koi standard created successfully!");
      fetchKoiStandard();
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancel = () => {
    setIsOpenModal(false);
    form.resetFields();
  };
  const fetchKoiStandard = async () => {
    try {
      const response = await api.get("koistandard/viewall");
      setKoiStandard(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchVarietyName = async () => {
    try {
      const response = await api.get(`koivariety`);
      setVarietyName(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVarietyName();
    fetchKoiStandard();
  }, []);

  const columns = [
    {
      title: <b style={{ fontSize: "18px" }}>Variety</b>,
      dataIndex: "koiVarietyID",
      key: "koiVarietyID",
      render: (value) => {
        const variety = varietyName.find((v) => v.koiVarietyID === value);
        return variety ? variety.varietyName : "N/A";
      },
    },
    {
      title: <b style={{ fontSize: "18px" }}>Period (days)</b>,
      dataIndex: "period",
      key: "period",
      render: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    },
    {
      title: <b style={{ fontSize: "18px" }}>Length (cm)</b>,
      dataIndex: ["lowLengthMale", "hiLengthFemale"],
      key: ["lowLengthMale", "hiLengthFemale"],
      render: (value, record) =>
        `${record.lowLengthMale}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
        " - " +
        `${record.hiLengthFemale}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    },
    {
      title: <b style={{ fontSize: "18px" }}>Weight (g)</b>,
      dataIndex: ["lowWeightMale", "hiWeightFemale"],
      key: ["lowWeightMale", "hiWeightFemale"],
      render: (value, record) =>
        `${record.lowWeightMale}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
        " - " +
        `${record.hiWeightFemale}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    },

    {
      title: <b style={{ fontSize: "18px" }}>Details</b>,
      dataIndex: "koiStandID",
      key: "koiStandID",
      render: (value) => (
        <Button
          type="primary"
          onClick={() => {
            navigate(`/admin/koiStandards/details/${value}`);
          }}
        >
          Details
        </Button>
      ),
    },
  ];
  return (
    <>
      <h1 style={{ textAlign: "center" }}>Koi Standards</h1>
      <br />
      <div style={{ textAlign: "center" }}>
        <Button
          type="primary"
          style={{ width: "175px", textAlign: "center" }}
          onClick={() => setIsOpenModal(true)}
        >
          Add Koi Standard
        </Button>
        <Modal
          title="Add Koi Standard"
          open={isOpenModal}
          style={{ textAlign: "center" }}
          onCancel={handleCancel}
          footer={null}
          closable={false}
        >
          <Row gutter={16}>
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
                  <Select placeholder="Koi Variety" style={{ width: "50%" }}>
                    <Select.Option value="1">Kohaku</Select.Option>
                    <Select.Option value="2">Sanke</Select.Option>
                    <Select.Option value="3">Showa</Select.Option>
                    <Select.Option value="4">Chagoi</Select.Option>
                    <Select.Option value="5">Ogon</Select.Option>
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
            onClick={handleSubmit}
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
      </div>
      <br />
      <Table
        dataSource={koiStandard.sort(
          (a, b) => a.koiVarietyID - b.koiVarietyID || a.period - b.period
        )}
        columns={columns}
      />
    </>
  );
}

export default KoiStandard;
