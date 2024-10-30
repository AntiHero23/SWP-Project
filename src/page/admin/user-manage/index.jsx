import React, { useEffect, useState } from "react";
import { Button, Table, Tag, Input, Select } from "antd";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";

function UserManage() {
  const [dataSourceAccount, setDataSourceAccount] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const navigate = useNavigate();

  const fetchDataAccount = async () => {
    try {
      const responseAccount = await api.get("account");
      setDataSourceAccount(responseAccount.data);
      setFilteredData(responseAccount.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataAccount();
  }, []);

  useEffect(() => {
    let data = dataSourceAccount;
    if (searchUser) {
      data = data.filter((account) =>
        account.username.toLowerCase().includes(searchUser.toLowerCase())
      );
    }
    if (selectedRole) {
      data = data.filter((account) => account.role === selectedRole);
    }
    setFilteredData(data);
  }, [searchUser, selectedRole, dataSourceAccount]);

  const accountColumns = [
    {
      title: <b style={{ fontSize: "18px" }}>Username</b>,
      dataIndex: "username",
      key: "username",
    },
    {
      title: <b style={{ fontSize: "18px" }}>Role</b>,
      dataIndex: "role",
      key: "role",
    },
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
      <div style={{ textAlign: "center" }}>
        <Input
          placeholder="Search by Username"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          style={{ marginBottom: 20, width: 200 }}
        />
        <Select
          placeholder="Filter by Role"
          value={selectedRole}
          onChange={(value) => setSelectedRole(value)}
          style={{ marginLeft: 10, marginBottom: 20, width: 200 }}
        >
          <Select.Option value="">All</Select.Option>
          <Select.Option value="ADMIN">ADMIN</Select.Option>
          <Select.Option value="SHOP">SHOP</Select.Option>
          <Select.Option value="MEMBER">MEMBER</Select.Option>
          {/* Add more roles as needed */}
        </Select>
        <Table dataSource={filteredData} columns={accountColumns} />
      </div>
    </>
  );
}

export default UserManage;
