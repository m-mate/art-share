import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const currentUser = localStorage.getItem("username") || null;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  const handleMakeAdmin = async (userId) => {
    try {
      console.log(userId);
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8080/users/role/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data;
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id
            ? { ...user, role: updatedUser.role }
            : user
        )
      );
    } catch (error) {
      setError("Failed to make user admin.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      setError("Failed to delete user.");
    }
  };

  return (
    <div className="usres-page">
      <Navbar />
      <div className="container">
        <h1>Users</h1>
        {error && <p className="text-danger">{error}</p>}
        <ul className="list-group">
          {users.map((user) => (
            <li
              key={user.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center">
                <strong>{user.username}</strong> - <span>{user.role}</span>
              </div>
              <div className="d-flex align-items-center">
                {user.username != currentUser && (
                  <>
                    <button
                      className="btn btn-primary btn-sm me-2 mb-3"
                      onClick={() => handleMakeAdmin(user.id)}
                    >
                      {user.role === "ADMIN" ? "Make User" : "Make Admin"}
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UsersPage;
