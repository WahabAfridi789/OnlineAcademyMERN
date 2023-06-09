import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [userName, setUserName] = useState("");

  const user = localStorage.getItem("user");
  
  const userObj = JSON.parse(user);
  
  const { name } = userObj;
  
  console.log("user", userObj);
  console.log("name", name);
  

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4500/teachers/count", {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log("token", token);

      setTeacherCount(response.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4500/students/count", {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log("token", token);
      
      setStudentCount(response.data.count);
    } catch (error) {
      console.log(error);
    }
  };
  
 
  return (
    <>
      <h2>Welcome to the Dashboard, 
        <span
          style={{
            color: "blue",
            textTransform: "uppercase",
            textDecoration: "underline",
            border: "1px solid black",
            padding: "5px",
            borderRadius: "10px",
            marginLeft: "10px",
          }}
        >
          {name}!
      </span>
        </h2>
      <div className="card-container">
        <div className="card">
          <h3>Total Teachers</h3>
          <p>{teacherCount}</p>
        </div>
        <div className="card">
          <h3>Total Students</h3>
          <p>{studentCount}</p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
