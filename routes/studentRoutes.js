const express = require("express");
const router = express.Router();
const Student = require("../models/student");
const Teacher = require("../models/teacher");

// Get all students
router.get("/", (req, res) => {
  console.log("Student Get ALl Student Rout Called")
  Student.find()
    .populate("teachers")
    .then((students) => res.json(students))
    .catch((err) => res.status(500).json({ error: err.message }));
});

//Count all students

router.get("/count", (req, res) => {
  Student.countDocuments()
    .then((count) => {
      res.json({ count });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "An error occurred while counting teachers" });
    });
});

     

// Get a specific student
router.get("/:id", (req, res) => {
  const { id } = req.params;

  Student.findById(id)
    .populate("teachers")
    .then((student) => res.json(student))
    .catch((err) => res.status(404).json({ error: "Student not found" }));
});

// Create a new student
router.post("/", (req, res) => {
  console.log("AddStudent In Route called")
  const { name, email, grade, teacherId } = req.body;
  const newStudent = new Student({ name, email, grade });

  Teacher.findById(teacherId)
    .then((teacher) => {
      if (!teacher) {
        throw new Error("Teacher not found");
      }
      newStudent.teachers.push(teacher);
      teacher.students.push(newStudent);
      return Promise.all([newStudent.save(), teacher.save()]);
    })
    .then(([student, teacher]) => res.status(201).json(student))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Update a student's details
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, grade, teacherId } = req.body;

  Promise.all([
    Student.findByIdAndUpdate(id, { name, email, grade }, { new: true }),
    Teacher.findById(teacherId),
  ])
    .then(([student, teacher]) => {
      if (!student) {
        throw new Error("Student not found");
      }
      if (!teacher) {
        throw new Error("Teacher not found");
      }

      student.teachers = [teacher];
      teacher.students.push(student);

      return Promise.all([student.save(), teacher.save()]);
    })
    .then(([student, teacher]) => res.json(student))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Update a student's details partially
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, grade, teacherId } = req.body;

  Promise.all([
    Student.findByIdAndUpdate(
      id,
      { $set: { name, email, grade } },
      { new: true }
    ),
    Teacher.findById(teacherId),
  ])
    .then(([student, teacher]) => {
      if (!student) {
        throw new Error("Student not found");
      }
      if (!teacher) {
        throw new Error("Teacher not found");
      }

      student.teachers = [teacher];
      teacher.students.push(student);

      return Promise.all([student.save(), teacher.save()]);
    })
    .then(([student, teacher]) => res.json(student))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Delete a student
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Student.findByIdAndDelete(id)
    .then(() => res.sendStatus(204))
    .catch((err) => res.status(400).json({ error: err.message }));
});

module.exports = router;
