import React, { useEffect, useState } from "react";
import { Table } from "antd";
import api from "../../../config/axios";

function UserManage() {
  const [dataSourceAccount, setDataSourceAccount] = useState([]);

  const fetchDataAccount = async () => {
    try {
      const responseAccount = await api.get("account");
      setDataSourceAccount(responseAccount.data);
      console.log(responseAccount.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDataAccount();
  }, []);

  const accountColumns = [
    {
      title: "User Name",
      dataIndex: "username",
      key: "username",
    },
    // {
    //   title: "Password",
    //   dataIndex: "password",
    //   key: "password",
    // },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Premium Status",
      dataIndex: "premiumStatus",
      key: "premiumStatus",
    },
    {
      title: " Expired Date",
      dataIndex: "expiredDate",
      key: "expiredDate",
    },
  ];

  return (
    <>
      <h1>User Account Table</h1>
      <Table dataSource={dataSourceAccount} columns={accountColumns} />
    </>
  );
}

export default UserManage;
