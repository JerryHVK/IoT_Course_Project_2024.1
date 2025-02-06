import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import signupicon from "../picture/signup.jpg"
const USER_SIGNUP_API = `${process.env.REACT_APP_SERVER}${process.env.REACT_APP_USER_ROUTE}${process.env.REACT_APP_USER_SIGNUP}`;

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const element = document.getElementById("signup-error");

    // Check if the password is greater or equal to 8
    if (password.length < 8) {
      element.textContent =
        "the length of password need to be greater or equal to 8";
      return;
    }

    // Check if passwordConfirm is correct
    if (passwordConfirm !== password) {
      element.textContent = "password and retype password are different";
      return;
    }

    // Check if the email is available

    // Add signup logic here
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, passwordConfirm }),
    };
    fetch(USER_SIGNUP_API, requestOptions).then(
      (response) => {
        if (response.ok) {
          alert("Signup successfully");
          navigate("/");
        } else {
          // notify signup fail
          element.textContent = "This email has been signup already";
        }
      }
    );
  };
  return (
    <div className="signup-container">
      <div className="signup-card">
        <img src={signupicon} alt="Logo" className="signup-logo" />
        <h1 className="signup-title">Signup</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <label className="signup-label">Name</label>
          <input
            type="text"
            className="signup-input"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label className="signup-label">Email</label>
          <input
            type="email"
            className="signup-input"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="signup-label">Password</label>
          <input
            type="password"
            className="signup-input"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className="signup-label">Retype Password</label>
          <input
            type="password"
            className="signup-input"
            placeholder="Retype your password"
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
          <div>
            <p id="signup-error" style={{ color: "red" }}></p>
          </div>
          {/* <button type="submit" className="signup-button">
            Submit
          </button> */}
          <div className="button-container">
            <button
              type="button"
              className="signup-button secondary"
              onClick={handleLogin}
            >
              I already have an account
            </button>
            <button type="submit" className="signup-button primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
