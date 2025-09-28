import axios from "axios";

export const useApi = () => {
  const baseURL = "https://dashboard.amyalcar.com/api/";

  if(process.client){
    axios.defaults.headers.lang = localStorage.getItem("locale") || "ar";
  }

  return axios.create({
    baseURL,
  });
};