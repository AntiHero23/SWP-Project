import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { PlusCircleOutlined } from "@ant-design/icons";
import PondCard from "../../../component/pond-card";
import { Button } from "antd";

function ManagerPond() {
  const [ponds, setPonds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginAndFetchPonds = async () => {
      setIsLoading(true);
      try {
        const pondsResponse = await api.get("pond");
        setPonds(pondsResponse.data);
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 401) {
          alert("You must be logged in to view this page.");
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkLoginAndFetchPonds();
  }, [navigate]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const filteredPonds = Array.isArray(ponds)
    ? ponds.filter((pond) =>
        pond.pondName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="ManagerPond-container">
      <h1 style={{ textAlign: "center" }}>Manager Pond</h1>
      <div
        className="filter-search"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <input
          type="text"
          style={{ width: "20%" }}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name..."
          className="search-input"
        />
        <PlusCircleOutlined
          style={{ fontSize: "24px" }}
          onClick={() => navigate("/addPond")}
        />
      </div>

      {filteredPonds.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          You have no ponds. Please add one.
        </p>
      ) : (
        <div className="pond-dashboard">
          {filteredPonds.map((pond) => (
            <div
              key={pond.pondID}
              style={{
                display: "flex",
                justifyContent: "space-between",
              
              }}
            >
              <PondCard pond={pond} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManagerPond;
