import React from "react";
import { Layout, Row, Col, Form, Input, Button } from "antd";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import api from "../../config/axios";

const Contact = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    api
      .post("/contact/send", {
        name: values.name,
        email: values.email,
        message: values.content,
      })
      .then((res) => {
        console.log(res);
        form.resetFields();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Layout>
      <Row justify="center" style={{ marginTop: 50 }}>
        <Col span={8}>
          <h1>Contact Us</h1>
          <Form form={form} name="basic" onFinish={onFinish}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Message"
              name="content"
              rules={[
                { required: true, message: "Please input your message!" },
              ]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Send
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={8} style={{ textAlign: "center" }}>
          <h1>Our Contact</h1>
          <p>
            <MailOutlined /> Email:{" "}
            <a href="mailto:contact@pondcompany.com">contact@pondcompany.com</a>
          </p>
          <p>
            <PhoneOutlined /> Phone: 0123 456 789
          </p>
        </Col>
      </Row>
    </Layout>
  );
};

export default Contact;
