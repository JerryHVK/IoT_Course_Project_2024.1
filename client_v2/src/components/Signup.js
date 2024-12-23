import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const element = document.getElementById("signup-error");

    // Check if the password is greater or equal to 8
    if (password.length < 8) {
      element.textContent =
        "the length of password need to be greater or equal to 8";
      return;
    }

    // Check if retypePassword is correct
    if (retypePassword !== password) {
      element.textContent = "retype password and password are different";
      return;
    }

    // Check if the email is available

    // Add signup logic here
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    };
    fetch("http://127.0.0.1:3001/api/v1/customers/signup", requestOptions).then(
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
        <img src="/web-logo.png" alt="Logo" className="signup-logo" />
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
            onChange={(e) => setRetypePassword(e.target.value)}
            required
          />
          <div>
            <p id="signup-error" style={{ color: "red" }}></p>
          </div>
          <button type="submit" className="signup-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
