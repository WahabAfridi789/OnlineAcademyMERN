const express = require("express");
const router = express.Router();
const Teacher = require("../models/teacher");
const Student = require("../models/student");

// Get all teachers
router.get("/", (req, res) => {
  Teacher.find()
    .populate("students")
    .then((teachers) => res.json(teachers))
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.get("/count", (req, res) => {
  Teacher.countDocuments()
    .then((count) => {
      res.json({ count });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "An error occurred while counting teachers" });
    });
});




// Get a specific teacher
router.get("/:id", (req, res) => {
  console.log("GET TEACHER ID")
  const { id } = req.params;


  Teacher.findById(id)
    .populate("students")
    .then((teacher) => res.json(teacher))
    .catch((err) => res.status(404).json({ error: "Teacher not found" }));
});

// Create a new teacher
router.post("/", (req, res) => {
  console.log("POST TEACHER")
  console.log(req.body)
  const { name, email, subject } = req.body;
  const newTeacher = new Teacher({ name, email, subject });

  newTeacher
    .save()
    .then((teacher) => res.status(201).json(teacher))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Update a teacher's details
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, subject } = req.body;

  Teacher.findByIdAndUpdate(id, { name, email, subject }, { new: true })
    .then((teacher) => res.json(teacher))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Update a teacher's details partially
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, subject } = req.body;

  Teacher.findByIdAndUpdate(
    id,
    { $set: { name, email, subject } },
    { new: true }
  )
    .then((teacher) => res.json(teacher))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Delete a teacher
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Teacher.findByIdAndDelete(id)
    .then((teacher) => res.json(teacher))
    .catch((err) => res.status(400).json({ error: err.message }));
});



module.exports = router;
