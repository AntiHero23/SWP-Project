import React, { useEffect, useState } from "react";
import { Button, Table, Tag } from "antd";
import api from "../../../config/axios";
import { render } from "react-dom";
import { useNavigate } from "react-router-dom";

function UserManage() {
  const [dataSourceAccount, setDataSourceAccount] = useState([]);

  const navigate = useNavigate();

  const fetchDataAccount = async () => {
    try {
      const responseAccount = await api.get("account");
      setDataSourceAccount(responseAccount.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDataAccount();
  }, []);

  const accountColumns = [
    {
      title: <b style={{ fontSize: "18px" }}>Username</b>,
      dataIndex: "username",
      key: "username",
    },
    // {
    //   title: "Password",
    //   dataIndex: "password",
    //   key: "password",
    // },
    // {
    //   title: "Name",
    //   dataIndex: "name",
    //   key: "name",
    // },
    // {
    //   title: "Phone",
    //   dataIndex: "phone",
    //   key: "phone",
    // },
    {
      title: <b style={{ fontSize: "18px" }}>Role</b>,
      dataIndex: "role",
      key: "role",
    },
    // {
    //   title: "Email",
    //   dataIndex: "email",
    //   key: "email",
    // },
    // {
    //   title: "Premium Status",
    //   dataIndex: "premiumStatus",
    //   key: "premiumStatus",
    // },
    // {
    //   title: " Expired Date",
    //   dataIndex: "expiredDate",
    //   key: "expiredDate",
    // },
    {
      title: <b style={{ fontSize: "18px" }}>Validation</b>,
      dataIndex: "status",
      key: "status",
      render: (value) => (
        <Tag color={value ? "green" : "red"}>{value ? "Valid" : "Banned"}</Tag>
      ),
    },
    {
      title: <b style={{ fontSize: "18px" }}>Details</b>,
      dataIndex: "accountID",
      key: "accountID",
      render: (value) => (
        <Button
          type="primary"
          onClick={() => {
            navigate(`/admin/userManage/details/${value}`);
          }}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Users Management</h1>
      <br />
      <Table dataSource={dataSourceAccount} columns={accountColumns} />
    </>
  );
}

export default UserManage;
