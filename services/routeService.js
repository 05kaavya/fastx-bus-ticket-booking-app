// src/services/routeService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/routes";

export const getAllRoutes = () => axios.get(`${API_URL}/getall`);
