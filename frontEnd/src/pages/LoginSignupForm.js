import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import LoginImage from "../assets/images/log.svg";
import RegisterImage from "../assets/images/register.svg";
import { FaUser, FaLock, FaKey, FaEnvelope } from "react-icons/fa";

const LoginForm = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    setIsSignUpMode(true);
  };

  const handleSignInClick = () => {
    setIsSignUpMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      


    if (isSignUpMode) {
      // Handle sign up
      //console log to check if the data is being sent to the backend
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
      console.log(name, email, password);
      try {
        // Make an API call to sign up the user
        const response = await axios.post("http://localhost:4500/auth/signup", {
          name,
          email,
          password,
        });
        // Handle successful login
        console.log(response.data);

        // Redirect the user to the desired page after successful sign up
        navigate("/dashboard");
      } catch (error) {
        // Handle sign up error
        console.log(error);
      }
    } else {
      // Handle sign in

      try {
        const response = await axios.post("http://localhost:4500/auth/login", {
          username: name,
          password,
        });
        // Handle successful login
        console.log(response.data);
        onSuccess(response.data);

        // Redirect the user to the desired page after successful sign in
      } catch (error) {
        // Handle sign in error
        if (error.response && error.response.status === 401) {
          // Unauthorized: Incorrect email or password
          alert("Incorrect email or password");
        } else if (error.response && error.response.status === 400) {
          // Bad Request: Missing email or password
          alert("Please enter email and password");
          // Other error
          console.log(error);
        }

        console.log(error);
      }
    }
  };

  const onSuccess = (data) => {
    // Handle successful login
   
    console.log("User",data);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("isLoggedIn", true);

    const user = localStorage.getItem("user");
    console.log("user", user);
 alert("User signed in");
    // Redirect to Home component
    window.location.href = "/dashboard";
  };

  return (
    <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <form className="sign-in-form" onSubmit={handleSubmit}>
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <FaUser />
              <input
                type="text"
                placeholder="Enter your Email"
                name="name"
                value={name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-field">
              <FaLock />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                required
                onChange={handleInputChange}
              />
            </div>
            <input type="submit" value="Login" className="btn solid" />
          </form>

          <form className="sign-up-form" onSubmit={handleSubmit}>
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <FaUser />
              <input
                type="text"
                placeholder="Username"
                name="name"
                required
                value={name}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-field">
              <FaEnvelope />
              <input
                type="email"
                placeholder="Email"
                name="email"
                required
                value={email}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-field">
              <FaKey />
              <input
                type="password"
                required
                placeholder="Password"
                name="password"
                value={password}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-field">
              <FaKey />
              <input
                type="password"
                required
                placeholder="Confirm Password"
                name="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <input type="submit" className="btn" value="Sign up" />
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis,
              ex ratione. Aliquid!
            </p>
            <button className="btn transparent" onClick={handleSignUpClick}>
              Sign up
            </button>
          </div>
          <img src={LoginImage} className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us?</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
              laboriosam ad deleniti.
            </p>
            <button className="btn transparent" onClick={handleSignInClick}>
              Sign in
            </button>
          </div>
          <img src={RegisterImage} className="image" alt="" />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
