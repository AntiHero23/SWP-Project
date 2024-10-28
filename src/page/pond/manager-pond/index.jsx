import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { PlusCircleOutlined } from "@ant-design/icons";
import PondCard from "../../../component/pond-card";
import { Button } from "antd";
import "./index.scss";

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
        console.log(pondsResponse.data);
        setPonds(pondsResponse.data);
      } catch (error) {
        console.error(error);
        setError(error);
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
    return <div>{error.message}</div>;
  }

  return (
    <div className="ManagerPond-container">
      <div className="pond-card-container">
        <h1>Pond Management</h1>

        <div className="search-container">
          <input
            type="text"
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name..."
            className="search-input"
          />
          <PlusCircleOutlined
            className="add-button"
            onClick={() => navigate("/addPond")}
          />
        </div>

        {filteredPonds.length === 0 ? (
          <p className="no-ponds-message">You have no ponds. Please add one.</p>
        ) : (
          <div className="pond-grid">
            {filteredPonds.map((pond) => (
              <PondCard key={pond.pondID} pond={pond} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerPond;
