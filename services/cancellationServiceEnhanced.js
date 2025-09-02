// src/services/cancellationServiceEnhanced.js
import axios from "axios";
import { 
  cancelBooking, 
  getCancellationByBookingId, 
  getCancellationsByUserId, 
  getCancellationsByStatus, 
  isBookingCancelled, 
  getTotalRefundsIssuedByDate 
} from "./cancellationService";

const API_URL = "http://localhost:8080/api/cancellations";

// Set token in headers
const authHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Enhanced cancellation service with additional methods
const cancellationServiceEnhanced = {
  // Re-export original functions
  cancelBooking,
  getCancellationByBookingId,
  getCancellationsByUserId,
  getCancellationsByStatus,
  isBookingCancelled,
  getTotalRefundsIssuedByDate,
  
  // New enhanced functions with better error handling
  cancelBookingWithErrorHandling: async (cancellationDto) => {
    try {
      const response = await cancelBooking(cancellationDto);
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw new Error(error.response?.data?.message || 'Cancellation failed');
    }
  },
  
  // Add other enhanced methods as needed
};

export default cancellationServiceEnhanced;