import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/LogReg.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMessage("Both fields are required.");
      return;
    }

    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:8080/login", {
        username,
        password,
      });

      console.log("Login successful:", response.data);

      const token = response.data;
      localStorage.setItem("token", token);

      navigate("/gallery");
    } catch (err) {
      console.error("Error during login:", err);
      setErrorMessage("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="background">
      <div className="d-flex justify-content-center align-items-center vh-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow-sm"
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <h2 className="text-center mb-4">Login</h2>
          {errorMessage && (
            <p className="text-danger text-center">{errorMessage}</p>
          )}

          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>

          <div className="mt-3 text-center">
            <Link to="/register">Not registered? Create an account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
