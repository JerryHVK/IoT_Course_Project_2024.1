import React, { useState, useEffect } from "react";
import axios from "axios";
import sensoricon from "../picture/sensor.jpg";
const Device = ({ token }) => {
  const [device, setDevice] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newDeviceNumber, setNewDeviceNumber] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchDevice = async () => {
      if (!token) {
        setError("No token provided. Please log in.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3100/api/v1/devices/mydevice", {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token here
          },
        });
        setDevice(response.data.data.device);
      } catch (err) {
        if (err.response?.status === 404) {
          // If no device exists, show the modal
          setShowModal(true);
        } else {
          setError(err.response?.data?.message || "Failed to fetch device.");
        }
      }
    };

    fetchDevice();
  }, [token]);

  const handleAddDevice = async () => {
    if (!newDeviceNumber || !password) {
      alert("Please provide both device number and password.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3100/api/v1/devices/login",
        { deviceNumber: newDeviceNumber, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDevice(response.data.data.device);
      setShowModal(false); // Close the modal after successful addition
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add device.");
    }
  };

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  if (!device && !showModal) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>My Device</h1>
      {device ? (
        <ul>
          <li><strong>Device Number:</strong> {device.deviceNumber}</li>
          <img src={sensoricon} alt="Device" style={{ width: "950px", height: "500px" }}/>
          {/* Add more fields as needed */}
        </ul>
      ) : null}

      {/* Modal for adding a device */}
      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Add Device</h2>
            <input
              type="text"
              placeholder="Enter device number"
              value={newDeviceNumber}
              onChange={(e) => setNewDeviceNumber(e.target.value)}
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <div style={styles.buttons}>
              <button onClick={handleAddDevice} style={styles.addButton}>
                Add Device
              </button>
              <button onClick={() => setShowModal(false)} style={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Device;

const styles = {
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "5px",
    width: "300px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

