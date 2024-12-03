import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/AddPaintingPage.css";
import Navbar from "./Navbar"; 
import axios from "axios"; 
import { useNavigate } from "react-router-dom";

const AddPaintingPage = () => {
  const [paintingImage, setPaintingImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file!");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPaintingImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPainting = async () => {
    if (!title || !description || !paintingImage) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    try {
      const formData = new FormData();
      const painting = JSON.stringify({ description, title });
      formData.append("painting", painting);

      
      const base64ToFile = (base64, filename) => {
        const byteString = atob(base64.split(",")[1]);
        const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new File([ab], filename, { type: mimeString });
      };

      const imageFile = base64ToFile(paintingImage, "painting.png");
      formData.append("image", imageFile);

      const username = localStorage.getItem("username");
      const token = localStorage.getItem("token");

      if (!username || !token) {
        alert("Authentication error. Please log in again.");
        return;
      }

      const response = await axios.post(
        `http://localhost:8080/api/paintings/add-painting/${username}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPaintingImage(null);
      setTitle("");
      setDescription("");
      navigate("/gallery");
    } catch (error) {
      console.error(
        "Error uploading painting:",
        error.response?.data || error.message
      );
      setError(
        error.response?.data?.message ||
          "Failed to add painting. Please try again."
      );
    }
  };

  return (
    <div className="add-painting-page">
      <Navbar />
      <div className="container-fluid p-4">
        <div className="row">
          {/* Left side for Image Upload */}
          <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
            <div className="image-upload-box">
              {paintingImage ? (
                <img
                  src={paintingImage}
                  alt="Uploaded Painting Preview"
                  className="uploaded-image"
                />
              ) : (
                <label htmlFor="file-upload" className="upload-placeholder">
                  +
                </label>
              )}
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
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
              onClick={handleAddPainting}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPaintingPage;
