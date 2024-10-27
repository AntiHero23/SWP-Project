import "./index.scss";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { PlusCircleOutlined } from "@ant-design/icons";
import KoiCard from "../../../component/koi-card";
import { Select } from "antd";

function ManagerKoi() {
  const [koiFishs, setKoiFishs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [koiVarieties, setKoiVarieties] = useState([]);
  const [selectedKoiVariety, setSelectedKoiVariety] = useState("");
  const [ponds, setPonds] = useState([]);
  const [selectedPond, setSelectedPond] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const varietyOptions = koiVarieties.map((variety) => ({
    value: variety.varietyName,
    label: variety.varietyName,
  }));

  const pondOptions = ponds.map((pond) => ({
    value: pond.pondID,
    label: pond.pondName,
  }));
  const fetchKoiFish = async () => {
    try {
      const response = await api.get("koifish");
      setKoiFishs(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchVarieties = async () => {
    try {
      const response = await api.get("koivariety");
      setKoiVarieties(response.data || []);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchPond = async () => {
    try {
      const response = await api.get("pond");
      setPonds(response.data || []);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchKoiFish();
    fetchVarieties();
    fetchPond();
  }, []);

  const filteredKoiFishs = Array.isArray(koiFishs)
    ? koiFishs.filter(
        (koi) =>
          koi.koiName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedKoiVariety ? koi.koiVariety === selectedKoiVariety : true) &&
          (selectedPond ? koi.pondID === selectedPond : true)
      )
    : [];

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleSelectVariety = (value) => {
    setSelectedKoiVariety(value);
  };

  const handleSelectPond = (value) => {
    setSelectedPond(value);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="manager-koi">
      <div className="ManagerKoi-container">
        <h1 style={{ textAlign: "center" }}>Manage Koi Fish</h1>
        <div className="filter-search">
          <input
            type="text"
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name..."
            className="search-input"
          />
          <Select
            value={selectedKoiVariety}
            onChange={handleSelectVariety}
            style={{ width: "100px" }}
            options={[{ value: "", label: "All Variety " }, ...varietyOptions]}
            placeholder="Variety"
          ></Select>

          <Select
            value={selectedPond}
            onChange={handleSelectPond}
            style={{ width: "100px", marginLeft: "10px" }}
            options={[{ value: "", label: "All Pond" }, ...pondOptions]}
            placeholder="Pond"
          ></Select>
          <PlusCircleOutlined
            style={{ fontSize: "24px" }}
            onClick={() => navigate("/addKoi")}
          />
        </div>

        <div className="koi-fish-dashboard">
          {filteredKoiFishs.length > 0 ? (
            filteredKoiFishs.map((koi) => (
              <div key={koi.koiFishID} style={{ display: "flex" }}>
                <KoiCard koi={koi} />
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>You don't have any fish</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManagerKoi;
