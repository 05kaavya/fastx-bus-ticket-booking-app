// src/services/authService.js
import API from "./api";

// Named exports
export const loginUser = (data) => API.post("/auth/login", data);
export const loginAdmin = (data) => API.post("/auth/admin/login", data);
export const registerUser = (data) => API.post("/api/users/register", data);
export const registerAdmin = (data) => API.post("/api/admins/register", data);

export const loginBusOperator = async (credentials) => {
  try {
    const response = await API.post('/auth/operator/login', credentials);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get current user from JWT token
export const getCurrentUser = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    // Decode JWT token payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    return {
      userId: payload.userId || payload.id,
      username: payload.sub,
      email: payload.email,
      role: payload.role,
      operatorId: payload.operatorId,
      firstName: payload.firstName,
      lastName: payload.lastName
    };
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

// Check if user has specific role
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user && user.role === role;
};

// Check if user is operator
export const isOperator = () => {
  return hasRole('OPERATOR');
};

// Get operator ID (returns null if not operator)
export const getOperatorId = () => {
  const user = getCurrentUser();
  return user && user.role === 'OPERATOR' ? user.operatorId : null;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Default export with all functions
const authService = {
  loginUser,
  loginAdmin,
  registerUser,
  registerAdmin,
  loginBusOperator,
  getCurrentUser,
  hasRole,
  isOperator,
  getOperatorId,
  logout
};

export default authService;