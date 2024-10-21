import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { useForm } from "antd/es/form/Form";
import { Button, Modal } from "antd";

function MemberPackage() {
  const { id } = useParams();
  const postId = id;
  const [loading, setLoading] = useState(false);
  const [memberPackage, setMemberPackage] = useState([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isUpdateModal, setIsUpdateModal] = useState(false);

  const [form] = useForm();
  const navigate = useNavigate();

  // const showUpdateModal = () => {
  //   setIsUpdateModal(true);
  // };
  const handleCancelUpdate = () => {
    form.resetFields();
    setIsUpdateModal(false);
  };
  // const handleSubmit = async (value) => {
  //   try {
  //     const response = await api.put(
  //       `/admin/package/update/${value}`,
  //       form.getFieldsValue()
  //     );
  //     console.log(response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
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
  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1>Member Package</h1>
        {!loading && (
          <div>
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <h2>{memberPackage.name}</h2>
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <b>Package for {memberPackage.role}</b>
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <b>Description: </b>
            <p>{memberPackage.description}</p>
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <b>Price: </b>
            {VND.format(memberPackage.price)}
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <b>Duration: </b>
            {memberPackage.duration} months
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <Button
              type="primary"
              onClick={() => setIsUpdateModal(true)}
              style={{
                marginTop: "10px",
                width: "100px",
                textAlign: "center",
              }}
            >
              Update
            </Button>
            <Modal
              title="Update Package"
              style={{
                textAlign: "center",
              }}
              open={isUpdateModal}
              onOk={() => {
                api
                  .put(`/admin/post/approve/${postId}`)
                  .then(() => {})
                  .catch((error) => console.log(error));
                alert("Post approved successfully! Please wait for a while!");
                setIsUpdateModal(false);
              }}
              onCancel={() => {
                handleCancelUpdate();
              }}
            >
              aaa
            </Modal>
            <Button
              type="primary"
              danger
              onClick={() => setIsDeleteModal(true)}
              style={{
                marginTop: "10px",
                marginLeft: "10px",
                width: "100px",
              }}
            >
              Delete
            </Button>
            <Modal
              title="Are you sure you want to Delete this package?"
              style={{
                textAlign: "center",
              }}
              open={isDeleteModal}
              onOk={() => {
                api
                  .delete(`/admin/package/delete/${postId}`)
                  .then(() => {
                    fetchMemberPackage();
                  })
                  .catch((error) => console.log(error));
                alert("Post rejected successfully!");
                setTimeout(() => navigate("/admin/package"), 1000);
                setIsDeleteModal(false);
              }}
              onCancel={() => {
                setIsDeleteModal(false);
              }}
            />
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

export default MemberPackage;
