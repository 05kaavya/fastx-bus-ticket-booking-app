//src/services/operatorService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

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
  (error) => Promise.reject(error)
);

const handleError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  const errorMessage = error.response?.data?.message || 
                       error.response?.data?.error || 
                       error.message || 
                       defaultMessage;
  throw new Error(errorMessage);
};

const operatorService = {
  // =========================
  // ✅ Bus Management (Operator)
  // =========================
  getMyBuses: async () => {
    try {
      const response = await api.get('/bus-operators/my-buses');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch operator buses');
    }
  },
  
  addBus: async (busData) => {
    try {
      const response = await api.post('/bus-operators/my-buses/add', busData);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to add bus');
    }
  },
  
  updateBus: async (busData) => {
    try {
      const response = await api.put('/bus-operators/my-buses/update', busData);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to update bus');
    }
  },
  
  deleteBus: async (id) => {
    try {
      const response = await api.delete(`/bus-operators/my-buses/delete/${id}`);
      return response.data;
    } catch (error) {
      handleError(error, `Failed to delete bus ${id}`);
    }
  },

  // =========================
  // ✅ Route Management
  // =========================
  getMyRoutes: async () => {
    try {
      const response = await api.get("/bus-operators/my-routes");
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch operator routes');
    }
  },
  
  addMyRoute: async (routeData) => {
    try {
      const response = await api.post("/bus-operators/my-routes/add", routeData);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to add route');
    }
  },
  
  updateMyRoute: async (routeData) => {
    try {
      const response = await api.put("/bus-operators/my-routes/update", routeData);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to update route');
    }
  },
  
  deleteMyRoute: async (id) => {
    try {
      const response = await api.delete(`/bus-operators/my-routes/delete/${id}`);
      return response.data;
    } catch (error) {
      handleError(error, `Failed to delete route ${id}`);
    }
  },

  getAllRoutes: async () => {
    try {
      const response = await api.get("/routes/getall");
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch all routes');
    }
  },
  
  getRouteById: async (id) => {
    try {
      const response = await api.get(`/routes/get/${id}`);
      return response.data;
    } catch (error) {
      handleError(error, `Failed to fetch route ${id}`);
    }
  },
  
  addRoute: async (routeData) => {
    try {
      const response = await api.post("/routes/add", routeData);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to add route');
    }
  },
  
  updateRoute: async (routeData) => {
    try {
      const response = await api.put("/routes/update", routeData);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to update route');
    }
  },
  
  deleteRoute: async (id) => {
    try {
      const response = await api.delete(`/routes/delete/${id}`);
      return response.data;
    } catch (error) {
      handleError(error, `Failed to delete route ${id}`);
    }
  },

  // =========================
  // ✅ Seats Management
  // =========================
  getSeatsByBusIdAndDate: async (busId, date) => {
    try {
      const formattedDate = new Date(date).toISOString().split('T')[0];
      const response = await api.get(`/seats/bus/${busId}/date/${formattedDate}`);
      return response.data;
    } catch (error) {
      handleError(error, `Failed to fetch seats for bus ${busId} on date ${date}`);
    }
  },

  verifySeatsAvailability: async (busId, date, seatIds) => {
    try {
      const formattedDate = new Date(date).toISOString().split('T')[0];
      const response = await api.post('/seats/verify-availability', {
        busId,
        date: formattedDate,
        seatIds
      });
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to verify seat availability');
    }
  },

  addSeat: async (seatData) => {
    try {
      const response = await api.post('/seats/add', seatData);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to add seat');
    }
  },
  
  updateSeat: async (seatData) => {
    try {
      const response = await api.put('/seats/update', seatData);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to update seat');
    }
  },
  
  deleteSeat: async (id) => {
    try {
      const response = await api.delete(`/seats/delete/${id}`);
      return response.data;
    } catch (error) {
      handleError(error, `Failed to delete seat ${id}`);
    }
  },

  bulkUpdateSeats: async (busId, seats) => {
    try {
      const response = await api.post(`/seats/bus/${busId}/bulk`, seats);
      return response.data;
    } catch (error) {
      handleError(error, `Failed to bulk update seats for bus ${busId}`);
    }
  },
  
  updateSeatStatus: async (seatId, status) => {
    try {
      const response = await api.put(`/seats/${seatId}/status?status=${status}`);
      return response.data;
    } catch (error) {
      handleError(error, `Failed to update seat ${seatId} status`);
    }
  },

  // =========================
  // ✅ Bookings (Operator view)
  // =========================
  getMyBookings: async () => {
    try {
      const response = await api.get('/bus-operators/my-bookings');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch operator bookings');
    }
  },
  
  getMyPassengers: async () => {
    try {
      const response = await api.get('/bus-operators/my-passengers');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch operator passengers');
    }
  },
  
  getBookingById: async (id) => {
    try {
      const response = await api.get(`/bookings/get/${id}`);
      return response.data;
    } catch (error) {
      handleError(error, `Failed to fetch booking ${id}`);
    }
  },

  // =========================
  // ✅ Payments & Refunds
  // =========================
  getAllPayments: async () => {
    try {
      const response = await api.get('/payments/getall');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch payments');
    }
  },
  
  getPaymentById: async (id) => {
    try {
      const response = await api.get(`/payments/get/${id}`);
      return response.data;
    } catch (error) {
      handleError(error, `Failed to fetch payment ${id}`);
    }
  },
  
 


  // =========================
  // ✅ Cancellations
  // =========================
  processCancellation: async (bookingId, cancellationData) => {
    try {
      const response = await api.post(`/cancellations/process/${bookingId}`, cancellationData);
      return response.data;
    } catch (error) {
      handleError(error, `Failed to process cancellation for booking ${bookingId}`);
    }
  },
  
  getCancellationHistory: async () => {
    try {
      const response = await api.get('/cancellations/history');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch cancellation history');
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

  // =========================
  // ✅ Operator Profile
  // =========================
  getOperatorProfile: async () => {
    try {
      const response = await api.get('/bus-operators/me');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch operator profile');
    }
  },
  
  updateOperatorProfile: async (operatorData) => {
    try {
      const response = await api.put('/bus-operators/update', operatorData);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to update operator profile');
    }
  }
};

export default operatorService;



