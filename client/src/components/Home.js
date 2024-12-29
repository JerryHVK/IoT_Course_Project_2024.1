// import React from "react";
// import "./Home.css";
// import LineGraph from "./LineGraph";

// function Home({ token }) {
//   // return(<div>Write the home page here</div>);

//   return <LineGraph token={token} />;
// }

// export default Home;


import React, { useEffect, useState } from "react";
import axios from "axios";
import LineGraph from "./LineGraph"; // Import LineGraph for visualization
import "./Home.css";

function Home({ token }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data with authentication token
        const response = await axios.get(
          "http://127.0.0.1:3100/api/v1/healthindexes/100",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Transform the data to match the charting format
        const records = response.data.data.latestData[0].data.map((item) => ({
          time: new Date(item.createdAt).toLocaleTimeString(), // Format timestamp
          heartRate: item.heartRate,
          spo2: item.spo2,
        }));

        setData(records); // Save transformed data
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Render loading, error, or the graph
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{width:"100%"}}>
      <h1>Heart Rate</h1>
      <LineGraph data={data} />
    </div>
  );
}

export default Home;
