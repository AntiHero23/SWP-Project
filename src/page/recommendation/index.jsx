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
      const formattedTypes = response.data.map((type) => ({
        value: type.productTypeName,
        label: type.productTypeName,
      }));
      setProductTypes(formattedTypes);
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat().format(price);
  };

  return (
    <div className="recommend-page">
      <div className="shop-container">
        <h2 className="shop-title">Recommendation Page</h2>
        <div className="search-bar-container">
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
            options={[
              { value: "", label: "All Product Type" },
              ...productTypes,
            ]}
            placeholder="Select product type"
          />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="card-container">
            {searchTerm
              ? searchResults.map((item) => (
                  <div className="product-card" key={item.postDetailId}>
                    <h3 className="product-name">{item.productName}</h3>
                    <img
                      className="product-img"
                      src={item.image}
                      width="100px"
                      height="100px"
                      alt={item.productName}
                    />
                    <p className="product-price">Price: {item.productPrice}</p>
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
                  </div>
                ))
              : filteredData.map((item) => (
                  <div className="product-card" key={item.postDetailId}>
                    <h3 className="product-name">{item.productName}</h3>
                    <img
                      className="product-img"
                      src={item.image}
                      width="100px"
                      height="100px"
                      alt={item.productName}
                    />
                    <p className="product-price">
                      Price: {formatPrice(item.productPrice)} vnđ
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
                  </div>
                ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Recommendation;
