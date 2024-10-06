import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";

function CalculateFood() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ponds, setPonds] = useState([]);
  useEffect(() => {
    const fetchPonds = async () => {
      try {
        const response = await api.get("pond");

        setPonds(response.data.result);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };
    fetchPonds();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>You must login to access this page.</h1>
      <button onClick={() => navigate("/login")}>Login</button>
    </div>
  );
}

export default CalculateFood;
