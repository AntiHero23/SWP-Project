import { Button, Form, Image, Input, Modal, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

function PostManage() {
  const [dataSourcePending, setDataSourcePending] = useState([]);
  const [dataSourceApproved, setDataSourceApproved] = useState([]);
  const [shopPost, setShopPost] = useState([]);
  const [isRejectModal, setIsRejectModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const [form] = useForm();
  const navigate = useNavigate();

  const showRejectModal = () => {
    setIsRejectModal(true);
  };
  const showDeleteModal = () => {
    setIsDeleteModal(true);
  };
  const handleCancel = () => {
    form.resetFields();
    setIsRejectModal(false);
    setIsDeleteModal(false);
  };
  const handleOk = () => {
    setIsRejectModal(false);
    setIsDeleteModal(false);
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
  const fetchShopPost = async () => {
    try {
      const responseShopPost = await api.get("shop");
      setShopPost(responseShopPost.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchShopPost();
    fetchDataApproved();
    fetchDataPending();
  }, []);
  const pendingColumns = [
    {
      title: <b style={{ fontSize: "18px" }}>Product Name</b>,
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: <b style={{ fontSize: "18px" }}>Posted By</b>,
      dataIndex: "shopID",
      key: "shopID",
      render: (value) => {
        const shop = shopPost.find((item) => item.shopID === value);
        return shop ? shop.name : "N/A";
      },
    },
    // {
    //   title: "Product Price",
    //   dataIndex: "productPrice",
    //   key: "productPrice",
    //   render: (value) => value + " VND",
    // },
    {
      title: <b style={{ fontSize: "18px" }}>Image</b>,
      dataIndex: "image",
      key: "image",
      render: (value) => <Image src={value} style={{ width: "100px" }} />,
    },
    // {
    //   title: "Description",
    //   dataIndex: "description",
    //   key: "description",
    // },
    // {
    //   title: "Link",
    //   dataIndex: "link",
    //   key: "link",
    //   render: (value) => (
    //     <a
    //       href={value}
    //       style={{
    //         overflow: "hidden",
    //         textOverflow: "ellipsis",
    //         whiteSpace: "nowrap",
    //         width: "10px",
    //       }}
    //     >
    //       {value}
    //     </a>
    //   ),
    // },
    // {
    //   title: "Post Date",
    //   dataIndex: "postDate",
    //   key: "postDate",
    //   render: (value) => <p>{dayjs(value).format("MMMM D, YYYY h:mm A")}</p>,
    // },
    {
      title: <b style={{ fontSize: "18px" }}>Post Status</b>,
      dataIndex: "postStatus",
      key: "postStatus",
      render: (value) => (
        <Tag color={value ? "green" : "red"}>
          {value ? "Approved" : "Pending"}
        </Tag>
      ),
    },
    {
      title: <b style={{ fontSize: "18px" }}>Details</b>,
      dataIndex: "postDetailId",
      key: "postDetailId",
      render: (value) => (
        <Button
          type="primary"
          onClick={() => {
            navigate(`/admin/post/details/pending/${value}`);
          }}
        >
          Details
        </Button>
      ),
    },
    // {
    //   title: "Approve",
    //   dataIndex: "postDetailId",
    //   key: "postDetailId",
    //   render: (value) => (
    //     <Button
    //       type="primary"
    //       onClick={() => {
    //         api
    //           .put(`/admin/post/approve/${value}`)
    //           .then(() => {
    //             fetchDataApproved();
    //             fetchDataPending();
    //           })
    //           .catch((error) => console.log(error));
    //       }}
    //     >
    //       Approve
    //     </Button>
    //   ),
    // },
    // {
    //   title: "Reject",
    //   dataIndex: "postDetailId",
    //   key: "postDetailId",
    //   render: (value) => (
    //     <Button
    //       type="primary"
    //       danger
    //       onClick={() => {
    //         showRejectModal();
    //       }}
    //     >
    //       Reject
    //     </Button>
    //   ),
    // },
  ];
  const approvedColumns = [
    {
      title: <b style={{ fontSize: "18px" }}>Product Name</b>,
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: <b style={{ fontSize: "18px" }}>Posted By</b>,
      dataIndex: "shopID",
      key: "shopID",
      render: (value) => {
        const shop = shopPost.find((item) => item.shopID === value);
        return shop ? shop.name : "N/A";
      },
    },
    // {
    //   title: "Product Price",
    //   dataIndex: "productPrice",
    //   key: "productPrice",
    //   render: (value) => value + " VND",
    // },
    {
      title: <b style={{ fontSize: "18px" }}>Image</b>,
      dataIndex: "image",
      key: "image",
      render: (value) => <Image src={value} style={{ width: "100px" }} />,
    },
    // {
    //   title: "Description",
    //   dataIndex: "description",
    //   key: "description",
    // },
    // {
    //   title: "Link",
    //   dataIndex: "link",
    //   key: "link",
    //   render: (value) => (
    //     <a
    //       href={value}
    //       style={{
    //         overflow: "hidden",
    //         textOverflow: "ellipsis",
    //         whiteSpace: "nowrap",
    //       }}
    //     >
    //       {value}
    //     </a>
    //   ),
    // },
    // {
    //   title: "Post Date",
    //   dataIndex: "postDate",
    //   key: "postDate",
    //   render: (value) => <p>{dayjs(value).format("MMMM D, YYYY h:mm A")}</p>,
    // },
    {
      title: <b style={{ fontSize: "18px" }}>Post Status</b>,
      dataIndex: "postStatus",
      key: "postStatus",
      render: (value) => (
        <Tag color={value ? "green" : "red"}>
          {value ? "Approved" : "Pending"}
        </Tag>
      ),
    },
    {
      title: <b style={{ fontSize: "18px" }}>Details</b>,
      dataIndex: "postDetailId",
      key: "postDetailId",
      render: (value) => (
        <Button
          type="primary"
          onClick={() => {
            navigate(`/admin/post/details/approved/${value}`);
          }}
        >
          Details
        </Button>
      ),
    },
    // {
    //   title: "Delete",
    //   dataIndex: "postDetailId",
    //   key: "postDetailId",
    //   render: (value) => (
    //     <Button
    //       type="primary"
    //       danger
    //       onClick={() => {
    //         showDeleteModal();
    //       }}
    //     >
    //       Delete
    //     </Button>
    //   ),
    // },
  ];

  return (
    <>
      {/* <Modal
        title="Reject Post"
        open={isRejectModal}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={null}
      ></Modal>
      <Modal
        title="Delete Post"
        open={isDeleteModal}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={null}
      ></Modal> */}
      <h1 style={{ textAlign: "center" }}>Posts Management</h1>
      <br />
      <br />
      <h2>Post Pending Table</h2>
      <Table dataSource={dataSourcePending} columns={pendingColumns} />
      <h2>Post Approved Table</h2>
      <Table dataSource={dataSourceApproved} columns={approvedColumns} />
    </>
  );
}

export default PostManage;
