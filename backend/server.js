const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'milestone_mate'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database');
  }
});

app.get('/', (req, res) => {
  res.send('Hello, your server is running!');
});

// API endpoints

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      res.status(500).send('Error querying database');
    } else if (results.length > 0) {
      res.status(200).json({ token: 'example-token' });
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

// Register endpoint
app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body;

  const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
  db.query(query, [email, password], (err, result) => {
    if (err) {
      res.status(500).send('Error creating account');
    } else {
      res.status(201).send('Account created');
    }
  });
});

// Create project
app.post('/api/projects', async (req, res) => {
  const { projectName, description, startDate, endDate } = req.body;
  try {
    const [result] = await db.promise().execute(
      'INSERT INTO projects (projectName, description, startDate, endDate) VALUES (?, ?, ?, ?)',
      [projectName, description, startDate, endDate]
    );
    if (result.affectedRows > 0) {
      res.status(201).json({ id: result.insertId, projectName, description, startDate, endDate });
    } else {
      res.status(500).json({ error: 'Error creating project', details: 'No rows affected' });
    }
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Error creating project', details: error.message });
  }
});

// Fetch all projects
app.get('/api/projects', async (req, res) => {
  try {
    const [projects] = await db.promise().execute('SELECT * FROM projects');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching projects' });
  }
});

// Fetch project by ID
app.get('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.promise().execute('SELECT * FROM projects WHERE id = ?', [id]);
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Error fetching project', details: error.message });
  }
});

// Delete a project
app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.promise().execute('DELETE FROM projects WHERE id = ?', [id]);
    if (result.affectedRows > 0) {
      res.status(204).send(); // No content
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting project' });
  }
});

// Update a project
app.put('/api/projects/:id', async (req, res) => {
  console.log('PUT request received for updating project');
  const { id } = req.params;
  const { projectName, description, startDate, endDate } = req.body;
  console.log('Updating project with id:', id);
  try {
    const [result] = await db.promise().execute(
      'UPDATE projects SET projectName = ?, description = ?, startDate = ?, endDate = ? WHERE id = ?',
      [projectName, description, startDate, endDate, id]
    );
    if (result.affectedRows > 0) {
      res.status(200).json({ id, projectName, description, startDate, endDate });
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Error updating project', details: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

