import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const USER_LOGIN_API = `${process.env.REACT_APP_SERVER}${process.env.REACT_APP_USER_ROUTE}${process.env.REACT_APP_USER_LOGIN}`;

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // create requestOptions for login form
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    };

    // make a request to the server to authenticate the user
    try {
      const response = await fetch(
        USER_LOGIN_API,
        requestOptions
      );

      if (response.ok) {
        // Await the response body to parse JSON
        const body = await response.json();
        const token = body.token; // Adjust this based on your API response structure

        // Call onLogin if it's provided
        if (onLogin) {
          onLogin(token);
        }
      } else {
        // Handle login failure
        const element = document.getElementById("login-error");
        element.textContent = "Wrong email or password, please try again";
      }
    } catch (error) {
      // Handle network or other errors
      console.error("An error occurred during login:", error);
      const element = document.getElementById("login-error");
      element.textContent =
        "An unexpected error occurred. Please try again later.";
    }
  };

  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/signup"); // Redirect to the Signup page
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-image">
          <img
            src="/web-logo.png" // Replace with your image URL
            alt="Logo"
          />
        </div>
        <h1 className="login-title">Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="login-input"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div>
            <p id="login-error" style={{ color: "red" }}></p>
          </div>
          <div className="button-container">
            <button
              type="button"
              className="login-button secondary"
              onClick={handleSignup}
            >
              Create new account
            </button>
            <button type="submit" className="login-button primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
