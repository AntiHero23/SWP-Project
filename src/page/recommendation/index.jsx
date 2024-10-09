import React, { useEffect, useState } from "react";
import api from "../../config/axios";

function Recommendation() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get("admin/post/view/approved");
      console.log(response.data);
      setData(response.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="recommend-page">
      <h1>Recommendation</h1>
      <div className="shop-container"></div>
      <h2 className="shop-title">Shopping Page</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="product-card">
          {data?.map((item) => (
            <li key={item.postDetailId}>
              <h3 className="product-name">{item.productName}</h3>
              <img className="product-img" src={item.image} width="100px" height="100px" />
              <p className="product-price">Price: {item.productPrice}</p>
              <p className="product-desc">Description: {item.description}</p>
              <p>
                <a className="product-link" href={item.link}>Go to product page</a>
              </p>
              <p>Product Type ID: {item.productTypeID}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Recommendation;
