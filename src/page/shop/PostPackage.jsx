import { Button, Image, Input, Modal, Table, Tag } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import api from "../../config/axios";

function PostPackage() {
  const [postPackage, setPostPackage] = useState([]);
  const [dataSourcePending, setDataSourcePending] = useState([]);
  const [dataSourceApproved, setDataSourceApproved] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const fetchDataPending = async () => {
    try {
      const responsePeding = await api.get("admin/post/view/pending");
      setDataSourcePending(responsePeding.data);
      console.log(responsePeding.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchDataApproved = async () => {
    try {
      const responseApproved = await api.get("admin/post/view/approved");
      setDataSourceApproved(responseApproved.data);
      console.log(responseApproved.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDataApproved();
    fetchDataPending();
  }, []);
  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Product Price",
      dataIndex: "productPrice",
      key: "productPrice",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (value) => <Image src={value} />,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
    },
    {
      title: "Post Date",
      dataIndex: "postDate",
      key: "postDate",
      render: (value) => <p>{dayjs().format("MMMM D, YYYY h:mm A")}</p>,
    },
    {
      title: "Post Status",
      dataIndex: "postStatus",
      key: "postStatus",
      render: (value) => (
        <Tag color={value ? "green" : "red"}>{value + ""}</Tag>
      ),
    },
    {
      title: "Approve",
      dataIndex: "postStatus",
      key: "postStatus",
      render: (value) => (
        <Tag color={value ? "green" : "red"}>{value + ""}</Tag>
      ),
    },
  ];

  return (
    <>
      <Button onClick={showModal}>New Post</Button>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
      <h1>Post Pending Table</h1>
      <Table dataSource={dataSourcePending} columns={columns} />
      {/* <h1>Post Approved Table</h1>
      <Table dataSource={dataSourceApproved} columns={columns} /> */}
    </>
  );
}

export default PostPackage;
