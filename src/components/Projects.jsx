import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Projects.css';
import ParticleSystem from './ParticleSystem';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/projects');
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const result = await response.json();
      console.log('Projects data received:', result.data); // Debug log
      setProjects(result.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return 'completed';
      case 'in progress':
        return 'in-progress';
      case 'planning':
        return 'planning';
      default:
        return 'completed';
    }
  };

  return (
    <div className="projects-page">
      {/* Animated Particles Background */}
      <ParticleSystem />
      
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/kali-logo.png" alt="KALI Club" className="logo" />
            <span className="logo-text">KALI</span>
          </div>
          <ul className="nav-menu">
            <li><Link to="/" className="nav-link">HOME</Link></li>
            <li><Link to="/projects" className="nav-link active">PROJECTS</Link></li>
            <li><Link to="/team" className="nav-link">TEAM</Link></li>
            <li><Link to="/blogs" className="nav-link">BLOGS</Link></li>
            <li><Link to="/profile" className="nav-link">PROFILE</Link></li>
            <li><Link to="/join-us" className="nav-link">JOIN US</Link></li>
          </ul>
        </div>
      </nav>

      {/* Projects Section */}
      <section className="projects-section">
        <div className="projects-container">
          <div className="section-header">
            <h1 className="projects-main-title">Our Projects</h1>
            <div className="section-divider"></div>
            <p className="projects-subtitle">
              Innovative AI/ML solutions developed by our talented team members
            </p>
          </div>

          {/* Projects Grid */}
          <div className="projects-grid">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading projects...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <p className="error-message">Error loading projects: {error}</p>
                <button className="retry-button" onClick={fetchProjects}>
                  Retry
                </button>
              </div>
            ) : (
              <>
                {projects.map((project) => (
                  <div key={project._id} className="project-card">
                    <div className="project-image">
                      <img 
                        src={project.image.startsWith('/uploads') 
                          ? `http://localhost:5000${project.image}` 
                          : project.image
                        } 
                        alt={project.title} 
                        className="project-img" 
                        onError={(e) => {
                          e.target.src = '/smartdoorguard.jpg'; // Fallback image
                        }}
                      />
                      <div className="project-overlay">
                        <div className={`project-status ${getStatusClass(project.status)}`}>
                          {project.status}
                        </div>
                      </div>
                    </div>
                    <div className="project-content">
                      <h3 className="project-name">{project.title}</h3>
                      <p className="project-description">
                        {project.description}
                      </p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="project-tech-stack">
                          {project.technologies.map((tech, index) => (
                            <span key={index} className="tech-tag">{tech}</span>
                          ))}
                        </div>
                      )}
                      {project.teamMembers && project.teamMembers.length > 0 && (
                        <p className="project-team-members">
                          <strong>Team:</strong> {project.teamMembers.map((member, index) => 
                            typeof member === 'string' ? member : member.name || member
                          ).join(', ')}
                        </p>
                      )}
                      <div className="project-links">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                            🔗 GitHub
                          </a>
                        )}
                        {project.demoUrl && (
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                            🚀 Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Project Card */}
                <div className="add-project-card">
                  <div className="add-project-content">
                    <div className="add-project-icon">➕</div>
                    <h3 className="add-project-title">Add New Project</h3>
                    <p className="add-project-description">
                      Share your innovative project with the community. Click to submit your work and showcase your skills.
                    </p>
                    <Link to="/submit-project" className="add-project-btn">
                      Submit Project
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
