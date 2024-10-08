import { Button, Form, Image, Input, Modal, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { render } from "react-dom";

function Manage() {
  const [dataSourcePending, setDataSourcePending] = useState([]);
  const [dataSourceApproved, setDataSourceApproved] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form] = useForm();
  // const [isApprove, setIsApprove] = useState(false);

  // const handleApprove = async () => {
  //   try {
  //     const postID = await api.get("");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
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
  const handleFinish = (value) => {
    form.resetFields();
    setIsOpen(false);
    console.log(value);
  };
  useEffect(() => {
    fetchDataApproved();
    fetchDataPending();
  }, []);
  function handleUpdate(value) {
    setIsOpen(true);
    form.setFieldsValue(value);
  }
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
        <Button color={value ? "green" : "red"}>{value + ""}</Button>
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
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (value) => <Image src={value} />,
    },
    {
      title: "Description",
https://github.com/AntiHero23/SWP-Project/pull/8/conflict?name=src%252Fpage%252Fhome%252Findex.jsx&ancestor_oid=cf647f6c273293ccc43034d121cf95e1c79d73fd&base_oid=8352c4e6a46655830c92d0f6b4d11a6edd8a30f8&head_oid=7cea98b67b48b731f2999c2a0e4ba91bdbad901a      dataIndex: "description",
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
  ];

  return (
    <>
      <h1>Post Pending Table</h1>
      <Table dataSource={dataSourcePending} columns={pendingColumns} />
      <h1>Post Approved Table</h1>
      <Table dataSource={dataSourceApproved} columns={approvedColumns} />
    </>
  );
}

export default Manage;
