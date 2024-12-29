// import React from "react";
// import "./Home.css";
// import LineGraph from "./LineGraph";

// function Home({ token }) {
//   // return(<div>Write the home page here</div>);

//   return <LineGraph token={token} />;
// }

// export default Home;


import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Home = ({token}) => {
  const [selection, setSelection] = useState('year');
  const [inputs, setInputs] = useState({
    year: '',
    month: '',
    day: '',
  });
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelectionChange = (e) => {
    setSelection(e.target.value);
    setInputs({
      year: '',
      month: '',
      day: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      let url = '';
      let labels = [];
      let xAxisLabel = '';

      if (selection === 'year') {
        url = `http://127.0.0.1:3100/api/v1/healthindexes/year?year=${inputs.year}`;
        xAxisLabel = 'Month';
      } else if (selection === 'month') {
        url = `http://127.0.0.1:3100/api/v1/healthindexes/month?month=${inputs.month}&&year=${inputs.year}`;
        xAxisLabel = 'Day';
      } else if (selection === 'day') {
        url = `http://127.0.0.1:3100/api/v1/healthindexes/day?day=${inputs.day}&&month=${inputs.month}&&year=${inputs.year}`;
        xAxisLabel = 'Hour';
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Extract data from the response
      const heartRates = response.data.data.map(item => item.heartRate);
      const timeStamps = response.data.data.map(item => new Date(item.timeStamp));

      // Generate x-axis labels based on the selection
      if (selection === 'year') {
        labels = timeStamps.map(date => date.toLocaleString('default', { month: 'short' }));
      } else if (selection === 'month') {
        labels = timeStamps.map(date => date.getDate());
      } else if (selection === 'day') {
        labels = timeStamps.map(date => date.getHours());
      }

      setChartData({
        labels: labels, // x-axis labels
        datasets: [
          {
            label: `Health Index (${xAxisLabel})`,
            data: heartRates, // y-axis data
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching data:', error.message);
      alert('Failed to fetch data. Please check the API or input values.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      (selection === 'year' && !inputs.year) ||
      (selection === 'month' && (!inputs.year || !inputs.month)) ||
      (selection === 'day' && (!inputs.year || !inputs.month || !inputs.day))
    ) {
      alert('Please fill in the required fields.');
    } else {
      fetchData();
    }
  };

  return (
    <div>
      <h2>Select Date and View Data</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Choose:
          <select value={selection} onChange={handleSelectionChange}>
            <option value="year">Year</option>
            <option value="month">Month</option>
            <option value="day">Day</option>
          </select>
        </label>
        <div>
          {selection === 'year' && (
            <label>
              Year:
              <input
                type="number"
                name="year"
                value={inputs.year}
                onChange={handleInputChange}
                required
              />
            </label>
          )}
          {selection === 'month' && (
            <>
              <label>
                Year:
                <input
                  type="number"
                  name="year"
                  value={inputs.year}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Month:
                <input
                  type="number"
                  name="month"
                  value={inputs.month}
                  onChange={handleInputChange}
                  min="1"
                  max="12"
                  required
                />
              </label>
            </>
          )}
          {selection === 'day' && (
            <>
              <label>
                Year:
                <input
                  type="number"
                  name="year"
                  value={inputs.year}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Month:
                <input
                  type="number"
                  name="month"
                  value={inputs.month}
                  onChange={handleInputChange}
                  min="1"
                  max="12"
                  required
                />
              </label>
              <label>
                Day:
                <input
                  type="number"
                  name="day"
                  value={inputs.day}
                  onChange={handleInputChange}
                  min="1"
                  max="31"
                  required
                />
              </label>
            </>
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>

      {chartData && (
        <div style={{ marginTop: '20px' }}>
          <h3>Line Graph</h3>
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: {
                  display: true,
                  text: `Health Index Data (${selection === 'year' ? 'Monthly' : selection === 'month' ? 'Daily' : 'Hourly'})`,
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: selection === 'year' ? 'Months' : selection === 'month' ? 'Days' : 'Hours',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Health Index',
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Home;

/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { DatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Home = ({ token }) => {
  const [selection, setSelection] = useState('year'); // default to "year"
  const [inputs, setInputs] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to handle selection change (year, month, day)
  const handleSelectionChange = (e) => {
    setSelection(e.target.value);
    setInputs({
      year: '',
      month: '',
      day: '',
    });
  };

  // Function to handle input changes (for year, month, day)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle date picker change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setInputs({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    });
  };

  // Function to fetch data based on the selected date
  const fetchData = async () => {
    try {
      setLoading(true);
      let url = '';
      let labels = [];
      let xAxisLabel = '';

      if (selection === 'year') {
        url = `http://127.0.0.1:3100/api/v1/healthindexes/year?year=${inputs.year}`;
        xAxisLabel = 'Month';
      } else if (selection === 'month') {
        url = `http://127.0.0.1:3100/api/v1/healthindexes/month?month=${inputs.month}&year=${inputs.year}`;
        xAxisLabel = 'Day';
      } else if (selection === 'day') {
        url = `http://127.0.0.1:3100/api/v1/healthindexes/day?day=${inputs.day}&month=${inputs.month}&year=${inputs.year}`;
        xAxisLabel = 'Hour';
      }

      // Make the request with Authorization header
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Extract data from the response
      const heartRates = response.data.data.map(item => item.heartRate);
      const timeStamps = response.data.data.map(item => new Date(item.timeStamp));

      // Generate x-axis labels based on the selection
      if (selection === 'year') {
        labels = timeStamps.map(date => date.toLocaleString('default', { month: 'short' }));
      } else if (selection === 'month') {
        labels = timeStamps.map(date => date.getDate());
      } else if (selection === 'day') {
        labels = timeStamps.map(date => date.getHours());
      }

      setChartData({
        labels: labels, // x-axis labels
        datasets: [
          {
            label: `Heart Rate (${xAxisLabel})`,
            data: heartRates, // y-axis data
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching data:', error.message);
      alert('Failed to fetch data. Please check the API or input values.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission to fetch data
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      (selection === 'year' && !inputs.year) ||
      (selection === 'month' && (!inputs.year || !inputs.month)) ||
      (selection === 'day' && (!inputs.year || !inputs.month || !inputs.day))
    ) {
      alert('Please fill in the required fields.');
    } else {
      fetchData();
    }
  };

  // Effect to fetch data when selected date or view type changes
  useEffect(() => {
    fetchData();
  }, [inputs, selection]);

  return (
    <div>
      <h2>Select Date and View Data</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Choose View:
          <select value={selection} onChange={handleSelectionChange}>
            <option value="year">Year</option>
            <option value="month">Month</option>
            <option value="day">Day</option>
          </select>
        </label>
        <div>
          {selection === 'year' && (
            <label>
              Year:
              <input
                type="number"
                name="year"
                value={inputs.year}
                onChange={handleInputChange}
                required
              />
            </label>
          )}
          {selection === 'month' && (
            <>
              <label>
                Year:
                <input
                  type="number"
                  name="year"
                  value={inputs.year}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Month:
                <input
                  type="number"
                  name="month"
                  value={inputs.month}
                  onChange={handleInputChange}
                  min="1"
                  max="12"
                  required
                />
              </label>
            </>
          )}
          {selection === 'day' && (
            <>
              <label>
                Year:
                <input
                  type="number"
                  name="year"
                  value={inputs.year}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Month:
                <input
                  type="number"
                  name="month"
                  value={inputs.month}
                  onChange={handleInputChange}
                  min="1"
                  max="12"
                  required
                />
              </label>
              <label>
                Day:
                <input
                  type="number"
                  name="day"
                  value={inputs.day}
                  onChange={handleInputChange}
                  min="1"
                  max="31"
                  required
                />
              </label>
            </>
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>

      <div>
        <label>Select Date:</label>
        <DatePicker selected={selectedDate} onChange={handleDateChange} />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        chartData && (
          <div style={{ marginTop: '20px' }}>
            <h3>Line Graph</h3>
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: {
                    display: true,
                    text: `Heart Rate Data (${selection === 'year' ? 'Monthly' : selection === 'month' ? 'Daily' : 'Hourly'})`,
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: selection === 'year' ? 'Months' : selection === 'month' ? 'Days' : 'Hours',
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Heart Rate',
                    },
                  },
                },
              }}
            />
          </div>
        )
      )}
    </div>
  );
};

export default Home;*/


