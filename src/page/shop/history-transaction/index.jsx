import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import dayjs from "dayjs";
import { Table, Tag } from "antd";

function HistoryTransaction() {
  const [historyTranscation, setHistoryTransaction] = useState([]);

  const getHistoryTransaction = async () => {
    try {
      const response = await api.get("transaction/view/currentAccount");
      setHistoryTransaction(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getHistoryTransaction();
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
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
  ];
  return (
    <>
      <h1>History Transaction</h1>
      <Table dataSource={historyTranscation} columns={columns} />
    </>
  );
}

export default HistoryTransaction;
