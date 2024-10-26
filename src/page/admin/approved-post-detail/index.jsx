import styled from "styled-components";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { Button, Card, Modal, Tag } from "antd";

// Styled components
const PostDetailContainer = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: #555;
  margin-bottom: 10px;
`;

const PostDetailImage = styled.img`
  display: block;
  max-width: 100px;
  margin: 20px 0;
  border-radius: 5px;
`;

const PostDetailInfo = styled.p`
  font-size: 1.2rem; /* Increased font size */
  color: #333; /* Darker color for better contrast */
  margin-bottom: 10px;
  line-height: 1.6;
  font-weight: bold; /* Made the text bold */
  border: 1px solid #ddd; /* Optional: added border */
  padding: 10px; /* Added padding for spacing */
  border-radius: 5px; /* Rounded corners */
  background-color: #f0f0f0; /* Light background for highlighting */
`;

const PostStatus = styled.p`
  margin-top: 20px;
  font-size: 1.2rem; /* Increased font size */
  font-weight: bold; /* Made the text bold */
`;

const ButtonsContainer = styled.div`
  margin-top: 20px;
`;

const ActionButton = styled(Button)`
  width: 100px;
  margin-right: 10px;
`;

const ModalContent = styled.div`
  text-align: center;
`;

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
    <PostDetailContainer>
      <Title>Post Detail</Title>
      {!loading && (
        <div>
          <Subtitle>{post?.productName}</Subtitle>
          <PostDetailImage
            src={post?.image}
            alt={post?.productName}
          />
          <PostDetailInfo>Description: {post?.description}</PostDetailInfo>
          <PostDetailInfo>Price: <span style={{ color: "green" }}>{post?.productPrice} VND</span></PostDetailInfo> {/* Highlighting price */}
          <PostDetailInfo>
            Post Date: <span style={{ color: "#007bff" }}>{dayjs(post?.postDate).format("MMMM D, YYYY h:mm A")}</span> {/* Highlighting date */}
          </PostDetailInfo>
          <PostDetailInfo>
            Expiration Date: <span style={{ color: "#007bff" }}>{dayjs(post?.expiredDate).format("MMMM D, YYYY h:mm A")}</span> {/* Highlighting date */}
          </PostDetailInfo>
          <PostStatus>
            Post Status:{" "}
            <Tag color={post.postStatus ? "green" : "red"}>
              {post.postStatus ? "Approved" : "Pending"}
            </Tag>
          </PostStatus>
          <ButtonsContainer>
            <ActionButton
              type="primary"
              danger
              onClick={showModal}
            >
              Remove
            </ActionButton>
          </ButtonsContainer>
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
            onCancel={handleCancel}
          >
            <ModalContent>
              Are you sure you want to remove this post?
            </ModalContent>
          </Modal>
        </div>
      )}
    </PostDetailContainer>
  );
}

export default ApprovedPostDetail;
