import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { PlusCircleOutlined } from "@ant-design/icons";
import KoiCard from "../../../component/koi-card";
import { Button } from "antd";

function ManagerKoi() {
  const [koiFish, setKoiFish] = useState([]);
  const [filteredKoiFish, setFilteredKoiFish] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVariety, setSelectedVariety] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKoiFish = async () => {
      try {
        const response = await api.get("koifish");
        if (!response.data || !response.data.result) {
          alert("You must be logged in to view this page.");
          navigate("/login"); // Redirect to login page
          return;
        }
        setKoiFish(Array.isArray(response.data.result) ? response.data.result : []);
        setFilteredKoiFish(response.data.result);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        alert("You must be logged in to view this page.");
        navigate("/login"); // Redirect to login page
        setIsLoading(false);
      }
    };
    fetchKoiFish();
  }, [navigate]);

  useEffect(() => {
    const filtered = koiFish.filter((koi) =>
      koi.koiName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedVariety) {
      setFilteredKoiFish(
        filtered.filter((koi) => koi.koiVarietyID === selectedVariety)
      );
    } else {
      setFilteredKoiFish(filtered);
    }
  }, [searchTerm, selectedVariety, koiFish]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="ManagerKoi-container">
      <h1 style={{ textAlign: "center" }}>Manager Koi Fish</h1>
      <div className="filter-search">
        <input
          type="text"
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name..."
          className="search-input"
        />
        <select
          value={selectedVariety}
          onChange={(e) => setSelectedVariety(e.target.value)}
          className="filter-select"
        >
          <option value="">All Varieties</option>
          <option value="Kohaku">Kohaku</option>
          <option value="Sanke">Sanke</option>
          <option value="Showa">Showa</option>
        </select>
        <PlusCircleOutlined
          style={{ fontSize: "24px" }}
          onClick={() => navigate("/addKoi")}
        />
      </div>

      {filteredKoiFish.length === 0 ? (
        <p style={{ textAlign: "center" }}>You have no koi fish, Please add one</p>
      ) : (
        <div className="koi-fish-dashboard">
          {filteredKoiFish.map((koi) => (
            <KoiCard key={koi.koiFishID} koi={koi} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ManagerKoi;
