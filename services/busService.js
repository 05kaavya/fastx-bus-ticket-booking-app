// src/services/busService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/buses";

export const getAllBuses = async () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_URL}/getall`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
