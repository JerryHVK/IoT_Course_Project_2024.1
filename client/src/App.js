import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";

import Layout from "./components/Layout";
import Device from "./components/Device";
import Home from "./components/Home";
import MyInfo from "./components/MyInfo";
import AboutSystem from "./components/AboutSystem";
import LogoutConfirm from "./components/LogoutConfirm";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [activeMenu, setActiveMenu] = useState("home");
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const handleLogin = (token) => {
    setIsLoggedIn(true);
    setToken(token);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken("");
    setActiveMenu("home");
    setIsLogoutConfirmOpen(false); // Close modal after logout
  };

  const handleMenuClick = (menu) => {
    if (menu === "logout") {
      setIsLogoutConfirmOpen(true); // Show the logout confirmation modal
    } else {
      setActiveMenu(menu); // Update active menu for other cases
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "home":
        return <Home token={token} />;
      case "my info":
        return <MyInfo token={token} />;
      case "about system":
        return <AboutSystem />;
      case "Device":
        return <Device token={token} />;
      // case "logout":
      //   setIsLogoutConfirmOpen(true);
      //   return;
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
                <Layout activeMenu={activeMenu} onMenuClick={handleMenuClick}>
                  {renderContent()}
                </Layout>
              )
            }
          />
          <Route path="/signup" element={<Signup />} />
        </Routes>

        <LogoutConfirm
          isOpen={isLogoutConfirmOpen}
          onConfirm={handleLogout}
          onCancel={() => setIsLogoutConfirmOpen(false)}
        />
      </div>
    </Router>
  );
}

export default App;

// import React, { useState } from "react";
// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import Login from "./components/Login";
// import Signup from "./components/Signup";
// import Layout from "./components/Layout";
// import Home from "./components/Home";
// import MyInfo from "./components/MyInfo";
// import AboutSystem from "./components/AboutSystem";
// import LogoutConfirm from "./components/LogoutConfirm";
// import "./App.css";

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [token, setToken] = useState("");
//   const [activeMenu, setActiveMenu] = useState("home");
//   const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

//   const handleLogin = (token) => {
//     setIsLoggedIn(true);
//     setToken(token);
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setToken("");
//     setActiveMenu("home");
//     setIsLogoutConfirmOpen(false); // Close modal after logout
//   };

//   const renderContent = () => {
//     switch (activeMenu) {
//       case "home":
//         return <Home token={token} />;
//       case "my info":
//         return <MyInfo token={token} />;
//       case "about system":
//         return <AboutSystem />;
//       default:
//         return <div>Welcome to the Home Page!</div>;
//     }
//   };

//   return (
//     <Router>
//       <div className="app">
//         <Routes>
//           <Route
//             path="/"
//             element={
//               isLoggedIn ? (
//                 <Layout activeMenu={activeMenu} onMenuClick={setActiveMenu}>
//                   {renderContent()}
//                 </Layout>
//               ) : (
//                 <Navigate to="/login" />
//               )
//             }
//           />
//           <Route path="/login" element={<Login onLogin={handleLogin} />} />
//           <Route path="/signup" element={<Signup />} />
//         </Routes>

//         {/* Logout Modal */}
//         {isLogoutConfirmOpen && (
//           <LogoutConfirm
//             isOpen={isLogoutConfirmOpen}
//             onConfirm={handleLogout}
//             onCancel={() => setIsLogoutConfirmOpen(false)}
//           />
//         )}
//       </div>
//     </Router>
//   );
// }

// export default App;
