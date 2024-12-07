import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ element: Component, requireAdmin, ...rest }) => {
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const role = decodedToken.role;

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && role !== "ROLE_ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
