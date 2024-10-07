import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { PlusCircleOutlined } from "@ant-design/icons";
import KoiCard from "../../../component/koi-card";

function ManagerKoi() {
  const [koiFishs, setKoiFishs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVariety, setSelectedVariety] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKoiFish = async () => {
      try {
        const response = await api.get("koifish");
        setKoiFishs(response.data);
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 400) {
          alert("You must be logged in to view this page.");
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchKoiFish();
  }, [navigate]);

  const filteredKoiFishs = Array.isArray(koiFishs)
    ? koiFishs.filter((koi) =>
        koi.koiName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedVariety ? koi.koiVarietyID === selectedVariety : true)
      )
    : [];

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleVarietyChange = (value) => {
    setSelectedVariety(value);
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
          onChange={(e) => handleVarietyChange(e.target.value)}
          className="filter-select"
        >
          <option value="">All Varieties</option>
          <option value="1">Kohaku</option>
          <option value="2">Golden</option>
        </select>
        <PlusCircleOutlined
          style={{ fontSize: "24px" }}
          onClick={() => navigate("/addKoi")}
        />
      </div>

      <div className="koi-fish-dashboard">
        {filteredKoiFishs.map((koi) => (
          <div key={koi.koiFishID} style={{ display: "flex" }}>
            <KoiCard koi={koi} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManagerKoi;
