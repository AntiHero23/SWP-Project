import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { Button, Form, InputNumber, Modal, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { useForm } from "antd/es/form/Form";

function FeedingStandard() {
  const [data, setData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [form] = useForm();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await api.get("feedcoef/viewall");
      setData(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (values) => {
    try {
      await api.post("feedcoef/create", values);
      alert("Feeding coefficient created successfully!");
      form.resetFields();
      setIsOpenModal(false);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancel = () => {
    form.resetFields();
    setIsOpenModal(false);
  };
  useEffect(() => {
    fetchData();
  });
  const columns = [
    {
      title: "Age Range (day)",
      dataIndex: ["ageFrom", "ageTo"],
      key: ["ageFrom", "ageTo"],
      render: (value, record) =>
        `${record.ageFrom}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
        " - " +
        `${record.ageTo}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    },
    {
      title: "Low",
      dataIndex: "low",
      key: "low",
    },
    {
      title: "Medium",
      dataIndex: "medium",
      key: "medium",
    },
    {
      title: "High",
      dataIndex: "high",
      key: "high",
    },
    {
      title: "Details",
      dataIndex: "feedCoefID",
      key: "feedCoefID",
      render: (value) => (
        <Button
          type="primary"
          onClick={() => {
            navigate(`/admin/feedingCoefficient/details/${value}`);
          }}
        >
          Details
        </Button>
      ),
    },
  ];
  return (
    <>
      <h1>Feeding Coefficient</h1>
      <br />
      <div style={{ textAlign: "center" }}>
        <Button
          type="primary"
          style={{ width: "200px" }}
          onClick={() => setIsOpenModal(true)}
        >
          Create Feeding Coefficient
        </Button>
        <Modal
          title="Create Feeding Coefficient"
          open={isOpenModal}
          footer={null}
          closable={false}
          style={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
          }}
          onCancel={handleCancel}
        >
          <Form form={form} layout="horizontal" onFinish={handleSubmit}>
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
      </div>
      <br />

      <Table dataSource={data} columns={columns} />
    </>
  );
}

export default FeedingStandard;
