
import React from "react";
import { Layout, Row, Col, Form, Input, Button } from "antd";
import { GlobalOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import api from "../../config/axios";
import logo from "../../assets/icon.png"
import "./index.scss";

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
    <div className="contact">
    <div className="contact-container">
    <Layout>
      <div className="contact-container">
      <Row justify="center" style={{ marginTop: 50 }}>
        <Col  span={8}>
        <div className="contact-form"> 
          <h1>Contact Us</h1>
          <Form layout="vertical" form={form} name="basic" onFinish={onFinish}>
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
        </div>
        </Col>
        <Col className="contact-info" span={8} style={{ textAlign: "center" }}>
          <h1>Our Contact</h1>
          <img 
          src= {logo} 
          className="contact-logo"
          />
          <p>
            <GlobalOutlined /> Location: 123 pond street  Water city, 12345
          </p>
          <p>
            <MailOutlined /> Email:{" "}
            <a href="mailto:contact@pondcompany.com">contact@pondcompany.com</a>
          </p>
          <p>
            <PhoneOutlined /> Phone: 0123 456 789
          </p>
        </Col>
      </Row>
      </div>
    </Layout>
    </div>
    </div>
  );
};



export default Contact;