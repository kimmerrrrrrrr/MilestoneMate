import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css'; // Ensure this line is present

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`);
      fetchProjects(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div className="dashboard">
      <h2>Project Dashboard</h2>
      <Link to="/create-project" className="btn-add-project">Add New Project</Link>
      <div className="project-list">
        {projects.map((project) => (
          <div key={project.id} className="project-item">
            <h3>Project Name: {project.projectName}</h3>
            <Link to={`/projects/${project.id}`} className="btn-view-project">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;



