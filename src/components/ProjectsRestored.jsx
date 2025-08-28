import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    teamMembers: '',
    githubUrl: ''
  });

  // Fetch projects from database
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URI}projects`);
      const result = await response.json();
      
      if (result.status === 'success' && result.data) {
        setProjects(result.data);
        setError(null);
      } else {
        setError('No projects found');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const submitProject = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URI}projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          technologies: formData.technologies.split(',').map(t => t.trim()),
          teamMembers: formData.teamMembers.split(',').map(t => t.trim()),
          links: { github: formData.githubUrl },
          status: 'Planning'
        })
      });
      
      if (response.ok) {
        alert('Project submitted successfully!');
        setFormData({ title: '', description: '', technologies: '', teamMembers: '', githubUrl: '' });
        setShowForm(false);
        fetchProjects();
      }
    } catch (error) {
      alert('Error submitting project');
    }
  };

  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      'Completed': 'completed',
      'In Progress': 'in-progress',
      'Planning': 'planning',
      'Deployed': 'deployed',
      'Research': 'research'
    };
    return statusClasses[status] || 'completed';
  };

  const renderProjectCard = (project) => (
    <div key={project._id} className="project-card">
      <div className="project-image">
        <img 
          src={project.imageUrl || "/project-placeholder.jpg"} 
          alt={project.title} 
          className="project-img" 
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
          {project.shortDescription || project.description}
        </p>
        
        <div className="project-tech-stack">
          {project.technologies?.slice(0, 4).map((tech, index) => (
            <span key={index} className="tech-tag">{tech}</span>
          ))}
          {project.technologies?.length > 4 && (
            <span className="tech-tag">+{project.technologies.length - 4} more</span>
          )}
        </div>
        
        <div className="project-members">
          <h4 className="members-title">Team Members</h4>
          <div className="members-list">
            {project.teamMembers?.map((member, index) => (
              <div key={index} className="tech-tag">
                <span>{member}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="project-links">
          {project.links?.github && (
            <a href={project.links.github} className="project-link github-link" target="_blank" rel="noopener noreferrer">
              <span>🔗 GitHub</span>
            </a>
          )}
          {project.links?.live && (
            <a href={project.links.live} className="project-link demo-link" target="_blank" rel="noopener noreferrer">
              <span>🚀 Live Demo</span>
            </a>
          )}
          {project.links?.researchPaper && (
            <a href={project.links.researchPaper} className="project-link paper-link" target="_blank" rel="noopener noreferrer">
              <span>📑 Research Paper</span>
            </a>
          )}
        </div>

        {project.startDate && (
          <div className="project-timeline">
            <span className="timeline-text">
              {formatDate(project.startDate)}
              {project.endDate && ` - ${formatDate(project.endDate)}`}
            </span>
          </div>
        )}

        {project.achievements && project.achievements.length > 0 && (
          <div className="project-achievements">
            <h4 className="achievements-title">Achievements</h4>
            <div className="achievements-list">
              {project.achievements.slice(0, 2).map((achievement, index) => (
                <span key={index} className="achievement-tag">{achievement}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="projects-page">
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
                <p className="error-message">{error}</p>
                <button onClick={fetchProjects} className="retry-button">Retry</button>
              </div>
            ) : (
              <>
                {/* Dynamic Projects from Database */}
                {projects.map(project => renderProjectCard(project))}

                {/* Add New Project Card */}
                <div className="project-card add-project-card">
                  <div className="add-project-content">
                    <div className="add-project-icon">➕</div>
                    <h3 className="add-project-title">Add New Project</h3>
                    <p className="add-project-description">
                      Have an innovative AI/ML project idea? Submit your project proposal and showcase your work!
                    </p>
                    <button className="add-project-btn" onClick={openForm}>
                      <span>Submit Project</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Project Submission Form Modal */}
      {showForm && (
        <div className="form-modal-overlay">
          <div className="form-modal">
            <div className="form-modal-header">
              <h2>Submit New Project</h2>
              <button onClick={closeForm} className="close-btn">✕</button>
            </div>
            
            <form onSubmit={submitProject} className="project-form">
              <div className="form-group">
                <label>Project Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="Enter project title"
                />
              </div>
              
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  placeholder="Describe your project"
                  rows={4}
                />
              </div>
              
              <div className="form-group">
                <label>Technologies (comma-separated) *</label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                  placeholder="Python, React, MongoDB, etc."
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Team Members (comma-separated) *</label>
                <input
                  type="text"
                  value={formData.teamMembers}
                  onChange={(e) => setFormData({...formData, teamMembers: e.target.value})}
                  placeholder="John Doe, Jane Smith, etc."
                  required
                />
              </div>
              
              <div className="form-group">
                <label>GitHub URL</label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                  placeholder="https://github.com/username/project"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={closeForm} className="btn-cancel">Cancel</button>
                <button type="submit" className="btn-submit">Submit Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
