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
      title: <b style={{ fontSize: "18px" }}>Order code</b>,
      dataIndex: "orderCode",
      key: "orderCode",
    },
    {
      title: <b style={{ fontSize: "18px" }}>Package</b>,
      dataIndex: "apackage",
      key: "apackage",
      render: (text) => text.charAt(0).toUpperCase() + text.slice(1),
    },
    {
      title: <b style={{ fontSize: "18px" }}>Price (₫)</b>,
      dataIndex: "price",
      key: "price",
      render: (value) => VND.format(value),
    },
    {
      title: <b style={{ fontSize: "18px" }}>Date of purchase</b>,
      dataIndex: "date",
      key: "date",
      render: (value) => <p>{dayjs(value).format("MMMM D, YYYY h:mm A")}</p>,
    },
    {
      title: <b style={{ fontSize: "18px" }}>Expiration date</b>,
      dataIndex: "duration",
      key: "duration",
      render: (value, record) => {
        const date = dayjs(record.date).add(record.duration, "month");
        return date.format("MMMM D, YYYY h:mm A");
      },
    },
    {
      title: <b style={{ fontSize: "18px" }}>Status</b>,
      dataIndex: "status",
      key: "status",
      render: (value) => {
        if (value === "FAIL") {
          return <Tag color="red">{value}</Tag>;
        } else if (value === "SUCCESS") {
          return <Tag color="green">{value}</Tag>;
        }
      },
    },
  ];
  return (
    <>
      <h1 style={{ textAlign: "center" }}>History Transaction</h1>
      <Table dataSource={historyTranscation} columns={columns} />
    </>
  );
}

export default HistoryTransaction;
