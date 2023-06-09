import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginSignUpForm from "./pages/LoginSignupForm.js";
import Dashboard from "./pages/dashboard.js";
import Teachers from "./pages/Teachers.js";
import Layout from "./layout/layout.js"; 
import Students from "./pages/Students.js"


import "./index.css";

const App = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const PrivateRoute = ({ element: Element, ...rest }) => {
    return isLoggedIn ? (
      <Layout>
        <Element {...rest} />
      </Layout>
    ) : (
      <Navigate to="/" replace={true} />
    );
  };

  const PublicRoute = ({ element: Element, ...rest }) => {
    return isLoggedIn ? (
      <Navigate to="/dashboard" replace={true} />
    ) : (
     
      <Element {...rest} />
    
    );
  };

  return (
    <Router>
      <div className="page">
        <Routes>
          <Route path="/" element={<PublicRoute element={LoginSignUpForm} />} />
          <Route
            path="/dashboard"
            element={<PrivateRoute element={Dashboard} />}
          />
          <Route
            path="/teachers"
            element={<PrivateRoute element={Teachers} />}
          />

          <Route
            path="/students"
            element={<PrivateRoute element={Students} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
