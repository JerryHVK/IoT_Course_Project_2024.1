import React, { useEffect, useState } from "react";
import "./Device.css";
import "reactjs-popup/dist/index";

function Camera({ customerId }) {
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [checkedCameras, setCheckedCameras] = useState([]);
  const [listCamera, setListCamera] = useState(null);

  const fetchListCamera = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3001/api/v1/customers/${customerId}/cam`
      );
      if (response.ok) {
        const body = await response.json();
        setListCamera(body.data);
      }
    } catch (error) {
      console.log("An error occurred during fetching the camera list");
      setListCamera(null);
    }
  };

  useEffect(() => {
    fetchListCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to handle when we click an camera to show the video
  const handleCameraClick = (camera) => {
    setSelectedCamera(camera);
  };

  // Function to handle when we use check box
  const handleCheckboxChange = (cameraId) => {
    setCheckedCameras((prevChecked) =>
      prevChecked.includes(cameraId)
        ? prevChecked.filter((id) => id !== cameraId)
        : [...prevChecked, cameraId]
    );
  };

  // Handle the popup when we click the add camera button

  const [isPopupVisible, setIsPopupVisible] = useState(false); // State to manage popup visibility
  const [formData, setFormData] = useState({ name: "", url: "", location: "" }); // State to manage form data

  const handleAddButton = () => {
    setIsPopupVisible(true); // Show the popup when the add button is clicked
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false); // Hide the popup
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Update the form data as the user types
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);

    // Example: Send form data to the server
    try {
      const response = await fetch(
        `http://127.0.0.1:3001/api/v1/customers/${customerId}/cam`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setIsPopupVisible(false); // Close the popup after successful submission

        //re-fetch the data to have new camera list
        fetchListCamera();
      } else {
        alert("Cannot add camera!");
        console.error("Failed to submit the form");
      }
    } catch (error) {
      console.error("An error occurred while submitting the form:", error);
    }
  };

  // Handle deleting camera
  const handleDeleteButton = async (e) => {
    e.preventDefault();
    checkedCameras.map(async (cameraId) => {
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: cameraId }),
      };

      try {
        const response = await fetch(
          `http://127.0.0.1:3001/api/v1/customers/${customerId}/cam`,
          requestOptions
        );
        if (response.ok) {
          console.log("delete camera successfully");
        } else {
          console.log("Cannot delete camera");
        }
      } catch (error) {
        console.error("An error occurred during deleting camera:", error);
      }
    });
    await fetchListCamera();
  };

  return (
    <div>
      <div className="camera-section">
        {/* Camera List */}
        <div className="camera-list">
          <div className="camera-list-header">
            {checkedCameras.length > 0 && (
              <button className="delete-button" onClick={handleDeleteButton}>
                <img src="/delete-icon.png" alt="Delete" />
              </button>
            )}
            <button className="add-button" onClick={handleAddButton}>
              <img src="/add-icon.png" alt="Add" />
            </button>
          </div>
          <div className="camera-list-body">
            {listCamera &&
              listCamera.map((camera) => (
                <div
                  key={camera._id}
                  className={`camera-item ${
                    selectedCamera?._id === camera._id ? "active" : ""
                  }`}
                  onClick={() => handleCameraClick(camera)}
                >
                  <div className="camera-info">
                    <span className="camera-name">{camera.name}</span>
                    <span className="camera-location">
                      Location: {camera.location}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    className="camera-checkbox"
                    checked={checkedCameras.includes(camera._id)}
                    onChange={() => handleCheckboxChange(camera._id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Camera Details Panel */}
        <div className="camera-details">
          {selectedCamera ? (
            <div>
              <h2>{selectedCamera.name}</h2>
              <div className="camera-preview"></div>
              <p>URL: {selectedCamera.url}</p>
              <p>Location: {selectedCamera.location}</p>
              <p>ID: {selectedCamera._id}</p>
            </div>
          ) : (
            <p>Select a camera to view its details</p>
          )}
        </div>
      </div>

      <div>
        {/* Popup */}
        {isPopupVisible && (
          <div className="popup-overlay">
            <div className="popup">
              <button className="close-button" onClick={handleClosePopup}>
                &times;
              </button>
              <h2>Fill the Form</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Camera0"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="url">URL:</label>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    placeholder="rtsp://192.168.100.248"
                    value={formData.url}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="location">Location:</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="garden"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="submit-button">
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Camera;
