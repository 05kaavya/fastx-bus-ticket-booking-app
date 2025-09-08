// src/services/bookingServiceEnhanced.js
import axios from "axios";
import { 
  addBooking, 
  updateBooking, 
  deleteBooking, 
  getAllBookings, 
  getBookingById 
} from "./bookingService";

const API_URL = "http://localhost:8080/api/bookings";

// Set token in headers
const authHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Enhanced booking service with additional methods
const bookingServiceEnhanced = {
  // Re-export original functions
  addBooking,
  updateBooking,
  deleteBooking,
  getAllBookings,
  getBookingById,
  
  // New enhanced functions with better error handling
  addBookingWithErrorHandling: async (bookingDto) => {
    try {
      console.log('Sending booking data:', bookingDto); // Debug log
      const response = await addBooking(bookingDto);
      return response.data;
    } catch (error) {
      console.error('Error adding booking:', error);
      console.error('Error response:', error.response?.data); // Added for debugging
      throw new Error(error.response?.data?.message || 'Failed to add booking');
    }
  },
  
  updateBookingWithErrorHandling: async (booking) => {
    try {
      const response = await updateBooking(booking);
      return response.data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw new Error(error.response?.data?.message || 'Failed to update booking');
    }
  },
  
  // Find bookings by user email
  findBookingsByUserEmail: async (email) => {
    try {
      const response = await axios.get(`${API_URL}/user/${email}`, authHeader());
      return response.data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user bookings');
    }
  }
};

export default bookingServiceEnhanced;

// // src/services/bookingServiceEnhanced.js
// import axios from "axios";
// import { 
//   getMyBookings, 
//   addBooking, 
//   updateBooking, 
//   deleteBooking, 
//   getAllBookings, 
//   getBookingById 
// } from "./bookingService";

// const API_URL = "http://localhost:8080/api/bookings";

// // Set token in headers
// const authHeader = () => {
//   const token = localStorage.getItem("token");
//   return { headers: { Authorization: `Bearer ${token}` } };
// };

// // Enhanced booking service with additional methods
// const bookingServiceEnhanced = {
//   // Re-export original functions
//   getMyBookings,
//   addBooking,
//   updateBooking,
//   deleteBooking,
//   getAllBookings,
//   getBookingById,
  
//   // New enhanced functions with better error handling
//   addBookingWithErrorHandling: async (bookingDto) => {
//     try {
//       const response = await addBooking(bookingDto);
//       return response.data;
//     } catch (error) {
//       console.error('Error adding booking:', error);
//       throw new Error(error.response?.data?.message || 'Failed to add booking');
//     }
//   },
  
//   updateBookingWithErrorHandling: async (booking) => {
//     try {
//       const response = await updateBooking(booking);
//       return response.data;
//     } catch (error) {
//       console.error('Error updating booking:', error);
//       throw new Error(error.response?.data?.message || 'Failed to update booking');
//     }
//   },
  
//   // Find bookings by user email
//   findBookingsByUserEmail: async (email) => {
//     try {
//       // This assumes your backend has an endpoint to get bookings by email
//       const response = await axios.get(`${API_URL}/user/${email}`, authHeader());
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching user bookings:', error);
//       throw new Error(error.response?.data?.message || 'Failed to fetch user bookings');
//     }
//   },
  
//   // Get booking by ID with error handling
//   getBookingByIdWithErrorHandling: async (id) => {
//     try {
//       const response = await getBookingById(id);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching booking:', error);
//       throw new Error(error.response?.data?.message || 'Failed to fetch booking');
//     }
//   }
// };

// export default bookingServiceEnhanced;