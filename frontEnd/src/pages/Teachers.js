import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");

  const [editTeacher, setEditTeacher] = useState({});
  const [editModal, setEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editSubject, setEditSubject] = useState("");

  useEffect(() => {
    fetchTeachers();
  }, []);

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

  const deleteTeacher = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:4500/teachers/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Teacher deleted successfully");
      }
      fetchTeachers();
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const addTeacher = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4500/teachers",
        {
          name,
          email,
          subject,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 201) {
        alert("Teacher added successfully");
        closeModal();
        fetchTeachers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openEditModal = (teacher) => {
    setEditTeacher(teacher);
    setEditName(teacher.name);
    setEditEmail(teacher.email);
    setEditSubject(teacher.subject);
    setEditModal(true);
  };

  const closeEditModal = () => {
    setEditModal(false);
  };

  const updateTeacher = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:4500/teachers/${editTeacher._id}`,
        {
          name: editName,
          email: editEmail,
          subject: editSubject,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Teacher updated successfully");
        closeEditModal();
        fetchTeachers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="teacherPage">
      <h2 className="page-header">Teacher Data</h2>
      <table className="teacher-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher._id}>
              <td>{teacher.name}</td>
              <td>{teacher.email}</td>
              <td>{teacher.subject}</td>
              <td className="action-column">
                <FaEdit
                  className="edit-icon"
                  onClick={() => openEditModal(teacher)}
                />
                <FaTrash
                  onClick={() => deleteTeacher(teacher._id)}
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
          onClick={openModal}
        >
          Add Teacher
        </button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>Add Teacher</h2>
            <form onSubmit={addTeacher}>
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
                Subject:
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Add Teacher</button>
              <button type="button" onClick={closeModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {editModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeEditModal}>
              &times;
            </span>
            <h2>Edit Teacher</h2>
            <form onSubmit={updateTeacher}>
              <label>
                Name:
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                Subject:
                <input
                  type="text"
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Update Teacher</button>
              <button type="button" onClick={closeEditModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;
