import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [teacherId, setTeacherId] = useState("");

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4500/students", {
        headers: {
          Authorization: `${token}`,
        },
      });
      setStudents(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4500/teachers", {
        headers: {
          Authorization: `${token}`,
        },
      });
      setTeachers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:4500/students/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Student deleted successfully");
      }
      fetchStudents();
    } catch (error) {
      console.log(error);
    }
  };

  const openAddModal = () => {
    setShowModal(true);
  };

  const closeAddModal = () => {
    setShowModal(false);
  };

  const openUpdateModal = (student) => {
    setSelectedStudent(student);
    setName(student.name);
    setEmail(student.email);
    setGrade(student.grade);
    setTeacherId(student.teacherId);
    setUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setSelectedStudent(null);
    setName("");
    setEmail("");
    setGrade("");
    setTeacherId("");
    setUpdateModal(false);
  };

  const addStudent = async (e) => {
    e.preventDefault();
    const foundTeacher = teachers.find((teacher) => teacher._id === teacherId);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4500/students",
        {
          name,
          email,
          grade,
          teacherId: foundTeacher._id,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 201) {
        alert("Student added successfully");
        closeAddModal();
        fetchStudents();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateStudent = async () => {
    const foundTeacher = teachers.find((teacher) => teacher._id === teacherId);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:4500/students/${selectedStudent._id}`,
        {
          name,
          email,
          grade,
          teacherId: foundTeacher._id,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Student updated successfully");
        closeUpdateModal();
        fetchStudents();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="teacherPage">
      <h2 className="page-header">Students Data</h2>
      <table className="teacher-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Grade</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.grade}</td>
              <td className="action-column">
                <FaEdit
                  className="edit-icon"
                  onClick={() => openUpdateModal(student)}
                />
                <FaTrash
                  onClick={() => deleteStudent(student._id)}
                  className="delete-icon"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        className="btnContainer"
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <button
          style={{
            backgroundColor: "green",
          }}
          className="btn"
          onClick={openAddModal}
        >
          Add Student
        </button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeAddModal}>
              &times;
            </span>
            <h2>Add Student</h2>
            <form onSubmit={addStudent}>
              <label>
                Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                Grade:
                <input
                  type="number"
                  min={0}
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  required
                />
              </label>
              <label>
                Teacher:
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="teacher-select"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit">Add Student</button>
              <button type="button" onClick={closeAddModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {updateModal && selectedStudent && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeUpdateModal}>
              &times;
            </span>
            <h2>Edit Student</h2>
            <form onSubmit={updateStudent}>
              <label>
                Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                Grade:
                <input
                  type="number"
                  min={0}
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  required
                />
              </label>
              <label>
                Teacher:
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="teacher-select"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit">Update Student</button>
              <button type="button" onClick={closeUpdateModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
