import axios from "axios";

const API_URL = "http://localhost:8080/api/bus-operators";

// Get all operators
export const getAllOperators = () => axios.get(`${API_URL}/getall`);

// Get operator by ID
export const getOperatorById = (operatorId) => axios.get(`${API_URL}/get/${operatorId}`);

// Add operator
export const addOperator = (operator) => axios.post(`${API_URL}/add`, operator);

// Update operator
export const updateOperator = (operator) => axios.put(`${API_URL}/update`, operator);

// Delete operator
export const deleteOperator = (operatorId) => axios.delete(`${API_URL}/delete/${operatorId}`);
