import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

// Get all users
export const getAllUsers = () => axios.get(`${API_URL}/getall`);

// Get user by ID
export const getUserById = (userId) => axios.get(`${API_URL}/get/${userId}`);

// Add user (register)
export const addUser = (user) => axios.post(`${API_URL}/register`, user);

// Update user
export const updateUser = (user) => axios.put(`${API_URL}/update`, user);

// Delete user
export const deleteUser = (userId) => axios.delete(`${API_URL}/delete/${userId}`);
