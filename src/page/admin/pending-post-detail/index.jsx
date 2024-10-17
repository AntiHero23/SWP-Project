import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { Button, Modal, Tag } from "antd";
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

  return (
    <>
      <div>
        <h1>Post Detail</h1>
        {!loading && (
          <div>
            <h2>{post?.productName}</h2>
            <img src={post?.image} alt={post?.productName} />
            <p>Description: {post?.description}</p>
            <p>Price: {post?.productPrice} VND</p>
            <p>
              Post Date: {dayjs(post?.postDate).format("MMMM D, YYYY h:mm A")}
            </p>
            <p>
              Post Status:{" "}
              <Tag color={post.postStatus ? "green" : "red"}>
                {post.postStatus ? "Approved" : "Pending"}
              </Tag>
            </p>
            <Button
              type="primary"
              onClick={() => {
                showApproveModal();
              }}
              style={{
                float: "left",
                marginTop: "10px",
                width: "100px",
              }}
            >
              Approve
            </Button>
            <Modal
              title="Approve Post"
              open={isApproveModal}
              onOk={() => {
                handleApprove();
                api
                  .put(`/admin/post/approve/${postId}`)
                  .then(() => {
                    fetchPostDetail();
                  })
                  .catch((error) => console.log(error));
                alert("Post approved successfully! Please wait for a while!");
                setTimeout(() => {
                  navigate("/admin/post");
                }, 1000);
              }}
              onCancel={() => {
                handleCancel();
              }}
            >
              Are you sure you want to approve this post?
            </Modal>
            <Button
              type="primary"
              danger
              onClick={() => {
                showRejectModal();
              }}
              style={{
                float: "left",
                marginTop: "10px",
                marginLeft: "10px",
                width: "100px",
              }}
            >
              Reject
            </Button>
            <Modal
              title="Reject Post"
              open={isRejectModal}
              onOk={() => {
                handleReject();
                api
                  .delete(`/admin/post/reject/${postId}`)
                  .then(() => {
                    fetchPostDetail();
                  })
                  .catch((error) => console.log(error));
                alert("Post rejected successfully! Please wait for a while!");
                setTimeout(() => {
                  navigate("/admin/post");
                }, 5000);
              }}
              onCancel={() => {
                handleCancel();
              }}
            >
              Are you sure you want to reject this post?
            </Modal>
          </div>
        )}
      </div>
    </>
  );
}

export default PendingPostDetail;
