import React, { useState, useEffect } from "react";
import axios from "axios";

const Device = ({ token }) => {
  const [device, setDevice] = useState(null);
  const [error, setError] = useState(null);

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
        setError(err.response?.data?.message || "Failed to fetch device.");
      }
    };

    fetchDevice();
  }, [token]);

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  if (!device) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>My Device</h1>
      <ul>
        <li><strong>Device Number:</strong> {device.deviceNumber}</li>
        
        {/* Add more fields as needed */}
      </ul>
    </div>
  );
};

export default Device;
