import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Layout from "./components/Layout";
import Device from "./components/Device";
import Home from "./components/Home";

import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [_id, setCustomerId] = useState("");

  const handleLogin = (_id) => {
    setIsLoggedIn(true);
    setCustomerId(_id);
  };

  const [activeMenu, setActiveMenu] = useState("home");

  const renderContent = () => {
    switch (activeMenu) {
      case "home":
        return <Home />;
      case "device":
        return <Device customerId={_id} />;
      case "logout":
        setIsLoggedIn(false);
        setCustomerId("");
        console.log("CustomerID after logout: ", _id);
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
