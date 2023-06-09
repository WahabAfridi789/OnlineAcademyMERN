import React from "react";
import { Link } from "react-router-dom";

import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaSignOutAlt,
  FaHome,
} from "react-icons/fa";

const Sidebar = () => {
  const handleLogout = () => {
    // Clear local storage and redirect to the login/signup form
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/";
  };
  return (
    <div className="sidebar">
      <div className="sidebar-item">
        <FaHome className="sidebar-icon" />
        <Link to="/dashboard">Dashboard</Link>
      </div>
      <div className="sidebar-item">
        <FaChalkboardTeacher className="sidebar-icon" />
        <Link to="/teachers">Teachers</Link>
      </div>
      <div className="sidebar-item">
        <FaUserGraduate className="sidebar-icon" />
        <Link to="/students">Students</Link>
      </div>
      <div className="sidebar-item logout">
        <button className="btn" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
