import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/axios";
import dayjs from "dayjs";
import { Tag } from "antd";
import "./index.scss";

function ProductDetail() {
  const { id } = useParams();
  const postID = Number(id);
  console.log(postID);
  const [postDetail, setPostDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPostDetail = async () => {
    setLoading(true);
    try {
      const response = await api.get(`post/view/postdetail/${postID}`);
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <div className="product-detail">
      {/* <h1 style={{ textAlign: "center" }}>Product Detail</h1> */}

      {!loading && postDetail && (
        <div className="product-info">
          <div className="product-info-header">
            <h2 className="product-name">{postDetail.productName}</h2>
            <img
              src={postDetail.image}
              alt={postDetail.productName}
              className="product-image"
            />
          </div>
          <div className="product-info-body">
            <p className="product-desc">
              {postDetail.description.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
            <p className="product-price">
              Price: {formatPrice(postDetail.productPrice)} VND
            </p>
            <a href={postDetail.link} className="product-link">
              Product Link
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
