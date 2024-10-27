import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { Button, Col, Form, InputNumber, Modal, Row, Table } from "antd";

function PondStandard() {
  const [pondStandard, setPondStandard] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [form] = useForm();
  const navigate = useNavigate();

  const fetchPondStandard = async () => {
    try {
      const response = await api.get("admin/viewall/pondstandard");
      setPondStandard(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      await api
        .post("admin/pondstandard/create", form.getFieldValue())
        .then(() => {
          fetchPondStandard();
        });
      alert("Pond standard created successfully!");
      form.resetFields();
      setIsOpenModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancel = () => {
    form.resetFields();
    setIsOpenModal(false);
  };

  useEffect(() => {
    fetchPondStandard();
  }, []);

  const columns = [
    {
      title: (
        <b style={{ fontSize: "18px" }}>
          Area (m<sup>2</sup>)
        </b>
      ),
      dataIndex: "area",
      key: "area",
      render: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    },
    {
      title: <b style={{ fontSize: "18px" }}>Depth (m)</b>,
      dataIndex: ["minDepth", "maxDepth"],
      key: ["minDepth", "maxDepth"],
      render: (value, record) =>
        `${record.minDepth}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
        " - " +
        `${record.maxDepth}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    },
    {
      title: <b style={{ fontSize: "18px" }}>Volume (l)</b>,
      dataIndex: ["minVolume", "maxVolume"],
      key: ["minVolume", "maxVolume"],
      render: (value, record) =>
        `${record.minVolume}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
        " - " +
        `${record.maxVolume}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    },
    // {
    //   title: "Drain Count",
    //   dataIndex: "drainCount",
    //   key: "drainCount",
    // },
    // {
    //   title: "Skimmer Count",
    //   dataIndex: "skimmerCount",
    //   key: "skimmerCount",
    // },
    // {
    //   title: "Maximum Pumping Capacity",
    //   dataIndex: "maxPumpingCapacity",
    //   key: "maxPumpingCapacity",
    //   render: (value) => `${value} l/h`,
    // },
    {
      title: <b style={{ fontSize: "18px" }}>Number of Fish</b>,
      dataIndex: ["minAmountFish", "maxAmountFish"],
      key: ["minAmountFish", "maxAmountFish"],
      render: (value, record) =>
        `${record.minAmountFish} - ${record.maxAmountFish}`,
    },
    {
      title: <b style={{ fontSize: "18px" }}>Details</b>,
      dataIndex: "pondStandardID",
      key: "pondStandardID",
      render: (value) => (
        <Button
          type="primary"
          onClick={() => {
            navigate(`/admin/pondStandards/details/${value}`);
          }}
        >
          Details
        </Button>
      ),
    },
  ];
  return (
    <>
      <h1 style={{ textAlign: "center" }}>Pond Standards</h1>
      <br />
      <div style={{ textAlign: "center" }}>
        <Button
          type="primary"
          style={{ width: "175px", textAlign: "center" }}
          onClick={() => setIsOpenModal(true)}
        >
          Add Pond Standard
        </Button>
        <Modal
          title="Add Pond Standard"
          open={isOpenModal}
          style={{ textAlign: "center" }}
          onCancel={handleCancel}
          footer={null}
          closable={false}
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
          {/* <Form form={form} onFinish={handleSubmit} label="left">
            <Form.Item
              label=""
              name=""
              rules={[{ required: true, message: "Please select role!" }]}
              >
                <InputNumber />
              </Form.Item>
          </Form> */}
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
        dataSource={pondStandard.sort((a, b) => a.area - b.area)}
        columns={columns}
      />
    </>
  );
}

export default PondStandard;
