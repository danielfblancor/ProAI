document.addEventListener('DOMContentLoaded', () => {
  const newProjectForm = document.getElementById('new-project-form');
  const projectNameInput = document.getElementById('project-name');
  const projectsList = document.getElementById('projects-list');

  const API_URL = '/api/projects';

  // Fetch and display all projects
  async function fetchProjects() {
    try {
      const response = await fetch(API_URL);
      const projects = await response.json();
      renderProjects(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }

  // Render projects on the page
  function renderProjects(projects) {
    projectsList.innerHTML = '';
    projects.forEach(project => {
      const projectElement = document.createElement('div');
      projectElement.classList.add('project');
      projectElement.innerHTML = `
        <h3>${project.name} (ID: ${project.id})</h3>
        <ul class="activities-list" id="activities-list-${project.id}"></ul>
        <form class="activity-form" data-project-id="${project.id}">
          <input type="text" class="activity-name" placeholder="Enter activity name" required>
          <button type="submit">Add Activity</button>
        </form>
      `;
      projectsList.appendChild(projectElement);
      renderActivities(project.id, project.activities);
    });
  }

  // Render activities for a project
  function renderActivities(projectId, activities) {
    const activitiesList = document.getElementById(`activities-list-${projectId}`);
    activitiesList.innerHTML = '';
    activities.forEach(activity => {
      const activityElement = document.createElement('li');
      activityElement.textContent = activity.name;
      activitiesList.appendChild(activityElement);
    });
  }

  // Handle new project form submission
  newProjectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const projectName = projectNameInput.value.trim();
    if (projectName) {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: projectName }),
        });
        if (response.ok) {
          projectNameInput.value = '';
          fetchProjects();
        } else {
          console.error('Failed to create project');
        }
      } catch (error) {
        console.error('Error creating project:', error);
      }
    }
  });

  // Handle new activity form submission using event delegation
  projectsList.addEventListener('submit', async (e) => {
    if (e.target.classList.contains('activity-form')) {
      e.preventDefault();
      const projectId = e.target.dataset.projectId;
      const activityNameInput = e.target.querySelector('.activity-name');
      const activityName = activityNameInput.value.trim();

      if (activityName) {
        try {
          const response = await fetch(`${API_URL}/${projectId}/activities`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: activityName }),
          });
          if (response.ok) {
            activityNameInput.value = '';
            fetchProjects();
          } else {
            console.error('Failed to create activity');
          }
        } catch (error) {
          console.error('Error creating activity:', error);
        }
      }
    }
  });

  // Initial fetch of projects
  fetchProjects();
});
