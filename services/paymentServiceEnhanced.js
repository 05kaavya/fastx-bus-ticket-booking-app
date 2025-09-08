
// src/services/paymentServiceEnhanced.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/payments";

// Function to get auth header
const authHeader = () => {
  const token = localStorage.getItem("token"); // JWT token saved on login
  return { headers: { Authorization: `Bearer ${token}` } };
};

const paymentServiceEnhanced = {
  // Unified booking + payment
  processPaymentWithErrorHandling: async (bookingPaymentDto) => {
    try {
      const response = await axios.post(
        `${API_URL}/process`,
        bookingPaymentDto,
        authHeader()
      );
      return response.data;
    } catch (error) {
      console.error("Error processing payment:", error);
      throw new Error(
        error.response?.data?.message || "Payment processing failed"
      );
    }
  },

  getPaymentByBookingId: async (bookingId) => {
    try {
      const res = await axios.get(`${API_URL}/booking/${bookingId}`, authHeader());
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch payment by bookingId");
    }
  },

  getPaymentsByUserId: async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/user/${userId}`, authHeader());
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch payments by userId");
    }
  },

  getPaymentsByPaymentStatus: async (status) => {
    try {
      const res = await axios.get(`${API_URL}/status/${status}`, authHeader());
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch payments by status");
    }
  },

  getTotalRevenueByDate: async (date) => {
    try {
      const res = await axios.get(`${API_URL}/totalRevenue/${date}`, authHeader());
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch revenue");
    }
  },

  isPaymentSuccessfulForBooking: async (bookingId) => {
    try {
      const res = await axios.get(`${API_URL}/isSuccessful/${bookingId}`, authHeader());
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to check payment success");
    }
  }
};

export default paymentServiceEnhanced;



// // src/services/paymentServiceEnhanced.js
// import api from "./api"; // your axios instance with interceptor

// const paymentServiceEnhanced = {
//   // Unified payment+booking creation
//   processPaymentWithErrorHandling: async (paymentDto) => {
//     try {
//       // Backend should return { booking, payment }
//       const response = await api.post("/api/payments/process", paymentDto);
//       return response.data;
//     } catch (error) {
//       console.error("Error processing payment:", error);
//       throw new Error(error.response?.data?.message || "Payment processing failed");
//     }
//   },

//   // Optional re-exports if you still want them
//   getPaymentByBookingId: async (bookingId) => {
//     try {
//       const res = await api.get(`/payments/booking/${bookingId}`);
//       return res.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || "Failed to fetch payment by bookingId");
//     }
//   },

//   getPaymentsByUserId: async (userId) => {
//     try {
//       const res = await api.get(`/payments/user/${userId}`);
//       return res.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || "Failed to fetch payments by userId");
//     }
//   },

//   getPaymentsByPaymentStatus: async (status) => {
//     try {
//       const res = await api.get(`/payments/status/${status}`);
//       return res.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || "Failed to fetch payments by status");
//     }
//   },

//   getTotalRevenueByDate: async (date) => {
//     try {
//       const res = await api.get(`/payments/totalRevenue/${date}`);
//       return res.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || "Failed to fetch revenue");
//     }
//   },

//   isPaymentSuccessfulForBooking: async (bookingId) => {
//     try {
//       const res = await api.get(`/payments/isSuccessful/${bookingId}`);
//       return res.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || "Failed to check payment success");
//     }
//   },
// };

// export default paymentServiceEnhanced;


// // src/services/paymentServiceEnhanced.js
// import { 
//   processPayment, 
//   getPaymentByBookingId, 
//   getPaymentsByUserId, 
//   getPaymentsByPaymentStatus, 
//   getTotalRevenueByDate, 
//   isPaymentSuccessfulForBooking 
// } from "./paymentService";

// // Enhanced payment service with additional methods
// const paymentServiceEnhanced = {
//   // Re-export original functions
//   processPayment,
//   getPaymentByBookingId,
//   getPaymentsByUserId,
//   getPaymentsByPaymentStatus,
//   getTotalRevenueByDate,
//   isPaymentSuccessfulForBooking,
  
//   // New enhanced functions with better error handling
//   processPaymentWithErrorHandling: async (paymentDto) => {
//     try {
//       const response = await processPayment(paymentDto);
//       return response.data;
//     } catch (error) {
//       console.error('Error processing payment:', error);
//       throw new Error(error.response?.data?.message || 'Payment processing failed');
//     }
//   },
  
//   // Add other enhanced methods as needed
// };

// export default paymentServiceEnhanced;