import React from "react";
import { Link } from "react-router-dom";

import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-page">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <img src="web_logo.png" alt="Logo" className="logo" />
        </div>
        <div className="menu">
          {/* <div className="menu-item active"> */}
          <div className="menu-item active">
            <img src="/home-icon.png" alt="Home" className="menu-icon" />
            <span>Home</span>
          </div>
          <div className="menu-item">
            <img src="/camera-icon.png" alt="Camera" className="menu-icon" />
            <span>Camera</span>
          </div>
          <div className="menu-item">
            <img src="/info-icon.png" alt="My Info" className="menu-icon" />
            <span>My info</span>
          </div>
          <div className="menu-item">
            <img src="/logout-icon.png" alt="Log out" className="menu-icon" />
            <span>Log out</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-card">
          <h1>IP Camera Management System</h1>
          <p>This is the system supporting ...</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
