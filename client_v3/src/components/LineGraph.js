import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const GET_LATEST_API = `${process.env.REACT_APP_SERVER}`;

const LineGraph = ({ token }) => {
  const [data, setData] = useState([]);

  // Fetch data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        // axios là gì?
        const response = await axios.get(
          `${GET_LATEST_API}/healthindexes/10`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token
            },
          }
        );
        const records = response.data.data.latestData[0].data;
        // console.log(records);

        // Transform the data if necessary
        const transformedData = records.map((record) => ({
          time: new Date(record.createdAt).toLocaleTimeString(), // Format time for display
          value: record.heartRate,
        }));

        console.log(transformedData);

        setData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: "80%", height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineGraph;


// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const LineGraph = ({ data }) => {
//   return (
//     <div style={{ width: "100%", height: 400 }}>
//       <ResponsiveContainer>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="time" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey="heartRate"
//             stroke="#8884d8"
//             activeDot={{ r: 8 }}
//           />
//           <Line type="monotone" dataKey="spo2" stroke="#82ca9d" />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default LineGraph;
