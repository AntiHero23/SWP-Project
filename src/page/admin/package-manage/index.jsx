import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { render } from "react-dom";
import { Button, Table } from "antd";
import { useNavigate } from "react-router-dom";

function Package() {
  const [shopPackage, setShopPackage] = useState([]);
  const [memberPackage, setMemberPackage] = useState([]);

  const navigate = useNavigate();

  const fetchShopPackage = async () => {
    try {
      const responseShopPackage = await api.get(
        "admin/package/view/shoppackage"
      );
      setShopPackage(responseShopPackage.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchMemberPackage = async () => {
    try {
      const responseMemberPackage = await api.get(
        "admin/package/view/memberpackage"
      );
      setMemberPackage(responseMemberPackage.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchShopPackage();
    fetchMemberPackage();
  }, []);
  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  const shopPackageColumns = [
    {
      title: "Package Name",
      dataIndex: "name",
      key: "name",
      render: (text) => text.charAt(0).toUpperCase() + text.slice(1),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value) => VND.format(value),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (text) => `${text} months`,
    },
    {
      title: "Detail",
      dataIndex: "id",
      key: "id",
      render: (value) => (
        <Button
          type="primary"
          onClick={() => {
            navigate(`/admin/package/shop/${value}`);
          }}
        >
          Detail
        </Button>
      ),
    },
  ];
  const memberPackageColumns = [
    {
      title: "Package Name",
      dataIndex: "name",
      key: "name",
      render: (text) => text.charAt(0).toUpperCase() + text.slice(1),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value) => VND.format(value),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (text) => `${text} months`,
    },
    {
      title: "Detail",
      dataIndex: "id",
      key: "id",
      render: (value) => (
        <Button
          type="primary"
          onClick={() => {
            navigate(`/admin/package/member/${value}`);
          }}
        >
          Detail
        </Button>
      ),
    },
  ];
  return (
    <>
      <h1>Package Manage</h1>
      <br />
      <br />
      <h2>Member Package</h2>
      <Table dataSource={memberPackage} columns={memberPackageColumns} />
      <h2>Shop Package</h2>
      <Table dataSource={shopPackage} columns={shopPackageColumns} />
    </>
  );
}

export default Package;
