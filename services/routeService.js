// src/services/routeService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/routes";

// Get all routes
export const getAllRoutes = () => axios.get(`${API_URL}/getall`);

// Get route by ID
export const getRouteById = (routeId) => axios.get(`${API_URL}/get/${routeId}`);

// Add new route (Admin only)
export const addRoute = (route) => axios.post(`${API_URL}/add`, route);

// Update route (Admin only)
export const updateRoute = (route) => axios.put(`${API_URL}/update`, route);

// Delete route (Admin only)
export const deleteRoute = (routeId) => axios.delete(`${API_URL}/delete/${routeId}`);
