import { useEffect } from "react";
import useGetParams from "../../../assets/hook/useGetParams";
import api from "../../../config/axios";
import { updateUser } from "../../../redux/features/counterSlice";

function CheckOut() {
  const getParams = useGetParams();
  const id = getParams("orderID");
  console.log(id);
  const dispatch = useDispatch();

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

      // Get updated user data
      const userResponse = await api.get("currentAccount");
      dispatch(updateUser(userResponse.data));
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
      <h1 style={{ textAlign: "center", fontSize: "42px" }}>Successful!</h1>
      <div style={{ textAlign: "center" }}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flat_tick_icon.svg/1024px-Flat_tick_icon.svg.png"
          alt="green tick"
          width="300"
          height="300"
        />
      </div>
      <h3 style={{ textAlign: "center", fontSize: "36px" }}>
        Thank you for using our service!
      </h3>
      {/* <button onClick={() => window.history.back()}>Go Back</button> */}
    </>
  );
}

export default CheckOut;
