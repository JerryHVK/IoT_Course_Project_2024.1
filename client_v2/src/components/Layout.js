import React from "react";
// import { useNavigate } from "react-router-dom";
import "./Layout.css";

function Layout({ activeMenu, children, onMenuClick }) {

  // const navigate = useNavigate();

  return (
    <div className="layout-page">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <img src="web-logo.png" alt="Logo" className="logo" />
        </div>
        <div className="menu">
          <div
            className={`menu-item ${activeMenu === "home" ? "active" : ""}`}
            onClick={() => onMenuClick("home")}
          >
            <img src="/home-icon.png" alt="Home" className="menu-icon" />
            <span>Home</span>
          </div>
          <div
            className={`menu-item ${activeMenu === "camera" ? "active" : ""}`}
            onClick={() => onMenuClick("camera")}
          >
            <img src="/device-icon.png" alt="Device" className="menu-icon" />
            <span>Device</span>
          </div>
          <div
            className={`menu-item ${activeMenu === "info" ? "active" : ""}`}
            onClick={() => onMenuClick("info")}
          >
            <img src="/info-icon.png" alt="My Info" className="menu-icon" />
            <span>My Info</span>
          </div>
          <div className="menu-item" onClick={() => onMenuClick("logout")}>
            <img src="/logout-icon.png" alt="Log out" className="menu-icon" />
            <span>Log out</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">{children}</div>
    </div>
  );
}

export default Layout;
