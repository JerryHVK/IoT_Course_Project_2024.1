import React, { useState, useEffect } from 'react';
import axios from "axios";
function MyInfo({ token }) {
  const [userInfo, setUserInfo] = useState(null); // To store user information
  const [loading, setLoading] = useState(true); // To track loading state
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    // Fetch user info when the component mounts
    const fetchUserInfo = async () => {
      try {
       const response = await axios.get(
                 "http://127.0.0.1:3100/api/v1/users/",
                 {
                   headers: {
                     Authorization: `Bearer ${token}`,
                   },
                 }
               );
       
         if (response.data.status === "error") {
                throw new Error(response.data.message || "Unknown error occurred");
              }
        setUserInfo(response.data.data.user); // Store the fetched data
      } catch (err) {
        setError(err.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchUserInfo();
  }, [token]);

  // Render loading, error, or user info
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>User Info</h1>
      {userInfo ? (
        <div>
          
          <p><strong>Name:</strong> {userInfo.name}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          
        </div>
      ) : (
        <p>No user information available.</p>
      )}
    </div>
  );
}

export default MyInfo;
