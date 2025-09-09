import React from "react";
import { Navigate } from "react-router-dom";

// role prop will be "USER" or "ADMIN"
const PrivateRoute = ({ role, children }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    // not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    // wrong role → redirect to home
    return <Navigate to="/" replace />;
  }

  // authorized → render the page
  return children;
};

export default PrivateRoute;
