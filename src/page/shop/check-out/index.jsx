import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGetParams from "../../../assets/hook/useGetParams";
import api from "../../../config/axios";

function CheckOut() {
  const navigate = useNavigate();
  const getParams = useGetParams();
  const id = getParams("orderID");
  console.log(id);
  async function handleTransaction() {
    try {
      const response = await api.post(
        "order/transactions",
        {},
        {
          params: {
            orderID: id,
          },
        }
      );
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    handleTransaction();
  }),
    [id];

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Successful!</h1>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </>
  );
}

export default CheckOut;
