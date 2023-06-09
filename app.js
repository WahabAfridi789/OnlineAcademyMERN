// app.js
const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cors = require("cors");
const helmet = require("helmet");

const mongoose = require("mongoose");

const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const shoppingCartRoutes = require("./routes/shoppingCartRoutes");
const authRoutes = require("./routes/auth");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(
  session({
    store: new FileStore(),
    secret: "keyboard-cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 36000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser((jwtPayload, done) => {
  if (jwtPayload && jwtPayload.userId) {
    User.findById(jwtPayload.userId, (err, user) => {
      done(err, user);
    });
  } else {
    done(null, false);
  }
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, "your-secret-key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.userId = decoded.userId;
    next();
  });
};



const connection = mongoose.connect("mongodb://0.0.0.0:27017/tuitionAcademy", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
connection.then(
  (db) => {
    console.log("Connected correctly to MongoDB");
  },
  (err) => {
    console.log(err);
  }
);

// Teacher Route
app.use("/teachers", verifyToken, teacherRoutes);

// Teacher Endpoints (CRUD)
// POST=>  /teachers
// {
//   "name": "Humaira Waqas",
//   "email": "humairawaqas@example",
//   "subject": "TSE"
// }

//get=> /teachers
//get=> /teachers/:id
//put=> /teachers/:id
//delete=> /teachers/:id

// Student Route
app.use("/students", verifyToken,studentRoutes);

// Student Endpoints (CRUD)
// POST=>  /students
// {
//   "name": "Abdul Wahab",
//   "email": "abdulwahab@example",
//   "grade": 10,
//   "teacherId": "12345"
// }

//get=> /students
//get=> /students/:id
//put=> /students/:id
//delete=> /students/:id

// ShoppingCart Route
app.use("/shoppingCart", shoppingCartRoutes);

// ShoppingCart Endpoints
// POST=>  /shoppingCart/setItemdetails
// {
//   "itemNumber": "ABC123",
//   "quantity": 2
// }

app.use("/auth", authRoutes);

app.listen(4500, () => {
  console.log("Server started on port 4500");
});
