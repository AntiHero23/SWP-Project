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
  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1>Shop Package</h1>
        {!loading && (
          <div>
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <h2>{shopPackage.name}</h2>
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <b>Package For {shopPackage.role}</b>
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <b>Description: </b>
            <p>{shopPackage.description}</p>
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <b>Price: </b>
            {VND.format(shopPackage.price)}
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <b>Duration: </b>
            {shopPackage.duration} months
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <b>Number of Posts: </b>
            {shopPackage.numberOfPosts} posts
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
          </div>
        )}
      </div>
    </>
  );
}

export default ShopPackage;
