// src/services/paymentService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/payments";

// Set token in headers
const authHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Payment services
export const processPayment = (payment) => axios.post(`${API_URL}/process`, payment, authHeader());
export const getPaymentByBookingId = (id) => axios.get(`${API_URL}/booking/${id}`, authHeader());
export const getPaymentsByUserId = (userId) => axios.get(`${API_URL}/user/${userId}`, authHeader());
export const getPaymentsByPaymentStatus = (status) => axios.get(`${API_URL}/status/${status}`, authHeader());
export const getTotalRevenueByDate = (date) => axios.get(`${API_URL}/totalRevenue/${date}`, authHeader());
export const isPaymentSuccessfulForBooking = (id) => axios.get(`${API_URL}/isSuccessful/${id}`, authHeader());