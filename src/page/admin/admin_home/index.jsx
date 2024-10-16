import { Typography } from "antd";
import React, { useEffect, useState } from "react";
import api from "../../../config/axios";

function AdminHome() {
  const [adminInfo, setAdminInfo] = useState([]);
  const [postData, setPostData] = useState({});

  const fetchPostData = async () => {
    try {
      const postDataResponse = await api.get("post/view");
      setPostData(postDataResponse.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getAdminInfo = async () => {
    try {
      const response = await api.get("currentAccount");
      setAdminInfo(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchPostData();
    getAdminInfo();
  }, []);

  return (
    <>
      <h1 style={{ textAlign: "center" }}>
        Welcome back, {adminInfo?.name || adminInfo?.email}!
      </h1>
    </>
  );
}

export default AdminHome;
