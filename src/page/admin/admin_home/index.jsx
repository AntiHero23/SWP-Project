import { Button, Image, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../zustand/useAuthStore";
import { render } from "react-dom";

function AdminHome() {
  const { user, logout } = useAuthStore();
  const [adminInfo, setAdminInfo] = useState([]);
  const [postData, setPostData] = useState([]);
  const [dataSourceAccount, setDataSourceAccount] = useState([]);
  const [packageData, setPackageData] = useState([]);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };
  const getAdminInfo = async () => {
    try {
      const response = await api.get("currentAccount");
      setAdminInfo(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchPostData = async () => {
    try {
      const responsePeding = await api.get("post/view");
      setPostData(responsePeding.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchDataAccount = async () => {
    try {
      const responseAccount = await api.get("account");
      setDataSourceAccount(responseAccount.data);
      console.log(responseAccount.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchDataPackage = async () => {
    try {
      const responsePackage = await api.get("admin/package/viewAll");
      setPackageData(responsePackage.data.result);
      console.log(responsePackage.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDataPackage();
    fetchDataAccount();
    fetchPostData();
    getAdminInfo();
  }, []);
  const packageColumns = [
    {
      title: "Package Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Package Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
  ];
  const accountColumns = [
    {
      title: "User Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Validity",
      dataIndex: "status",
      key: "status",
      render: (value) => (
        <Tag color={value ? "green" : "red"}>{value ? "Valid" : "Banned"}</Tag>
      ),
    },
  ];
  const postColumns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (value) => <Image src={value} style={{ width: "100px" }} />,
    },
    {
      title: "Post Status",
      dataIndex: "postStatus",
      key: "postStatus",
      render: (value) => (
        <Tag color={value ? "green" : "red"}>
          {value ? "Approve" : "Pending"}
        </Tag>
      ),
    },
  ];
  return (
    <>
      {/* <Button
        type="primary"
        danger
        style={{ float: "left", width: "100px" }}
        className="profile-button profile-button-logout"
        onClick={handleLogout}
      >
        Logout
      </Button>
      <br />
      <br />
      <br /> */}
      <h1 style={{ textAlign: "center" }}>
        Welcome back, {adminInfo.name || adminInfo.email}!
      </h1>
      <br />
      <h2>
        Posts List
        <button
          onClick={() => navigate("post")}
          style={{ float: "right", width: "100px", marginBottom: "10px" }}
        >
          See More
        </button>
      </h2>
      <Table dataSource={postData} columns={postColumns} />
      <br />
      <h2>
        Users List
        <button
          onClick={() => navigate("userManager")}
          style={{ float: "right", width: "100px", marginBottom: "10px" }}
        >
          See More
        </button>
      </h2>
      <Table dataSource={dataSourceAccount} columns={accountColumns} />
      <br />
      <h2>
        Package List
        <button
          onClick={() => navigate("package")}
          style={{ float: "right", width: "100px", marginBottom: "10px" }}
        >
          See More
        </button>
      </h2>
      <Table dataSource={packageData} columns={packageColumns} />
    </>
  );
}

export default AdminHome;
