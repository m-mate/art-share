import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/GalleryPage.css";
import Navbar from "./Navbar";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

const GalleryPage = () => {
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [paintings, setPaintings] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [paintingRatings, setPaintingRatings] = useState([]);
  const [curentUser, setCurentUser] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const getCurrentUser = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setCurentUser(decodedToken);
      console.log(decodedToken.sub);
      localStorage.setItem("username", decodedToken.sub);
    }
    return null;
  };

  useEffect(() => {
    getCurrentUser();
    const fetchPaintings = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to view the paintings.");
        return;
      }

      try {
        console.log("JWT Token:", localStorage.getItem("token"));
        const response = await axios.get(
          "http://localhost:8080/api/paintings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPaintings(response.data);
      } catch (error) {
        if (error.response) {
          setError(
            `Error: ${error.response.data || "Could not fetch paintings"}`
          );
        } else if (error.request) {
          setError("Network error. Please check your connection.");
        } else {
          setError(`Unexpected error: ${error.message}`);
        }
        console.error(error);
      }
    };

    fetchPaintings();
  }, []);

  const handleSelectPainting = async (painting) => {
    setSelectedPainting(painting);
    setComments([]);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/comments/painting/${painting.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(response.data);

      const ratingsResponse = await axios.get(
        `http://localhost:8080/api/ratings/painting/${painting.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPaintingRatings(ratingsResponse.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to fetch comments.");
    }
  };

  const handleDeletePainting = async (painting) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/paintings/${painting.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to delete.");
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8080/api/comments/painting/${selectedPainting.id}/${curentUser.sub}`,
        {
          content: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError("Failed to submit comment.");
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditedContent(comment.content);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editedContent.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8080/api/comments/${commentId}`,
        { content: editedContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, content: editedContent }
            : comment
        )
      );
      setEditingComment(null);
      setEditedContent("");
    } catch (error) {
      console.error("Error updating comment:", error);
      setError("Failed to update comment.");
    }
  };

  const handleStarClick = (rating) => {
    if (selectedPainting) {
      const newRatings = {
        ...userRatings,
        [selectedPainting.id]: rating,
      };
      setUserRatings(newRatings);
      const token = localStorage.getItem("token");
      axios
        .post(
          `http://localhost:8080/api/ratings/${selectedPainting.id}/${curentUser.sub}`,
          { score: rating },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log("Rating updated:", response.data);
          handleSelectPainting(selectedPainting);
        })
        .catch((error) => {
          console.error("Error updating rating:", error);
          setError("Failed to update rating");
        });
    }
  };

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const totalRating = ratings.reduce((sum, rating) => sum + rating.score, 0);
    return Math.round(totalRating / ratings.length);
  };

  const getUserRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;

    const userRating = ratings.find((rating) => rating.user === curentUser.sub);
    return userRating ? parseInt(userRating.score) : 0;
  };

  const currentRating = selectedPainting
    ? calculateAverageRating(paintingRatings)
    : 0;

  const userRating = selectedPainting ? getUserRating(paintingRatings) : 0;

  return (
    <div className="gallery-page">
      <Navbar />
      {error && <p className="error">{error}</p>}
      <div className="content d-flex">
        <div className="painting-list">
          {paintings.map((painting) => (
            <div
              key={painting.id}
              className="painting-item"
              onClick={() => handleSelectPainting(painting)}
            >
              <div className="painting-box">
                <img
                  src={`data:image/jpeg;base64,${painting.image}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "400px",
                    objectFit: "contain",
                  }}
                />
              </div>
              <div>
                <h5>
                  {painting.title.length > 5
                    ? `${painting.title.slice(0, 5)}...`
                    : painting.title}
                </h5>
                <p>{painting.painter}</p>
              </div>

              {painting.painter === curentUser.sub && (
                <>
                  <div className="btn btn-sm ">
                    <Link
                      to={`/edit-painting/${painting.id}`}
                      style={{ textDecoration: "none", color: "green" }}
                      onClick={(event) => event.stopPropagation()}
                    >
                      Edit
                    </Link>
                  </div>
                  <div
                    className="btn btn-sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeletePainting(painting);
                    }}
                    style={{
                      textDecoration: "none",
                      color: "red",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="painting-details">
          {selectedPainting ? (
            <>
              <h3>{selectedPainting.title}</h3>
              <p>by: {selectedPainting.painter}</p>
              <p>Description: {selectedPainting.description}</p>
              {selectedPainting.image && (
                <div className="painting-display">
                  <img
                    src={`data:image/jpeg;base64,${selectedPainting.image}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "400px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              )}
              Average rating:
              <div className="stars">
                {"★".repeat(currentRating)}
                {"☆".repeat(5 - currentRating)}
              </div>
              My rating:
              <div className="stars mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleStarClick(star)}
                    style={{
                      cursor: "pointer",
                      color: star <= userRating ? "gold" : "gray",
                      fontSize: "1.5rem",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className="mt-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  rows="3"
                  style={{ width: "100%" }}
                />
                <button
                  className="btn btn-primary mt-2"
                  onClick={handleCommentSubmit}
                >
                  Submit Comment
                </button>
              </div>
              <h5 className="mt-3">Comments</h5>
              <div className="comments-section">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <p>
                        <strong>{comment.author}</strong>:{" "}
                        {editingComment === comment.id ? (
                          <>
                            <textarea
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                              rows="3"
                              style={{ width: "100%" }}
                            />
                            <button
                              className="btn btn-primary mt-2 btn-sm"
                              onClick={() => handleUpdateComment(comment.id)}
                            >
                              Update Comment
                            </button>
                          </>
                        ) : (
                          <>
                            {comment.content}
                            {comment.modified && (
                              <span className="text-muted ml-2">(edited)</span>
                            )}
                          </>
                        )}
                      </p>
                      {curentUser.sub == comment.author && (
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEditComment(comment)}
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}
              </div>
            </>
          ) : (
            <h3>Select a painting to see details</h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
