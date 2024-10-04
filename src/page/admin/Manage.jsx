import { Button, Form, Input, Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import { useForm } from "antd/es/form/Form";

function Manage() {
  const [dataSource, setDataSource] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form] = useForm();
  const fetchData = async () => {
    try {
      const response = await api.get("");
      setDataSource([response.data]);
    } catch (error) {
      console.log(error);
    }
  };
  const handleFinish = (value) => {
    setDataSource([...dataSource, value]);
    form.resetFields();
    setIsOpen(false);
    console.log(value);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
  ];
  return (
    <>
      <Modal
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleFinish}>
          <Form.Item label="Name " name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Age " name="age">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Button onClick={() => setIsOpen(true)}>Add staff</Button>
      <Table dataSource={dataSource} columns={columns} />;
    </>
  );
}

export default Manage;
