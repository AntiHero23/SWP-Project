import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { render } from "react-dom";
import { Button } from "antd";
import { useForm } from "antd/es/form/Form";
import { useParams } from "react-router-dom";

function ShopPackage() {
  const { id } = useParams();
  const postId = id;
  const [loading, setLoading] = useState(false);
  const [shopPackage, setShopPackage] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [form] = useForm();

  const showModal = () => {
    setIsOpenModal(true);
  };
  const handleCancel = () => {
    form.resetFields();
    setIsOpenModal(false);
  };
  const handleSubmit = async (value) => {
    try {
      const response = await api.put(
        `/admin/package/update/${value}`,
        form.getFieldsValue()
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchShopPackage = async () => {
    setLoading(true);
    try {
      const responseShopPackage = await api.get(`admin/package/view/${postId}`);
      setShopPackage(responseShopPackage.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopPackage();
  }, []);
  const columns = [
    {
      title: "role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Package Name",
      dataIndex: "name",
      key: "name",
      render: (text) => text.charAt(0).toUpperCase() + text.slice(1),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => text + " VND",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Number Of Posts",
      dataIndex: "numberOfPosts",
      key: "numberOfPosts",
      render: (text) => text + " posts",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (text) => text + " months",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: () => (
        <Button type="primary" onClick={showModal}>
          Update
        </Button>
      ),
    },
  ];
  return (
    <>
      <div>
        <h1>Shop Package</h1>
        <br />
        <br />
        {!loading && (
          <div>
            <h2>{shopPackage.name}</h2>
            <p>Role: {shopPackage.role}</p>
            <p>Description: {shopPackage.description}</p>
            <p>Price: {shopPackage.price} VND</p>
            <p>Duration: {shopPackage.duration} months</p>
            <p>Number of Posts: {shopPackage.numberOfPosts} posts</p>
          </div>
        )}
      </div>
    </>
  );
}

export default ShopPackage;
