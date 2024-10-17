import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { Button, Modal, Tag } from "antd";

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

  return (
    <>
      <div>
        <h1>Post Detail</h1>
        {!loading && (
          <div>
            <h2>{post?.productName}</h2>
            <img
              src={post?.image}
              alt={post?.productName}
              style={{ width: "100px" }}
            />
            <p>Description: {post?.description}</p>
            <p>Price: {post?.productPrice} VND</p>
            <p>
              Post Date: {dayjs(post?.postDate).format("MMMM D, YYYY h:mm A")}
            </p>
            <p>
              Expiration Date:{" "}
              {dayjs(post?.expiredDate).format("MMMM D, YYYY h:mm A")}
            </p>
            <p>
              Post Status:{" "}
              <Tag color={post.postStatus ? "green" : "red"}>
                {post.postStatus ? "Approved" : "Pending"}
              </Tag>
            </p>
            <Button
              type="primary"
              danger
              onClick={() => {
                showModal();
              }}
              style={{
                float: "left",
                marginTop: "10px",
                width: "100px",
              }}
            >
              Remove
            </Button>
            <Modal
              title="Remove Post"
              open={isOpenModal}
              onOk={() => {
                handleSubmit();
                api
                  .delete(`/admin/post/reject/${postId}`)
                  .then(() => {
                    fetchPostDetail();
                  })
                  .catch((error) => {
                    console.log(error);
                  });
                alert("Post removed successfully! Please wait for a while!");
                setTimeout(() => {
                  navigate("/admin/post");
                }, 5000);
              }}
              onCancel={() => {
                handleCancel();
              }}
            >
              Are you sure you want to remove this post?
            </Modal>
          </div>
        )}
      </div>
    </>
  );
}

export default ApprovedPostDetail;
