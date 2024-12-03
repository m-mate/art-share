import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const token = localStorage.getItem("token");
  let isAdmin = false;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      isAdmin = decodedToken.role === "ADMIN";
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  return (
    <nav className="navbar navbar-dark bg-dark p-2">
      <div className="container-fluid">
        <Link
          className="navbar-brand"
          to="/gallery"
          style={{ textDecoration: "none", color: "white" }}
        >
          ArtShare
        </Link>
        <div>
          <button className="btn btn-outline-light me-2">
            <Link
              to="/update-user"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              User Settings
            </Link>
          </button>
          <button className="btn btn-outline-success me-2">
            <Link
              to="/add-painting"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Add Painting
            </Link>
          </button>
          {isAdmin && (
            <button className="btn btn-outline-warning">
              <Link
                to="/users"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Users
              </Link>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
