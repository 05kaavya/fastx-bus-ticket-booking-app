
// src/services/bookingService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/bookings";

// Set token in headers
const authHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// USER services
export const getMyBookings = () => axios.get(`${API_URL}/my`, authHeader());
export const addBooking = (booking) => axios.post(`${API_URL}/add`, booking, authHeader());
export const updateBooking = (booking) => axios.put(`${API_URL}/update`, booking, authHeader());
export const deleteBooking = (id) => axios.delete(`${API_URL}/delete/${id}`, authHeader());

// ADMIN services
export const getAllBookings = () => axios.get(`${API_URL}/getall`, authHeader());
export const getBookingById = (id) => axios.get(`${API_URL}/get/${id}`, authHeader());
