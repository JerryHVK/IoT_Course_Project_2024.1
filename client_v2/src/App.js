import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Layout from "./components/Layout";
import Device from "./components/Device";
import Home from "./components/Home";
import MyInfo from "./components/MyInfo";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerId, setCustomerId] = useState("");

  const handleLogin = (customerId) => {
    setIsLoggedIn(true);
    setCustomerId(customerId);
  };

  const [activeMenu, setActiveMenu] = useState("home");

  const renderContent = () => {
    switch (activeMenu) {
      case "home":
        return <Home />;
      case "device":
        return <Device customerId={customerId} />;
      case "info":
        return <MyInfo customerId={customerId} />;
      case "logout":
        setIsLoggedIn(false);
        setCustomerId("");
        console.log("CustomerID after logout: ", customerId);
        alert("Logout successfully!");
        return;
      default:
        return <div>Welcome to the Home Page!</div>;
    }
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              !isLoggedIn ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Layout activeMenu={activeMenu} onMenuClick={setActiveMenu}>
                  {renderContent()}
                </Layout>
              )
            }
          />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
