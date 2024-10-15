import { Button, Form, Image, Input, Modal, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";

function PostManage() {
  const [dataSourcePending, setDataSourcePending] = useState([]);
  const [dataSourceApproved, setDataSourceApproved] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form] = useForm();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const showModal = () => {
    setIsOpenModal(true);
  };
  const handleCancel = () => {
    form.resetFields();
    setIsOpenModal(false);
  };
  const handleOk = () => {
    setIsOpenModal(false);
  };
  const fetchDataPending = async () => {
    try {
      const responsePeding = await api.get("admin/post/view/pending");
      setDataSourcePending(responsePeding.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchDataApproved = async () => {
    try {
      const responseApproved = await api.get("admin/post/view/approved");
      setDataSourceApproved(responseApproved.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDataApproved();
    fetchDataPending();
  }, []);
  const pendingColumns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Product Price",
      dataIndex: "productPrice",
      key: "productPrice",
      render: (value) => value + " VND",
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
      render: (value) => (
        <a
          href={value}
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "10px",
          }}
        >
          {value}
        </a>
      ),
    },
    {
      title: "Post Date",
      dataIndex: "postDate",
      key: "postDate",
      render: (value) => <p>{dayjs(value).format("MMMM D, YYYY h:mm A")}</p>,
    },
    {
      title: "Post Status",
      dataIndex: "postStatus",
      key: "postStatus",
      render: (value) => (
        <Tag color={value ? "green" : "red"}>
          {value ? "Approved" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Approve",
      dataIndex: "postDetailId",
      key: "postDetailId",
      render: (value) => (
        <Button
          type="primary"
          onClick={() => {
            api
              .put(`/admin/post/approve/${value}`)
              .then(() => {
                fetchDataApproved();
                fetchDataPending();
              })
              .catch((error) => console.log(error));
          }}
        >
          Approve
        </Button>
      ),
    },
    {
      title: "Reject",
      dataIndex: "postDetailId",
      key: "postDetailId",
      render: (value) => (
        <Button
          type="primary"
          danger
          onClick={() => {
            showModal();
          }}
        >
          Reject
        </Button>
      ),
    },
  ];
  const approvedColumns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Product Price",
      dataIndex: "productPrice",
      key: "productPrice",
      render: (value) => value + " VND",
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
      render: (value) => (
        <a
          href={value}
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </a>
      ),
    },
    {
      title: "Post Date",
      dataIndex: "postDate",
      key: "postDate",
      render: (value) => <p>{dayjs(value).format("MMMM D, YYYY h:mm A")}</p>,
    },
    {
      title: "Post Status",
      dataIndex: "postStatus",
      key: "postStatus",
      render: (value) => (
        <Tag color={value ? "green" : "red"}>
          {value ? "Approved" : "Pending"}
        </Tag>
      ),
    },
  ];

  return (
    <>
      <Modal
        title="Reject Post"
        open={isOpenModal}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={null}
      ></Modal>
      <h1>Post Pending Table</h1>
      <Table dataSource={dataSourcePending} columns={pendingColumns} />
      <h1>Post Approved Table</h1>
      <Table dataSource={dataSourceApproved} columns={approvedColumns} />
    </>
  );
}

export default PostManage;
