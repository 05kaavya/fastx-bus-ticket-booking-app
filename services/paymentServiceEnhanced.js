// src/services/paymentServiceEnhanced.js
import axios from "axios";
import { 
  processPayment, 
  getPaymentByBookingId, 
  getPaymentsByUserId, 
  getPaymentsByPaymentStatus, 
  getTotalRevenueByDate, 
  isPaymentSuccessfulForBooking 
} from "./paymentService";

const API_URL = "http://localhost:8080/api/payments";

// Set token in headers
const authHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Enhanced payment service with additional methods
const paymentServiceEnhanced = {
  // Re-export original functions
  processPayment,
  getPaymentByBookingId,
  getPaymentsByUserId,
  getPaymentsByPaymentStatus,
  getTotalRevenueByDate,
  isPaymentSuccessfulForBooking,
  
  // New enhanced functions with better error handling
  processPaymentWithErrorHandling: async (paymentDto) => {
    try {
      const response = await processPayment(paymentDto);
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw new Error(error.response?.data?.message || 'Payment processing failed');
    }
  },
  
  // Add other enhanced methods as needed
};

export default paymentServiceEnhanced;