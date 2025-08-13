const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

let projects = [];
let projectIdCounter = 1;
let activityIdCounter = 1;

// Get all projects
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

// Create a new project
app.post('/api/projects', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Project name is required' });
  }
  const newProject = {
    id: projectIdCounter++,
    name,
    activities: []
  };
  projects.push(newProject);
  res.status(201).json(newProject);
});

// Add an activity to a project
app.post('/api/projects/:projectId/activities', (req, res) => {
  const projectId = parseInt(req.params.projectId, 10);
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Activity name is required' });
  }

  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const newActivity = {
    id: activityIdCounter++,
    name
  };

  project.activities.push(newActivity);
  res.status(201).json(newActivity);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
