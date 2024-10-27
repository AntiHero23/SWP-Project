import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import "./index.scss";
import { Select } from "antd";

function Recommendation() {
  const [data, setData] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await api.get("admin/post/view/approved");
      setData(response.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductType = async () => {
    try {
      const response = await api.get("productType/view");
      console.log(response.data);
      setProductTypes(response.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchProductType();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    const results = data.filter((item) =>
      item.productName.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleSelectChange = (value) => {
    setSelectedProductType(value);
  };

  const filteredData = selectedProductType
    ? data.filter((item) => item.productTypeName === selectedProductType)
    : data;

  return (
    <div className="recommend-page">
      <div className="shop-container">
        <h2 className="shop-title">Recommendation Page</h2>
        <input
          className="search-product"
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search product name"
        />
        <Select
          className="select-product-type"
          value={selectedProductType}
          onChange={handleSelectChange}
          placeholder="Select product type"
        >
          {productTypes?.map((item) => (
            <Select.Option
              key={item.productTypeID}
              value={item.productTypeName}
            >
              {item.productTypeName}
            </Select.Option>
          ))}
        </Select>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="card-container">
            {searchTerm
              ? searchResults.map((item) => (
                  <div className="product-card" key={item.postDetailId}>
                    <li>
                      <h3 className="product-name">{item.productName}</h3>
                      <img
                        className="product-img"
                        src={item.image}
                        width="100px"
                        height="100px"
                      />
                      <p className="product-price">
                        Price: {item.productPrice}
                      </p>
                      <p className="product-desc">
                        Product Type: {item.productTypeName}
                      </p>
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
                ))
              : filteredData.map((item) => (
                  <div className="product-card" key={item.postDetailId}>
                    <li>
                      <h3 className="product-name">{item.productName}</h3>
                      <img
                        className="product-img"
                        src={item.image}
                        width="100px"
                        height="100px"
                      />
                      <p className="product-price">
                        Price: {item.productPrice}
                      </p>
                      <p className="product-desc">
                        Product Type: {item.productTypeName}
                      </p>
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
                ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Recommendation;
