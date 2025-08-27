# Frontend-Backend Integration Guide

This guide explains how to connect your React frontend with the Node.js/Express backend without disturbing your existing frontend code.

## Backend Overview

Your backend is now running on `http://localhost:5000` with the following API endpoints:

### 📋 Available API Endpoints

#### Health Check
- `GET /api/health` - Server status

#### Team Management
- `GET /api/team` - Get all team members
- `GET /api/team/:id` - Get specific team member
- `POST /api/team` - Add new team member

#### Project Management  
- `GET /api/projects` - Get all projects (supports filtering by `category`, `status`)
- `GET /api/projects/:id` - Get specific project
- `GET /api/projects/meta/categories` - Get all project categories
- `POST /api/projects` - Add new project

#### Blog Management
- `GET /api/blogs` - Get all blog posts (supports `page`, `limit`, `category`, `tag`, `featured`)
- `GET /api/blogs/:slug` - Get specific blog post by slug
- `GET /api/blogs/meta/categories` - Get all blog categories
- `GET /api/blogs/meta/tags` - Get all blog tags

#### Contact System
- `POST /api/contact` - Submit contact form
- `GET /api/contact/info` - Get contact information
- `GET /api/contact/submissions` - Get all submissions (admin)
- `PATCH /api/contact/submissions/:id` - Update submission status

## 🚀 Integration Steps

### Step 1: Install API Service
Copy the provided `apiService.js` to your frontend `src` directory:

```
src/
  api/
    apiService.js  <- Copy this file here
```

### Step 2: Update Your Frontend Components

#### Example: Update Team Component
```jsx
// src/components/Team.jsx
import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';

function Team() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTeam() {
      try {
        setLoading(true);
        const response = await apiService.getAllTeamMembers();
        setTeamMembers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTeam();
  }, []);

  if (loading) return <div>Loading team members...</div>;
  if (error) return <div>Error loading team: {error}</div>;

  return (
    <div className="team-section">
      {teamMembers.map(member => (
        <div key={member.id} className="team-member">
          <img src={member.image} alt={member.name} />
          <h3>{member.name}</h3>
          <p>{member.role}</p>
          <p>{member.bio}</p>
          <div className="skills">
            {member.skills.map(skill => (
              <span key={skill} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Team;
```

#### Example: Update Projects Component
```jsx
// src/components/Projects.jsx
import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsResponse, categoriesResponse] = await Promise.all([
          apiService.getAllProjects(),
          apiService.getProjectCategories()
        ]);
        
        setProjects(projectsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleCategoryFilter = async (category) => {
    setSelectedCategory(category);
    try {
      const response = await apiService.getAllProjects({ 
        category: category || undefined 
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to filter projects:', error);
    }
  };

  return (
    <div className="projects-section">
      <div className="filter-buttons">
        <button onClick={() => handleCategoryFilter('')}>All</button>
        {categories.map(category => (
          <button 
            key={category} 
            onClick={() => handleCategoryFilter(category)}
            className={selectedCategory === category ? 'active' : ''}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <img src={project.image} alt={project.title} />
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="tech-stack">
              {project.technologies.map(tech => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
            <div className="project-links">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  Demo
                </a>
              )}
            </div>
            <span className={`status ${project.status.toLowerCase()}`}>
              {project.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
```

#### Example: Update Contact Form
```jsx
// src/components/JoinUs.jsx (or Contact form component)
import React, { useState } from 'react';
import apiService from '../api/apiService';

function JoinUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await apiService.submitContactForm(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '', phone: '' });
      alert(response.message); // Show success message
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-section">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleInputChange}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number (Optional)"
          value={formData.phone}
          onChange={handleInputChange}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleInputChange}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Sending...' : 'Send Message'}
        </button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}

export default JoinUs;
```

### Step 3: Environment Configuration

Create a `.env` file in your frontend root (if not exists):

```bash
# Frontend .env file
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4: Update Package.json (Optional)
Add a proxy to your frontend package.json to avoid CORS issues during development:

```json
{
  "name": "kali-website",
  "proxy": "http://localhost:5000",
  // ... rest of your package.json
}
```

## 🔧 Running Both Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Backend runs on: `http://localhost:5000`

### Terminal 2 - Frontend  
```bash
cd ../
npm run dev
```
Frontend runs on: `http://localhost:5173` (or another port)

## 📝 Sample Data Available

Your backend comes pre-loaded with sample data:

### Team Members (3 members)
- John Doe (Team Lead)
- Jane Smith (Frontend Developer)  
- Mike Johnson (Backend Developer)

### Projects (3 projects)
- Smart Door Guard
- Cybersecurity Dashboard
- Penetration Testing Toolkit

### Blog Posts (3 posts)
- Getting Started with Ethical Hacking
- Advanced Penetration Testing Techniques
- Building Secure Web Applications

## 🛠 Testing Your Integration

1. **Test API directly**: Open the `backend/api-tester.html` file in your browser
2. **Check network tab**: Use browser dev tools to see API calls
3. **Backend logs**: Check terminal running the backend for request logs

## 🔮 Future Enhancements

The backend is designed to be easily extensible:

- **Database**: Add MongoDB/PostgreSQL
- **Authentication**: JWT-based auth system
- **File Uploads**: Image handling for projects/team
- **Email**: SMTP integration for contact forms
- **Admin Panel**: CRUD operations interface
- **Search**: Full-text search capabilities
- **Caching**: Redis for performance
- **Documentation**: Swagger/OpenAPI docs

## 🚨 Important Notes

1. **CORS**: Backend is configured to accept requests from `http://localhost:5173`
2. **Sample Data**: All data is stored in memory (resets on server restart)
3. **No Authentication**: All endpoints are public (add auth as needed)
4. **Error Handling**: Frontend should handle API errors gracefully
5. **Environment**: Use environment variables for different deployments

Your frontend will continue to work exactly as before, but now it can fetch real data from your backend API!
