import { useState } from "react";
import { useQuery } from "react-query";
import api from "../../config/axios";

const useCustomQuery = (method, endpoint, requestData = null) => {
  const [isApiCalled, setIsApiCalled] = useState(false);

  // Chỉ gọi API nếu nó chưa được gọi trước đó
  const fetchData = async () => {
    let axiosConfig = { method, url: endpoint };
    if (requestData) {
      if (method === "GET") {
        axiosConfig.params = requestData;
      } else {
        axiosConfig.data = requestData;
      }
    }
    const response = await api(axiosConfig);
    setIsApiCalled(true); 
    return response.data;
  };


  return useQuery([endpoint, method], fetchData, {
    enabled: !isApiCalled, 
  });
};

export default useCustomQuery;
