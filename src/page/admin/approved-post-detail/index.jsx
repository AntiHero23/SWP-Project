import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { Button, Card, Modal, Tag } from "antd";

function ApprovedPostDetail() {
  const { id } = useParams();
  const postId = parseInt(id);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [form] = useForm();
  const navigate = useNavigate();

  const fetchPostDetail = async () => {
    setLoading(true);
    try {
      const response = await api.get(`post/view/postdetail/${postId}`);
      setPost(response.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const showModal = () => {
    setIsOpenModal(true);
  };
  const handleCancel = () => {
    form.resetFields();
    setIsOpenModal(false);
  };
  const handleSubmit = async () => {
    setIsOpenModal(false);
  };

  useEffect(() => {
    fetchPostDetail();
  }, []);

  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1>Post Detail</h1>
        <br />
        {!loading && (
          <Card style={{ backgroundColor: "#6495ed" }}>
            <Card>
              <h2>{post?.productName}</h2>
              <img
                src={post?.image}
                alt={post?.productName}
                style={{ width: "100px" }}
              />
            </Card>
            <Card>
              <b>Description: </b>
              <p>
                {post?.description?.split("\n")?.map((item, index) => (
                  <React.Fragment key={index}>
                    {item}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            </Card>
            <Card>
              <b>Price: </b>
              {VND.format(post?.productPrice)}
            </Card>
            <Card>
              <b>Post Date: </b>
              {dayjs(post?.postDate).format("MMMM D, YYYY h:mm A")}
            </Card>
            <Card>
              <b>Expiration Date: </b>
              {dayjs(post?.expiredDate).format("MMMM D, YYYY h:mm A")}
            </Card>
            <Card>
              <b>Post Status: </b>
              <Tag color={post.postStatus ? "green" : "red"}>
                {post.postStatus ? "Approved" : "Pending"}
              </Tag>
            </Card>
            <Card>
              <Button
                type="primary"
                danger
                onClick={() => {
                  showModal();
                }}
                style={{
                  marginTop: "10px",
                  width: "100px",
                }}
              >
                Remove
              </Button>
              <Modal
                style={{
                  textAlign: "center",
                }}
                title="Are you sure you want to REMOVE this post?"
                open={isOpenModal}
                footer={null}
                closeIcon={null}
                onCancel={handleCancel}
              >
                <Button
                  type="primary"
                  onClick={() => {
                    handleSubmit();
                    api
                      .delete(`/admin/post/delete/${postId}`)
                      .then(() => {
                        fetchPostDetail();
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                    alert(
                      "Post removed successfully! Please wait for a while!"
                    );
                    setTimeout(() => {
                      navigate("/admin/post");
                    }, 5000);
                  }}
                  style={{
                    width: "100px",
                    marginTop: "10px",
                  }}
                >
                  Yes
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={handleCancel}
                  style={{
                    width: "100px",
                    marginLeft: "50px",
                  }}
                >
                  No
                </Button>
              </Modal>
            </Card>
          </Card>
        )}
      </div>
    </>
  );
}

export default ApprovedPostDetail;
