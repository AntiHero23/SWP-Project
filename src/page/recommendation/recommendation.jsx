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
    <div>
      <h1>Recommendation</h1>
      <h2>Shopping Page</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data?.map((item) => (
            <li key={item.postDetailId}>
              <h3>{item.productName}</h3>
              <img src={item.image} width="100px" height="100px" />
              <p>Price: {item.productPrice}</p>
              <p>Description: {item.description}</p>
              <p>
                <a href={item.link}>Go to product page</a>
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
