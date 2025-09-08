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
  (error) => {
    return Promise.reject(error);
  }
);

// Admin-specific services
export const adminService = {
  // Bus management
  getAllBuses: () => api.get('/buses/getall'),
  getBusById: (id) => api.get(`/buses/get/${id}`),
  addBus: (busData) => api.post('/buses/add', busData),
  updateBus: (busData) => api.put('/buses/update', busData),
  deleteBus: (id) => api.delete(`/buses/delete/${id}`),

  // Route management
  getAllRoutes: () => api.get('/routes/getall'),
  getRouteById: (id) => api.get(`/routes/get/${id}`),
  addRoute: (routeData) => api.post('/routes/add', routeData),
  deleteRoute: (id) => api.delete(`/routes/delete/${id}`),

  // Booking management
  //getAllBookings: () => api.get('/bookings/getall'),
  getAllBookings: async () => {
    const response = await api.get('/bookings/getall');
    return response.data; // or response.data.data depending on structure
  },

  getBookingById: (id) => api.get(`/bookings/get/${id}`),
  deleteBooking: (id) => api.delete(`/bookings/delete/${id}`),

  // User management
  getAllUsers: () => api.get('/users/getall'),
  getUserById: (id) => api.get(`/users/get/${id}`),
  deleteUser: (id) => api.delete(`/users/delete/${id}`),

  // Operator management
  getAllOperators: () => api.get('/bus-operators/getall'),
  getOperatorById: (id) => api.get(`/bus-operators/get/${id}`),
  addOperator: (operatorData) => api.post('/bus-operators/add', operatorData),
  deleteOperator: (id) => api.delete(`/bus-operators/delete/${id}`),

  // Seat management
  getSeatsByBusId: (busId) => api.get(`/seats/bus/${busId}`),
  addSeat: (seatData) => api.post('/seats/add', seatData),
  updateSeat: (seatData) => api.put('/seats/update', seatData),
  deleteSeat: (id) => api.delete(`/seats/delete/${id}`),
  getSeatsByStatus: (status) => api.get(`/seats/status/${status}`),
  getSeatsByType: (type) => api.get(`/seats/type/${type}`),
};



export default adminService;