import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import "./index.scss";
import { useQuery } from "react-query";

function Recommendation() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: apiData, isLoading } = useQuery("approvedPosts", async () => {
    const response = await api.get("admin/post/view/approved");
    return response.data.result;
  });

  useEffect(() => {
    setData(apiData);
  }, [apiData]);

  return (
    <div className="recommend-page">
      <div className="shop-container">
        <h2 className="shop-title">Recommendation Page</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul className="card-container">
            {data?.map((item) => (
              <>
                <div className="product-card">
                  <li key={item.postDetailId}>
                    <h3 className="product-name">{item.productName}</h3>
                    <img
                      className="product-img"
                      src={item.image}
                      width="100px"
                      height="100px"
                    />
                    <p className="product-price">Price: {item.productPrice}</p>
                    <p>
                      <a className="product-link" href={item.link}>
                        Go to product page
                      </a>
                    </p>
                    <p>
                      <a
                        className="product-link"
                        href={`/productDetail/${item.postDetailId}`}
                      >
                        Go to post detail
                      </a>
                    </p>
                  </li>
                </div>
              </>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Recommendation;
