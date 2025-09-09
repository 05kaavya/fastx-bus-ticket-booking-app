// // src/services/cancellationService.js
// import axios from "axios";

// const API_URL = "http://localhost:8080/api/cancellations";

// // Set token in headers
// const authHeader = () => {
//   const token = localStorage.getItem("token");
//   return { headers: { Authorization: `Bearer ${token}` } };
// };

// // Enhanced error handler
// const handleError = (error, defaultMessage) => {
//   console.error(defaultMessage, error);
//   const errorMessage = error.response?.data?.message || 
//                        error.response?.data?.error || 
//                        error.message || 
//                        defaultMessage;
//   throw new Error(errorMessage);
// };

// // Cancellation services
// export const cancelBooking = async (cancellation) => {
//   try {
//     const response = await axios.post(`${API_URL}/cancel`, cancellation, authHeader());
//     return response.data;
//   } catch (error) {
//     handleError(error, 'Cancellation failed');
//   }
// };

// export const getCancellationByBookingId = async (id) => {
//   try {
//     const response = await axios.get(`${API_URL}/booking/${id}`, authHeader());
//     return response.data;
//   } catch (error) {
//     handleError(error, `Failed to fetch cancellation for booking ${id}`);
//   }
// };

// export const getCancellationsByUserId = async (userId) => {
//   try {
//     const response = await axios.get(`${API_URL}/user/${userId}`, authHeader());
//     return response.data;
//   } catch (error) {
//     handleError(error, `Failed to fetch cancellations for user ${userId}`);
//   }
// };

// export const getCancellationsByStatus = async (status) => {
//   try {
//     const response = await axios.get(`${API_URL}/status/${status}`, authHeader());
//     return response.data;
//   } catch (error) {
//     handleError(error, `Failed to fetch cancellations with status ${status}`);
//   }
// };

// export const isBookingCancelled = async (id) => {
//   try {
//     const response = await axios.get(`${API_URL}/isCancelled/${id}`, authHeader());
//     return response.data;
//   } catch (error) {
//     handleError(error, `Failed to check cancellation status for booking ${id}`);
//   }
// };

// export const getTotalRefundsIssuedByDate = async (date) => {
//   try {
//     const response = await axios.get(`${API_URL}/totalRefunds/${date}`, authHeader());
//     return response.data;
//   } catch (error) {
//     handleError(error, `Failed to fetch total refunds for date ${date}`);
//   }
// };

// // NEW: Get all cancellations (for operators)
// export const getAllCancellations = async () => {
//   try {
//     const response = await axios.get(`${API_URL}`, authHeader());
//     return response.data;
//   } catch (error) {
//     handleError(error, 'Failed to fetch all cancellations');
//   }
// };

// // NEW: Process refund (for operators)
// export const processRefund = async (cancellationId) => {
//   try {
//     const response = await axios.post(`${API_URL}/${cancellationId}/refund`, {}, authHeader());
//     return response.data;
//   } catch (error) {
//     handleError(error, `Failed to process refund for cancellation ${cancellationId}`);
//   }
// };

// // NEW: Update refund status
// export const updateRefundStatus = async (cancellationId, status) => {
//   try {
//     const response = await axios.put(`${API_URL}/${cancellationId}/status`, 
//       { status }, 
//       authHeader()
//     );
//     return response.data;
//   } catch (error) {
//     handleError(error, `Failed to update refund status for cancellation ${cancellationId}`);
//   }
// };

// // Service object with all methods
// const cancellationService = {
//   cancelBooking,
//   getCancellationByBookingId,
//   getCancellationsByUserId,
//   getCancellationsByStatus,
//   isBookingCancelled,
//   getTotalRefundsIssuedByDate,
//   getAllCancellations,
//   processRefund,
//   updateRefundStatus
// };

// export default cancellationService;




import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const handleError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  const errorMessage = error.response?.data?.message || 
                       error.response?.data?.error || 
                       error.message || 
                       defaultMessage;
  throw new Error(errorMessage);
};

export const cancellationService = {
  cancelBooking: async (cancellationData) => {
    try {
      const response = await api.post("/cancellations/cancel", cancellationData);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to cancel booking');
    }
  },

  getAllCancellations: async () => {
    try {
      const response = await api.get("/cancellations");
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch all cancellations');
    }
  },

  processRefund: async (cancellationId) => {
    try {
      const response = await api.post(`/cancellations/${cancellationId}/refund`);
      return response.data;
    } catch (error) {
      handleError(error, `Failed to process refund for cancellation ${cancellationId}`);
    }
  },

  getCancellationByBookingId: async (bookingId) => {
    try {
      const response = await api.get(`/cancellations/booking/${bookingId}`);
      return response.data;
    } catch (error) {
      handleError(error, `Failed to fetch cancellation for booking ${bookingId}`);
    }
  },

  getCancellationsByStatus: async (status) => {
    try {
      const response = await api.get(`/cancellations/status/${status}`);
      return response.data;
    } catch (error) {
      handleError(error, `Failed to fetch cancellations with status ${status}`);
    }
  },

  updateRefundStatus: async (cancellationId, status) => {
    try {
      const response = await api.put(`/cancellations/${cancellationId}/status`, { status });
      return response.data;
    } catch (error) {
      handleError(error, `Failed to update refund status for cancellation ${cancellationId}`);
    }
  }
};

export default cancellationService;


// // src/services/cancellationService.js
// import axios from "axios";

// const API_URL = "http://localhost:8080/api/cancellations";

// // Set token in headers
// const authHeader = () => {
//   const token = localStorage.getItem("token");
//   return { headers: { Authorization: `Bearer ${token}` } };
// };

// // Cancellation services
// export const cancelBooking = (cancellation) => axios.post(`${API_URL}/cancel`, cancellation, authHeader());
// export const getCancellationByBookingId = (id) => axios.get(`${API_URL}/booking/${id}`, authHeader());
// export const getCancellationsByUserId = (userId) => axios.get(`${API_URL}/user/${userId}`, authHeader());
// export const getCancellationsByStatus = (status) => axios.get(`${API_URL}/status/${status}`, authHeader());
// export const isBookingCancelled = (id) => axios.get(`${API_URL}/isCancelled/${id}`, authHeader());
// export const getTotalRefundsIssuedByDate = (date) => axios.get(`${API_URL}/totalRefunds/${date}`, authHeader());