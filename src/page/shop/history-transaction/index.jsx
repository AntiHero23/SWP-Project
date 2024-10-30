import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import dayjs from "dayjs";
import { Table, Tag, Select, Input, Space } from "antd";

function HistoryTransaction() {
  const [historyTransaction, setHistoryTransaction] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [packageSearch, setPackageSearch] = useState("All");
  const [dateSearch, setDateSearch] = useState("");
  const [packageOptions, setPackageOptions] = useState([]);

  const getHistoryTransaction = async () => {
    try {
      const response = await api.get("transaction/view/currentAccount");
      setHistoryTransaction(response.data);
      setFilteredData(response.data);
      const uniquePackages = [
        ...new Set(response.data.map((item) => item.apackage)),
      ];
      setPackageOptions([
        { value: "All", label: "All" },
        ...uniquePackages.map((pkg) => ({ value: pkg, label: pkg })),
      ]);
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

  useEffect(() => {
    const filtered = historyTransaction.filter((item) => {
      const matchesPackage = packageSearch
        ? packageSearch === "All"
          ? true
          : item.apackage === packageSearch
        : true;
      const matchesDate = dateSearch
        ? dayjs(item.date).format("YYYY-MM-DD").includes(dateSearch)
        : true;
      return matchesPackage && matchesDate;
    });
    setFilteredData(filtered);
  }, [packageSearch, dateSearch, historyTransaction]);

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
      <div style={{ textAlign: "center" }}>
        <Select
          placeholder="Select package"
          value={packageSearch}
          style={{ marginBottom: 20, width: 200 }}
          onChange={(value) => setPackageSearch(value)}
          options={packageOptions}
        />
        <Input
          type="date"
          placeholder="Search by date"
          style={{ marginLeft: 10, marginBottom: 20, width: 200 }}
          value={dateSearch}
          onChange={(e) => setDateSearch(e.target.value)}
        />
      </div>
      <Table dataSource={filteredData} columns={columns} />
    </>
  );
}

export default HistoryTransaction;
