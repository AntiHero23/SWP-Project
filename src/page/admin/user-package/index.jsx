import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../config/axios";
import { useForm } from "antd/es/form/Form";

function MemberPackage() {
  const { id } = useParams();
  const postId = id;
  const [loading, setLoading] = useState(false);
  const [memberPackage, setMemberPackage] = useState([]);
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
    } catch (error) {
      console.log(error);
    }
  };
  const fetchMemberPackage = async () => {
    setLoading(true);
    try {
      const responseMemberPackage = await api.get(
        `admin/package/view/${postId}`
      );
      setMemberPackage(responseMemberPackage.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMemberPackage();
  }, []);
  return (
    <>
      <div>
        <h1>Member Package</h1>
        <br />
        <br />
        {!loading && (
          <div>
            <h2>{memberPackage.name}</h2>
            <p>Role: {memberPackage.role}</p>
            <p>Description: {memberPackage.description}</p>
            <p>Price: {memberPackage.price} VND</p>
            <p>Duration: {memberPackage.duration} months</p>
          </div>
        )}
      </div>
    </>
  );
}

export default MemberPackage;
