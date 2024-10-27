import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import dayjs from "dayjs";
import { Card, Tag } from "antd";

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
  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Post Detail</h1>
      <br />
      {!loading && (
        <Card style={{ background: "#6495ed" }}>
          <Card>
            <h2>{postDetail.productName}</h2>
            <img
              src={postDetail?.image}
              alt={postDetail.productName}
              style={{ width: "100px" }}
            />
          </Card>
          <Card>
            <b>Product Type: </b>
            {postDetail.productTypeName}
          </Card>
          <Card>
            <b>Description: </b>
            <p>{postDetail.description}</p>
          </Card>
          <Card>
            <b>Link: </b>
            <a
              href={postDetail.link}
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {postDetail.link}
            </a>
          </Card>
          <Card>
            <b>Price: </b>
            {VND.format(postDetail.productPrice)}
          </Card>
          <Card>
            <b>Post Date: </b>
            {dayjs(postDetail.postDate).format("MMMM D, YYYY h:mm A")}
          </Card>
          <Card>
            <b>Expiration Date: </b>
            {dayjs(postDetail.expiredDate).format("MMMM D, YYYY h:mm A")}
          </Card>
          <Card>
            <b>Post Status: </b>
            <Tag color={postDetail.postStatus ? "green" : "red"}>
              {postDetail.postStatus ? "Approve" : "Pending"}
            </Tag>
          </Card>
        </Card>
      )}
    </div>
  );
}

export default PostDetail;
