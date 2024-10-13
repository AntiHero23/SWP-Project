import { useSelector } from "react-redux";
import api from "../../../config/axios";
import { useEffect, useState } from "react";

const KoiFoodList = () => {
  const state = useSelector((state) => state.calculateFood);
  const { foodList = [] } = state;
  const [koiList, setKoiList] = useState([]);

  useEffect(() => {
    if (foodList.length === 0) return;
    const getData = async () => {
      const response = await api.post("/api/koifood/koilist", {
        temperature: foodList[0].temperature,
        level: foodList[0].level,
        pondID: foodList[0].pondID,
      });
      setKoiList(response.data.result);
    };
    getData();
  }, [foodList]);

  return (
    <div>
      <h1>Calculate Food List</h1>
      {koiList.length > 0 ? (
        <ul>
          {koiList.map((item) => (
            <li key={item.koiFishID}>
              {item.koiName} - {item.food}g
            </li>
          ))}
        </ul>
      ) : (
        <p>No data</p>
      )}
    </div>
  );
};

export default KoiFoodList;
