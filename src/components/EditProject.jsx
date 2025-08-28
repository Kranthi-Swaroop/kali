import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SubmitProject.css'; // Reuse the same styling

const EditProject = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    if (user) { // Only fetch when user is available
      fetchProjectData();
    }
  }, [isAuthenticated, navigate, id, user]); // Added user as dependency

  const fetchProjectData = async () => {
    if (!user) {
      console.log('User not loaded yet, waiting...');
      return;
    }

    try {
      console.log('Fetching project with ID:', id);
      console.log('Auth headers:', getAuthHeaders());
      console.log('Current user:', user);
      
      const response = await fetch(`${import.meta.env.VITE_API_URI}projects/${id}`, {
        headers: getAuthHeaders()
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to fetch project data: ${response.status}`);
      }

      const result = await response.json();
      console.log('Response data:', result);
      const project = result.data;

      if (!project) {
        throw new Error('Project not found');
      }
      
      // Check if user owns this project
      if (project.createdBy && project.createdBy._id !== user._id) {
        setError('You can only edit your own projects');
        setLoading(false);
        return;
      }

      // Populate form with existing data
      setFormData({
        projectName: project.name || '',
        description: project.description || '',
        techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : '',
        members: Array.isArray(project.members) ? project.members.join(', ') : '',
        githubLink: project.githubLink || '',
        projectImage: null // Will be set only if user uploads new image
      });

      if (project.image) {
        setExistingImageUrl(project.image);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to load project data');
      setLoading(false);
    }
  };

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
    setExistingImageUrl(null);
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
      
      // Add new image if selected
      if (formData.projectImage) {
        formDataToSend.append('image', formData.projectImage);
      }

      // Log what we're sending
      console.log('Sending project update:', {
        name: formData.projectName,
        description: formData.description,
        techStack: formData.techStack,
        members: formData.members,
        githubLink: formData.githubLink,
        hasImage: !!formData.projectImage
      });

      // Send to backend API with authentication
      const headers = getAuthHeaders();
      // Remove Content-Type header to let browser set it with boundary for FormData
      delete headers['Content-Type'];
      
      const response = await fetch(`${import.meta.env.VITE_API_URI}projects/${id}`, {
        method: 'PUT',
        headers: headers,
        body: formDataToSend
      });

      console.log('Update response status:', response.status);
      const responseData = await response.json();
      console.log('Update response data:', responseData);

      if (response.ok) {
        alert('Project updated successfully!');
        // Navigate with a timestamp to force refresh
        navigate(`/profile?updated=${Date.now()}`);
      } else {
        throw new Error(responseData.message || 'Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Error updating project: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="submit-project-container">
        <div className="loading">Loading project data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="submit-project-container">
        <div className="error-message">{error}</div>
        <Link to="/profile" className="back-link">← Back to Profile</Link>
      </div>
    );
  }

  return (
    <div className="submit-project-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/kali-logo.png" alt="KALI Club" className="logo" />
            <span className="logo-text">KALI</span>
          </div>
          <ul className="nav-menu">
            <li><Link to="/" className="nav-link">HOME</Link></li>
            <li><Link to="/team" className="nav-link">TEAM</Link></li>
            <li><Link to="/projects" className="nav-link">PROJECTS</Link></li>
            <li><Link to="/blogs" className="nav-link">BLOGS</Link></li>
            <li><Link to="/join-us" className="nav-link">JOIN US</Link></li>
            <li><Link to="/profile" className="nav-link active">PROFILE</Link></li>
          </ul>
        </div>
      </nav>

      {/* Form Section */}
      <div className="form-section">
        <div className="form-container">
          <h1>Edit Project</h1>
          <p>Update your project details below</p>

          <form onSubmit={handleSubmit} className="project-form">
            <div className="form-group">
              <label htmlFor="projectName">Project Name *</label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                required
                placeholder="Enter your project name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="Describe your project"
              />
            </div>

            <div className="form-group">
              <label htmlFor="techStack">Tech Stack *</label>
              <input
                type="text"
                id="techStack"
                name="techStack"
                value={formData.techStack}
                onChange={handleInputChange}
                required
                placeholder="e.g., React, Node.js, MongoDB (comma separated)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="members">Team Members</label>
              <input
                type="text"
                id="members"
                name="members"
                value={formData.members}
                onChange={handleInputChange}
                placeholder="Team member names (comma separated)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="githubLink">GitHub Link</label>
              <input
                type="url"
                id="githubLink"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleInputChange}
                placeholder="https://github.com/username/repository"
              />
            </div>

            <div className="form-group">
              <label htmlFor="projectImage">Project Image</label>
              <input
                type="file"
                id="projectImage"
                name="projectImage"
                accept="image/*"
                onChange={handleImageChange}
              />
              
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="New project preview" />
                  <button type="button" onClick={removeImage} className="remove-image-btn">Remove</button>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">Update Project</button>
              <Link to="/profile" className="cancel-btn">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProject;
