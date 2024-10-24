import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
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
    // {
    //   title: "Phone",
    //   dataIndex: "phone",
    //   key: "phone",
    // },
    {
      title: "Role",
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
      title: "Details",
      dataIndex: "accountID",
      key: "accountID",
      render: (value) => (
        <Button
          type="primary"
          onClick={() => {
            // navigate(`/admin/user/${value}`);
          }}
        >
          Details
        </Button>
      ),
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
