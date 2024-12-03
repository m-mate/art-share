import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/AddPaintingPage.css";
import Navbar from "./Navbar"; 
import axios from "axios"; 
import { useNavigate, useParams } from "react-router-dom";

const EditPaintingPage = () => {
  const { paintingId } = useParams(); 
  const [paintingImage, setPaintingImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  
  useEffect(() => {
    const fetchPainting = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/paintings/${paintingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { title, description, image } = response.data;
        setTitle(title);
        setDescription(description);
        setPaintingImage(image);
      } catch (err) {
        setError("Failed to load painting details.");
      }
    };

    fetchPainting();
  }, [paintingId, token]);

  const handleSave = async () => {
    if (!title || !description) {
      setError("Title and description are required.");
      return;
    }

    try {
      const payload = {
        title,
        description,
      };

     
      await axios.put(
        `http://localhost:8080/api/paintings/${paintingId}`, 
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", 
          },
        }
      );

      navigate("/gallery"); 
    } catch (err) {
      setError("Failed to save painting. Please try again.");
    }
  };

  return (
    <div className="add-painting-page">
      <Navbar />
      <div className="container-fluid p-4">
        <div className="row">
          {/* Left side for Image Display */}
          <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
            <div className="image-upload-box">
              {paintingImage ? (
                <img
                  src={`data:image/jpeg;base64,${paintingImage}`}
                  alt="Painting Preview"
                  className="img-fluid"
                />
              ) : (
                <p>Loading image...</p>
              )}
            </div>
          </div>

          {/* Right side for Title and Description */}
          <div className="col-md-6 d-flex flex-column">
            {error && <p className="text-danger">{error}</p>}
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                id="title"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                className="form-control"
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <button
              className="btn btn-primary align-self-end"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPaintingPage;
