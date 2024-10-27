import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { Button, Form, InputNumber, Modal, Table } from "antd";

function TempStandard() {
  const [data, setData] = useState([]);
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const [form] = useForm();

  const fetchData = async () => {
    try {
      const response = await api.get("tempcoef/viewall");
      setData(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCreate = (values) => {
    api
      .post("tempcoef/create", values)
      .then((response) => {
        console.log(response);
        form.resetFields();
        setIsCreateModal(false);
        fetchData();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleCancel = () => {
    form.resetFields();
    setIsCreateModal(false);
    setIsUpdateModal(false);
    setIsDeleteModal(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const columns = [
    {
      title: "Temperature Range (°C)",
      dataIndex: ["tempFrom", "tempTo"],
      key: ["tempFrom", "tempTo"],
      render: (text, record) => `${record.tempFrom} - ${record.tempTo}`,
    },
    {
      title: "Temperature Coefficient",
      dataIndex: "coef",
      key: "coef",
    },
    {
      title: "Update",
      dataIndex: "tempID",
      key: "tempID",
      render: (text, record) => (
        <Button
          type="primary"
          style={{ width: "80px" }}
          onClick={() => {
            setIsUpdateModal(true);
            form.setFieldsValue({
              tempID: record.tempID,
              tempFrom: record.tempFrom,
              tempTo: record.tempTo,
              coef: record.coef,
            });
          }}
        >
          Update
        </Button>
      ),
    },
    {
      title: "Delete",
      dataIndex: "tempID",
      key: "tempID",
      render: (text, record) => (
        <Button
          type="primary"
          danger
          style={{ width: "80px" }}
          onClick={() => {
            setIsDeleteModal(true);
            form.setFieldsValue({
              tempID: record.tempID,
              tempFrom: record.tempFrom,
              tempTo: record.tempTo,
              coef: record.coef,
            });
          }}
        >
          Delete
        </Button>
      ),
    },
  ];
  return (
    <>
      <h1>Temperature Coefficient</h1>
      <br />
      <div style={{ textAlign: "center" }}>
        <Button
          type="primary"
          style={{ width: "100px" }}
          onClick={() => {
            setIsCreateModal(true), form.setFieldValue(null);
          }}
        >
          Create
        </Button>
        <Modal
          title="Create Temperature Coefficient"
          style={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
          }}
          open={isCreateModal}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form} onFinish={handleCreate}>
            <Form.Item
              name="tempFrom"
              label="Temperature From (°C)"
              rules={[
                {
                  required: true,
                  message: "Please input temperature from!",
                },
              ]}
            >
              <InputNumber
                placeholder="Temperature From (°C)"
                style={{ width: "150px", float: "right" }}
                min={0}
                formatter={(value) =>
                  value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
            <Form.Item
              name="tempTo"
              label="Temperature To (°C)"
              rules={[
                {
                  required: true,
                  message: "Please input temperature to!",
                },
              ]}
            >
              <InputNumber
                placeholder="Temperature To (°C)"
                style={{ width: "150px", float: "right" }}
                min={0}
                formatter={(value) =>
                  value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
            <Form.Item
              name="coef"
              label="Temperature Coefficient"
              rules={[
                {
                  required: true,
                  message: "Please input temperature coefficient!",
                },
              ]}
            >
              <InputNumber
                placeholder="Temperature Coefficient"
                style={{ width: "150px", float: "right" }}
                min={0}
                formatter={(value) =>
                  value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
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
          </Form>
        </Modal>
      </div>
      <br />
      <Modal
        title="Update Temperature Coefficient"
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
        }}
        open={isUpdateModal}
        onCancel={handleCancel}
        closable={false}
        footer={null}
      >
        <Form
          form={form}
          onFinish={() => setIsUpdateModal(false)}
          initialValues={form.getFieldsValue({
            tempID: data.tempID,
            tempFrom: data.tempFrom,
            tempTo: data.tempTo,
            coef: data.coef,
          })}
        >
          <Form.Item
            name="tempFrom"
            label="Temperature From (°C)"
            rules={[
              {
                required: true,
                message: "Please input temperature from!",
              },
            ]}
          >
            <InputNumber
              placeholder="Temperature From (°C)"
              style={{ width: "150px", float: "right" }}
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item
            name="tempTo"
            label="Temperature To (°C)"
            rules={[
              {
                required: true,
                message: "Please input temperature to!",
              },
            ]}
          >
            <InputNumber
              placeholder="Temperature To (°C)"
              style={{ width: "150px", float: "right" }}
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item
            name="coef"
            label="Coefficient"
            rules={[
              {
                required: true,
                message: "Please input coefficient!",
              },
            ]}
          >
            <InputNumber
              placeholder="Coefficient"
              style={{ width: "150px", float: "right" }}
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Button
            type="primary"
            onClick={() => {
              api
                .put(
                  `tempcoef/update/${form.getFieldValue().tempID}`,
                  form.getFieldsValue()
                )
                .then((response) => {
                  console.log(response);
                  form.resetFields();
                  setIsUpdateModal(false);
                  fetchData();
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
        </Form>
      </Modal>
      <Modal
        title="Are you sure you want to delete this temperature coefficient?"
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
        }}
        open={isDeleteModal}
        onCancel={handleCancel}
        closable={false}
        footer={null}
      >
        <Button
          type="primary"
          onClick={() => {
            api
              .delete(`tempcoef/delete/${form.getFieldValue().tempID}`)
              .then(() => {
                form.resetFields();
                setIsDeleteModal(false);
                fetchData();
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
      <Table dataSource={data} columns={columns} />
    </>
  );
}

export default TempStandard;
