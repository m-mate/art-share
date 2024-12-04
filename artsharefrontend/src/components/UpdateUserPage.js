import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Navbar from "./Navbar";

const UpdateUserPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in.");
      window.location.href = "/";
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/users/${localStorage.getItem("username")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { firstName, lastName, username, email } = response.data;

      setFirstName(firstName);
      setLastName(lastName);
      setUsername(username);
      setEmail(email);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching user data:", error);
      setError("Failed to load user data. Please try again.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const updatedUserData = {
      firstName,
      lastName,
      username,
      email,
      password,
    };

    const token = localStorage.getItem("token");

    try {
      console.log(updatedUserData.usernam);
      const response = await axios.put(
        `http://localhost:8080/users/${localStorage.getItem("username")}`,
        updatedUserData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("User updated:", response.data);
      alert("User parameters updated successfully!");

      setPassword("");
      setConfirmPassword("");
      if (updatedUserData.username != localStorage.getItem("username")) {
        handleLogout();
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      setError("Failed to update user data. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("You have been logged out.");
    window.location.href = "/";
  };

  const handleDeleteProfile = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your profile? This action cannot be undone."
      )
    ) {
      const token = localStorage.getItem("token");

      try {
        await axios.delete("http://localhost:8080/api/user/delete", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("User profile deleted.");
        alert("Your profile has been deleted.");
        localStorage.removeItem("token");
        window.location.href = "/";
      } catch (error) {
        console.error("Error deleting profile:", error);
        alert("Failed to delete profile. Please try again.");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="update-user-page">
      <Navbar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Update Your Information</h2>
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="form-control"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="form-control"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                New Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button
                className="btn btn-danger btn-xs"
                onClick={handleDeleteProfile}
              >
                Delete Profile
              </button>
              <button className="btn btn-primary btn-xs" onClick={handleUpdate}>
                Update Information
              </button>
              <button
                className="btn btn-secondary btn-xs"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserPage;
