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
import { Button } from "antd";

function ManagerPond() {
  const [ponds, setPonds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching ponds from an API by setting test data
    //setPonds(testPonds);

     
    // Uncomment the following lines to use the real API:
    const fetchPonds = async () => {
    const checkLoginAndFetchPonds = async () => {
      setIsLoading(true);
      try {
        const loginResponse = await api.get("currentAccount");
        if (!loginResponse.data || !loginResponse.data.isLoggedIn) {
          alert("You must be logged in to view this page.");
          navigate("/login");
          return;
        }
        const pondsResponse = await api.get("pond");
        setPonds(
          Array.isArray(pondsResponse.data.result)
            ? pondsResponse.data.result
            : []
        );
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
    fetchPonds();
 
  }, []);
    checkLoginAndFetchPonds();
  }, [navigate]);

  const handleDeletePond = async (pondID) => {
    try {
      const pond = ponds.find((pond) => pond.pondID === pondID);
      if (pond.amountFish > 0) {
        alert(`This pond has ${pond.amountFish} fish. You cannot delete it.`);
        return;
      }
      await api.delete(`pond/${pondID}`);
      setPonds(ponds.filter((pond) => pond.pondID !== pondID));
    } catch (error) {
      console.error(error);
      setError("Failed to delete pond. Please try again.");
    }
  };

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
        <p style={{ textAlign: "center" }}>
          You have no ponds. Please add one.
        </p>
      ) : (
        <div className="pond-dashboard">
          {filteredPonds.map((pond) => (
            <div
              key={pond.pondID}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <PondCard pond={pond} />
              <Button onClick={() => handleDeletePond(pond.pondID)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManagerPond;
