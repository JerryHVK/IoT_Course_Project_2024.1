import React from "react";
// import { useNavigate } from "react-router-dom";
import "./Layout.css";
import heartRateMonitorIcon from "../picture/heart-rate-monitor.png";
import home from "../picture/home.jpg";
import logout from "../picture/logout.jpg";
import device from "../picture/device.jpg";
import system from "../picture/content-management-system_2630878.png";
import myinfo from "../picture/information.png";
function Layout({ activeMenu, children, onMenuClick }) {

  // const navigate = useNavigate();

  return (
    <div className="layout-page">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <img src={heartRateMonitorIcon} alt="Logo" className="logo" />
        </div>
        <div className="menu">
          <div
            className={`menu-item ${activeMenu === "home" ? "active" : ""}`}
            onClick={() => onMenuClick("home")}
          >
            <img src={home} alt="Home" className="menu-icon" />
            <span>Home</span>
          </div>
          <div
            className={`menu-item ${activeMenu === "My Info" ? "active" : ""}`}
            onClick={() => onMenuClick("my info")}
          >
            <img src={myinfo} alt="My Info" className="menu-icon" />
            <span>My Info</span>
          </div>
          <div
            className={`menu-item ${activeMenu === "about system" ? "active" : ""}`}
            onClick={() => onMenuClick("about system")}
          >
            <img src={system} alt="About System" className="menu-icon" />
            <span>About System</span>
          </div>
          <div className="menu-item" onClick={() => onMenuClick("Device")}>
            <img src={device} alt="Device" className="menu-icon" />
            <span>Device</span>
          </div>
          <div className="menu-item" onClick={() => onMenuClick("logout")}>
            <img src={logout} alt="Log out" className="menu-icon" />
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
