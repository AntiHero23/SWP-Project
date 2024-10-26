import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import dayjs from "dayjs";
import { Tag } from "antd";

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
      <p>
        ______________________________________________________________________________________________________________________________________________________________________________________________________________________
      </p>
      <br />
      {!loading && (
        <div>
          <h2>{postDetail.productName}</h2>
          <img
            src={postDetail?.image}
            alt={postDetail.productName}
            style={{ width: "100px" }}
          />
          <p>
            ______________________________________________________________________________________________________________________________________________________________________________________________________________________
          </p>
          <br />
          <b>Product Type: </b>
          {postDetail.productTypeName}
          <p>
            ______________________________________________________________________________________________________________________________________________________________________________________________________________________
          </p>
          <br />
          <b>Description: </b>
          <p>{postDetail.description}</p>
          <p>
            ______________________________________________________________________________________________________________________________________________________________________________________________________________________
          </p>
          <br />
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
          <p>
            ______________________________________________________________________________________________________________________________________________________________________________________________________________________
          </p>
          <br />
          <b>Price: </b>
          {VND.format(postDetail.productPrice)}
          <p>
            ______________________________________________________________________________________________________________________________________________________________________________________________________________________
          </p>
          <br />
          <b>Post Date: </b>
          {dayjs(postDetail.postDate).format("MMMM D, YYYY h:mm A")}
          <p>
            ______________________________________________________________________________________________________________________________________________________________________________________________________________________
          </p>
          <br />
          <b>Expiration Date: </b>
          {dayjs(postDetail.expiredDate).format("MMMM D, YYYY h:mm A")}
          <p>
            ______________________________________________________________________________________________________________________________________________________________________________________________________________________
          </p>
          <br />
          <b>Post Status: </b>
          <Tag color={postDetail.postStatus ? "green" : "red"}>
            {postDetail.postStatus ? "Approve" : "Pending"}
          </Tag>
          <p>
            ______________________________________________________________________________________________________________________________________________________________________________________________________________________
          </p>
        </div>
      )}
    </div>
  );
}

export default PostDetail;
