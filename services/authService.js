import API from "./api";

export const loginUser = (data) => API.post("/auth/login", data);
export const loginAdmin = (data) => API.post("/auth/admin/login", data);
export const registerUser = (data) => API.post("/api/users/register", data);
export const registerAdmin = (data) => API.post("/api/admins/register", data);
