import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { PlusCircleOutlined } from "@ant-design/icons";
import PondCard from "../../../component/pond-card";
import "./index.scss";

/* Test Data to simulate API response
const testPonds = [
  {
    id: 1,
    pondName: "Sunshine Pond",
    pondImage: "../../../LoginBg.png",
    area: 150,
    depth: 3,
    volume: 450,
    drainCount: 2,
    skimmerCount: 3,
    amountFish: 25,
    pumpingCapacity: 500,
  },
  {
    id: 2,
    pondName: "Blue Lagoon",
    area: 200,
    depth: 2.5,
    volume: 500,
    drainCount: 1,
    skimmerCount: 2,
    amountFish: 40,
    pumpingCapacity: 750,
  },
  {
    id: 3,
    pondName: "Emerald Waters",
    area: 100,
    depth: 3.2,
    volume: 320,
    drainCount: 3,
    skimmerCount: 4,
    amountFish: 15,
    pumpingCapacity: 300,
  },
];
*/

function ManagerPond() {
  const [ponds, setPonds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching ponds from an API by setting test data
    //setPonds(testPonds);

     
    // Uncomment the following lines to use the real API:
    const fetchPonds = async () => {
      try {
        const response = await api.get("pond");
        setPonds(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPonds();
    
  }, []);

  const filteredPonds = ponds.filter((pond) =>
    pond.pondName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  return (
    <div className="ManagerPond-container">
      <h1 style={{ textAlign: "center" }}>Manager Pond</h1>
      <div className="filter-search">
        <input
          type="text"
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
        <p style={{ textAlign: "center" }}>You have no pond, Please add one</p>
      ) : (
        <div className="pond-dashboard">
          {filteredPonds.map((pond) => (
            <PondCard key={pond.id} pond={pond} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ManagerPond;
