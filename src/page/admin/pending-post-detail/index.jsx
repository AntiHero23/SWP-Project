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

  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1>Post Detail</h1>
        {!loading && (
          <div>
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <h2>{post?.productName}</h2>
            <img
              src={post?.image}
              alt={post?.productName}
              style={{ width: "100px" }}
            />
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <b>Description: </b>
            <p>{post?.description}</p>
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <b>Price: </b>
            {VND.format(post?.productPrice)}
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <b>Post Date: </b>
            {dayjs(post?.postDate).format("MMMM D, YYYY h:mm A")}
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
            <br />
            <b>Post Status: </b>
            <Tag color={post.postStatus ? "green" : "red"}>
              {post.postStatus ? "Approved" : "Pending"}
            </Tag>
            <p>
              ______________________________________________________________________________________________________________________________________________________________________________________________________________________
            </p>
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
              title="Approve Post"
              style={{
                textAlign: "center",
              }}
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
                marginTop: "10px",
                marginLeft: "10px",
                width: "100px",
              }}
            >
              Reject
            </Button>
            <Modal
              title="Reject Post"
              style={{
                textAlign: "center",
              }}
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

export default PendingPostDetail;
