import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import dayjs from "dayjs";

function PostDetail() {
  const { id } = useParams();
  const postId = parseInt(id);
  const [form] = useForm();
  const [postDetail, setPostDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPostDetail = async () => {
    setLoading(true);
    try {
      const response = await api.get(`post/view/postdetail/${postId}`);
      setPostDetail(response.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPostDetail();
  }, []);

  return (
    <div>
      <h1>Post Detail</h1>
      {!loading && (
        <div>
          <h2>{postDetail.productName}</h2>
          <img src={postDetail?.image} alt={postDetail.productName} />
          <div>
            <p>Description: {postDetail.description}</p>
            <p>Link: {postDetail.link}</p>
            <p>Price: {postDetail.productPrice}</p>
            <p>Post Date: {dayjs(postDetail.postDate).format("DD MMM YYYY")}</p>
            <p>Post Status: {postDetail.postStatus}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostDetail;
