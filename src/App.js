import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Loginn.js';
import Register from './Register.js';
import Dashboard from './Dashboard.js';
import NavBar from './NavBar.js';
import CreateProject from './CreateProject.js';
import ProjectDetail from './ProjectDetail.js';
import EditProject from './EditProject'; 
import './App.css';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/edit-project/:id" element={<EditProject />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
