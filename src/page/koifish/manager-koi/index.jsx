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
  const [koiVariety, setKoiVariety] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const varietyOptions = koiVarieties.map((variety) => ({
    value: variety.varietyName,
    label: variety.varietyName,
  }));

  useEffect(() => {
    const fetchKoiFish = async () => {
      try {
        const response = await api.get("koifish");
        console.log(response.data);
        setKoiFishs(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchVarieties = async () => {
      try {
        const response = await api.get("koivariety");
        setKoiVarieties(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchKoiFish();
    fetchVarieties();
  }, []);

  const filteredKoiFishs = Array.isArray(koiFishs)
    ? koiFishs.filter(
        (koi) =>
          koi.koiName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (koiVariety ? koi.koiVariety === koiVariety : true)
      )
    : [];

  const handleSearch = (value) => {
    setSearchTerm(value);
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
            value={koiVariety}
            onChange={(value) => setKoiVariety(value)}
            style={{ width: "100px" }}
            options={[{ value: null, label: "All" }, ...varietyOptions]}
            defaultValue={null}
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
