const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// POST /auth/signup
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  User.register(new User({ username: email, name, email }), password, (err) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Error occurred while signing up" });
    }
    res.json({ message: "Signup successful" });
  });
});

// POST /auth/login
router.post("/login", (req, res, next) => {
  console.log("LOGIN")
  if (req.isAuthenticated()) {
    return res.json({ message: "You are already logged in" });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Error occurred while logging in" });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Error occurred while logging in" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, "your-secret-key", {
        expiresIn: "1h",
      });

      

      res.json({
        message: "Login successful", token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
          });
    });
  })(req, res, next);
});


// GET /auth/logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      router.post("/login", (req, res, next) => {
        if (req.isAuthenticated()) {
          return res.json({ message: "You are already logged in" });
        }

        passport.authenticate("local", (err, user, info) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ message: "Error occurred while logging in" });
          }

          if (!user) {
            return res
              .status(401)
              .json({ message: "Invalid email or password" });
          }

          req.logIn(user, (err) => {
            if (err) {
              console.error(err);
              return res
                .status(500)
                .json({ message: "Error occurred while logging in" });
            }

            res.json({ message: "Login successful" });
          });
        })(req, res, next);
      });

      console.error(err);
      return res
        .status(500)
        .json({ message: "Error occurred while logging out" });
    }
    res.json({ message: "Logout successful" });
  });
});

module.exports = router;
