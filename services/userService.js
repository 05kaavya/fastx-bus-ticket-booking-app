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

export const userService = {
  getUserBookings: async () => {
    try {
      const response = await api.get('/bookings/my');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch user bookings');
    }
  },

  cancelBooking: async (cancellationData) => {
    try {
      const response = await api.post('/cancellations/cancel', cancellationData);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to cancel booking');
    }
  },

  // User profile management
  getUserProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch user profile');
    }
  },

  updateUserProfile: async (userData) => {
    try {
      const response = await api.put('/users/update', userData);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to update user profile');
    }
  }
};


// import axios from "axios";

// const API_URL = "http://localhost:8080/api/users";

// // Get all users
// export const getAllUsers = () => axios.get(`${API_URL}/getall`);

// // Get user by ID
// export const getUserById = (userId) => axios.get(`${API_URL}/get/${userId}`);

// // Add user (register)
// export const addUser = (user) => axios.post(`${API_URL}/register`, user);

// // Update user
// export const updateUser = (user) => axios.put(`${API_URL}/update`, user);

// // Delete user
// export const deleteUser = (userId) => axios.delete(`${API_URL}/delete/${userId}`);


// const handleError = (error, defaultMessage) => {
//   console.error(defaultMessage, error);
//   const errorMessage = error.response?.data?.message || 
//                        error.response?.data?.error || 
//                        error.message || 
//                        defaultMessage;
//   throw new Error(errorMessage);
// };

// export const userService = {
//   getUserBookings: async () => {
//     try {
//       const response = await axios.get("/api/bookings/user");
//       return response.data;
//     } catch (error) {
//       handleError(error, 'Failed to fetch user bookings');
//     }
//   },

//   cancelBooking: async (cancellationData) => {
//     try {
//       const response = await axios.post("/api/cancellations/cancel", cancellationData);
//       return response.data;
//     } catch (error) {
//       handleError(error, 'Failed to cancel booking');
//     }
//   }
// };
