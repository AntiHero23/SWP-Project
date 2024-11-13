import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { Button, Card, Modal, Tag } from "antd";
import dayjs from "dayjs";

function PendingPostDetail() {
  const { id } = useParams();
  const postId = parseInt(id);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState();
  const [isApproveModal, setIsApproveModal] = useState(false);
  const [isRejectModal, setIsRejectModal] = useState(false);

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
  const showApproveModal = () => {
    setIsApproveModal(true);
  };
  const showRejectModal = () => {
    setIsRejectModal(true);
  };
  const handleCancel = () => {
    form.resetFields();
    setIsApproveModal(false);
    setIsRejectModal(false);
  };
  const handleApprove = async () => {
    setIsApproveModal(false);
  };
  const handleReject = async () => {
    setIsRejectModal(false);
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
              <b>Product Type: </b>
              {post?.productTypeName}
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
              <b>Link: </b>
              <a
                href={post.link}
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {post.link}
              </a>
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
              <b>Post Status: </b>
              <Tag color={post.postStatus ? "green" : "red"}>
                {post.postStatus ? "Approved" : "Pending"}
              </Tag>
            </Card>
            <Card>
              <Button
                type="primary"
                onClick={() => {
                  showApproveModal();
                }}
                style={{
                  marginTop: "10px",
                  width: "100px",
                  textAlign: "center",
                }}
              >
                Approve
              </Button>
              <Modal
                title="Are you sure you want to Approve this post?"
                style={{
                  textAlign: "center",
                }}
                open={isApproveModal}
                footer={null}
                closeIcon={null}
                onCancel={() => {
                  handleCancel();
                }}
              >
                <Button
                  type="primary"
                  onClick={() => {
                    handleApprove();
                    api
                      .put(`/admin/post/approve/${postId}`)
                      .then(() => {
                        fetchPostDetail();
                      })
                      .catch((error) => console.log(error));
                    alert(
                      "Post approved successfully! Please wait for a while!"
                    );
                    setTimeout(() => {
                      navigate("/admin/post");
                    }, 1000);
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
              <Button
                type="primary"
                danger
                onClick={() => {
                  showRejectModal();
                }}
                style={{
                  marginTop: "10px",
                  marginLeft: "10px",
                  width: "100px",
                }}
              >
                Reject
              </Button>
              <Modal
                title="Are you sure you want to Reject this post?"
                style={{
                  textAlign: "center",
                }}
                open={isRejectModal}
                footer={null}
                closeIcon={null}
                onCancel={() => {
                  handleCancel();
                }}
              >
                <Button
                  type="primary"
                  onClick={() => {
                    handleReject();
                    api
                      .delete(`/admin/post/reject/${postId}`)
                      .then(() => {
                        fetchPostDetail();
                      })
                      .catch((error) => console.log(error));
                    alert(
                      "Post rejected successfully! Please wait for a while!"
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

export default PendingPostDetail;
