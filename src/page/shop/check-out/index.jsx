import React from "react";
import { useNavigate } from "react-router-dom";

function CheckOut() {
  const navigate = useNavigate();

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Successful!</h1>
      <button onClick={() => navigate("/shop")}>Go Back</button>
    </>
  );
}

export default CheckOut;
