import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SubmitProject.css';

const SubmitProject = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getAuthHeaders, user } = useAuth();
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    techStack: '',
    members: '',
    githubLink: '',
    projectImage: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        projectImage: file
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      projectImage: null
    }));
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('projectImage');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add basic project data
      formDataToSend.append('name', formData.projectName);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('techStack', JSON.stringify(formData.techStack.split(',').map(tech => tech.trim())));
      formDataToSend.append('members', JSON.stringify(formData.members.split(',').map(member => member.trim())));
      formDataToSend.append('githubLink', formData.githubLink || '');
      formDataToSend.append('status', 'completed'); // Default status
      
      // Add image if selected
      if (formData.projectImage) {
        formDataToSend.append('image', formData.projectImage);
      }

      // Send to backend API with authentication
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          ...getAuthHeaders()
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit project');
      }

      const result = await response.json();
      console.log('Project submitted successfully:', result);
      
      // Reset form
      setFormData({
        projectName: '',
        description: '',
        techStack: '',
        members: '',
        githubLink: '',
        projectImage: null
      });
      setImagePreview(null);
      
      alert('Project submitted successfully! Your project is now live on the site.');
      // Navigate back to projects page
      navigate('/projects');
    } catch (error) {
      console.error('Error submitting project:', error);
      alert(`Error submitting project: ${error.message}. Please try again.`);
    }
  };

  return (
    <div className="submit-project-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/kali-logo.png" alt="Kali Logo" className="logo" />
            <span className="logo-text">KALI</span>
          </div>
          <ul className="nav-menu">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/projects" className="nav-link active">Projects</Link></li>
            <li><Link to="/team" className="nav-link">Team</Link></li>
            <li><Link to="/blogs" className="nav-link">Blogs</Link></li>
            <li><Link to="/join-us" className="nav-link">Join Us</Link></li>
          </ul>
        </div>
      </nav>

      {/* Submit Project Section */}
      <section className="submit-project-section">
        <div className="submit-project-container">
          <div className="section-header">
            <h1 className="submit-project-title">Submit Your Project</h1>
            <div className="section-divider"></div>
            <p className="submit-project-subtitle">
              Share your innovative project with the KALI community. Fill out the form below to showcase your work.
            </p>
          </div>

          <div className="form-container">
            <form className="project-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="projectName">Project Name *</label>
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  placeholder="Enter your project name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Project Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your project, its purpose, and key features"
                  rows="6"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="projectImage">Project Image</label>
                <div className="image-upload-container">
                  {!imagePreview ? (
                    <div className="image-upload-area">
                      <input
                        type="file"
                        id="projectImage"
                        name="projectImage"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="image-input"
                      />
                      <label htmlFor="projectImage" className="image-upload-label">
                        <div className="upload-icon">📷</div>
                        <div className="upload-text">
                          <span className="upload-main">Click to upload image</span>
                          <span className="upload-sub">PNG, JPG, GIF, WebP (max 5MB)</span>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="image-preview-container">
                      <img src={imagePreview} alt="Project preview" className="image-preview" />
                      <div className="image-overlay">
                        <button type="button" onClick={removeImage} className="remove-image-btn">
                          ✕ Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="techStack">Technology Stack *</label>
                <input
                  type="text"
                  id="techStack"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleInputChange}
                  placeholder="e.g., React, Node.js, MongoDB, Python (comma-separated)"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="members">Team Members *</label>
                <input
                  type="text"
                  id="members"
                  name="members"
                  value={formData.members}
                  onChange={handleInputChange}
                  placeholder="e.g., John Doe, Jane Smith, Alex Kumar (comma-separated)"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="githubLink">GitHub Repository Link</label>
                <input
                  type="url"
                  id="githubLink"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username/repository"
                />
              </div>

              <div className="form-actions">
                <Link to="/projects" className="btn-cancel">
                  Cancel
                </Link>
                <button type="submit" className="btn-submit">
                  Submit Project
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubmitProject;
