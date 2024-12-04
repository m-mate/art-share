import React, { useState } from "react";
import axios from "axios";
import "../styles/LogReg.css";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8080/register",
        JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: 0,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("User registered successfully:", response.data);
      alert("Registration successful!");

      window.location.href = "/";
    } catch (err) {
      console.error("Error during registration:", err);
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="background">
      <div className="d-flex justify-content-center align-items-center vh-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow-sm"
          style={{ width: "100%", maxWidth: "500px" }}
        >
          <h2 className="text-center mb-4">Register</h2>

          {errorMessage && (
            <p className="text-danger text-center">{errorMessage}</p>
          )}

          <div className="row mb-3">
            <div className="col">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="form-control"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
              />
            </div>
            <div className="col">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="form-control"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>

          <div className="mt-3 text-center">
            <p>
              Already have an account? <a href="/">Login here</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
