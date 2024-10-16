import { Typography } from "antd";
import React, { useEffect, useState } from "react";
import api from "../../../config/axios";

function AdminHome() {
  const [adminInfo, setAdminInfo] = useState([]);

  const getAdminInfo = async () => {
    try {
      const response = await api.get("currentAccount");
      setAdminInfo(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAdminInfo();
  }, []);

  return (
    <>
      <h1 style={{ textAlign: "center" }}>
        Welcome back,{" "}
        {adminInfo?.username || adminInfo?.name || adminInfo?.email || "Admin"}!
      </h1>
    </>
  );
}

export default AdminHome;
