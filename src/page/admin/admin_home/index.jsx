import { Button, Card, Col, Flex, Image, Row, Space, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../zustand/useAuthStore";
import { render } from "react-dom";
import dayjs from "dayjs";

function AdminHome() {
  const [adminInfo, setAdminInfo] = useState([]);
  const [historyTransaction, setHistoryTransaction] = useState([]);
  const [totalAccount, setTotalAccount] = useState(0);
  const [totalOder, setTotalOrder] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const navigate = useNavigate();

  const getTotalAccount = async () => {
    try {
      const response = await api.get("admin/totalAccount");
      setTotalAccount(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  const getTotalOrder = async () => {
    try {
      const response = await api.get("admin/totalOrder");
      setTotalOrder(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  const getTotalRevenue = async () => {
    try {
      const response = await api.get("admin/totalRevenue");
      setTotalRevenue(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  const getAdminInfo = async () => {
    try {
      const response = await api.get("currentAccount");
      setAdminInfo(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchHistoryTransaction = async () => {
    try {
      const responsePeding = await api.get("transaction/viewAll");
      setHistoryTransaction(responsePeding.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchHistoryTransaction();
    getTotalAccount();
    getTotalOrder();
    getTotalRevenue();
    getAdminInfo();
  }, []);
  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  const columns = [
    {
      title: "Order Code",
      dataIndex: "orderCode",
      key: "orderCode",
    },
    {
      title: "Package",
      dataIndex: "apackage",
      key: "apackage",
      render: (text) => text.charAt(0).toUpperCase() + text.slice(1),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value) => VND.format(value),
    },
    {
      title: "Date of purchase",
      dataIndex: "date",
      key: "date",
      render: (value) => <p>{dayjs(value).format("MMMM D, YYYY h:mm A")}</p>,
    },
    {
      title: "Expiration date",
      dataIndex: "duration",
      key: "duration",
      render: (value, record) => {
        const date = dayjs(record.date).add(record.duration, "month");
        return date.format("MMMM D, YYYY h:mm A");
      },
    },
  ];
  return (
    <>
      <h1 style={{ textAlign: "center" }}>
        Welcome back, {adminInfo.name || adminInfo.email}!
      </h1>
      <br />
      <h2>Overview</h2>
      <br />
      <Row gutter={16} style={{ textAlign: "center" }}>
        <Col span={8}>
          <Card
            title="Total Account"
            bordered={false}
            style={{ backgroundColor: "#f5deb3" }}
          >
            {totalAccount}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Total Orders"
            bordered={false}
            style={{ backgroundColor: "#f5deb3" }}
          >
            {totalOder}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Total Revenue"
            bordered={false}
            style={{ backgroundColor: "#f5deb3" }}
          >
            {VND.format(totalRevenue)}
          </Card>
        </Col>
      </Row>
      <br />
      <h2>Transaction Dashboard</h2>
      {/* Minh làm ở đây nhen! */}
      <br />
      <h2>History Transaction</h2>
      <Table dataSource={historyTransaction} columns={columns} />
    </>
  );
}

export default AdminHome;
