import axios from "axios";

export const useApi = () => {
  const baseURL = "https://reevent-sa.com/api/";

  const headers = {
    "x-api-key": "5f43766dcd92b8c3e7639d2a8791063c",
  };

  if(process.client){
    headers.lang = localStorage.getItem("locale") || "ar";
  }

  return axios.create({
    baseURL,
    headers,
  });
};