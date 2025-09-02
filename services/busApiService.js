import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
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

// Bus API service
export const busApiService = {
  // Get all buses
  getAllBuses: async () => {
    try {
      const response = await api.get('/buses/getall');
      return response.data;
    } catch (error) {
      console.error('Error fetching buses:', error);
      throw error;
    }
  },

  // Get bus by ID
  getBusById: async (busId) => {
    try {
      const response = await api.get(`/buses/get/${busId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bus:', error);
      throw error;
    }
  },

  // Search buses by route and date
  searchBuses: async (origin, destination, date) => {
    try {
      // First get all routes
      const routesResponse = await api.get('/routes/getall');
      const allRoutes = routesResponse.data;
      
      // Filter routes by origin and destination
      const filteredRoutes = allRoutes.filter(route => 
        route.origin.toLowerCase() === origin.toLowerCase() && 
        route.destination.toLowerCase() === destination.toLowerCase()
      );
      
      // Get bus details for each route
      const busesWithRoutes = await Promise.all(
        filteredRoutes.map(async (route) => {
          try {
            const bus = await api.get(`/buses/get/${route.bus.busId}`);
            return {
              ...route,
              bus: bus.data
            };
          } catch (error) {
            console.error('Error fetching bus details:', error);
            return null;
          }
        })
      );
      
      // Filter out null results and return
      return busesWithRoutes.filter(item => item !== null);
    } catch (error) {
      console.error('Error searching buses:', error);
      throw error;
    }
  }
};

// Route API service
export const routeApiService = {
  // Get all routes
  getAllRoutes: async () => {
    try {
      const response = await api.get('/routes/getall');
      return response.data;
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  },

  // Get route by ID
  getRouteById: async (routeId) => {
    try {
      const response = await api.get(`/routes/get/${routeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching route:', error);
      throw error;
    }
  }
};

// Seat API service
export const seatApiService = {
  // Get seats by bus ID
  getSeatsByBusId: async (busId) => {
    try {
      const response = await api.get(`/seats/bus/${busId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seats:', error);
      throw error;
    }
  }
};

export default api;