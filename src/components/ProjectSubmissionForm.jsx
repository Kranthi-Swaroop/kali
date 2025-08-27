import React, { useState, useEffect } from 'react';
import './ProjectSubmissionForm.css';
// import ApiService from '../services/api';

const ProjectSubmissionForm = ({ isOpen, onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'Machine Learning',
    technologies: [],
    githubUrl: '',
    liveUrl: '',
    researchPaperUrl: '',
    teamMembers: [],
    status: 'Completed',
    featured: false,
    startDate: '',
    endDate: '',
    achievements: []
  });

  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [techInput, setTechInput] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');

  // Available categories and statuses
  const categories = ['Machine Learning', 'Computer Vision', 'Natural Language Processing', 'Web Development', 'Mobile Development', 'IoT', 'Blockchain', 'Data Science', 'Other'];
  const statuses = ['Completed', 'In Progress', 'Planning', 'Deployed', 'Research'];

  // Fetch team members for suggestions
  useEffect(() => {
    if (isOpen) {
      fetchTeamMembers();
    }
  }, [isOpen]);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/team');
      const result = await response.json();
      setTeamMembers(result.data || result.teamMembers || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const removeTechnology = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  const addTeamMember = () => {
    if (memberInput.trim() && !formData.teamMembers.includes(memberInput.trim())) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, memberInput.trim()]
      }));
      setMemberInput('');
    }
  };

  const removeTeamMember = (memberToRemove) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(member => member !== memberToRemove)
    }));
  };

  const addAchievement = () => {
    if (achievementInput.trim() && !formData.achievements.includes(achievementInput.trim())) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievementInput.trim()]
      }));
      setAchievementInput('');
    }
  };

  const removeAchievement = (achievementToRemove) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter(achievement => achievement !== achievementToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Project title is required';
    if (!formData.description.trim()) newErrors.description = 'Project description is required';
    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (formData.technologies.length === 0) newErrors.technologies = 'At least one technology is required';
    if (formData.teamMembers.length === 0) newErrors.teamMembers = 'At least one team member is required';
    if (!formData.githubUrl.trim()) newErrors.githubUrl = 'GitHub URL is required';
    
    // URL validation
    const urlPattern = /^https?:\/\/.+/;
    if (formData.githubUrl && !urlPattern.test(formData.githubUrl)) {
      newErrors.githubUrl = 'Please enter a valid URL starting with http:// or https://';
    }
    if (formData.liveUrl && !urlPattern.test(formData.liveUrl)) {
      newErrors.liveUrl = 'Please enter a valid URL starting with http:// or https://';
    }
    if (formData.researchPaperUrl && !urlPattern.test(formData.researchPaperUrl)) {
      newErrors.researchPaperUrl = 'Please enter a valid URL starting with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const projectData = {
        ...formData,
        links: {
          github: formData.githubUrl,
          live: formData.liveUrl || '',
          researchPaper: formData.researchPaperUrl || ''
        }
      };

      // Remove individual URL fields as they're now in links object
      delete projectData.githubUrl;
      delete projectData.liveUrl;
      delete projectData.researchPaperUrl;

      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        shortDescription: '',
        category: 'Machine Learning',
        technologies: [],
        githubUrl: '',
        liveUrl: '',
        researchPaperUrl: '',
        teamMembers: [],
        status: 'Completed',
        featured: false,
        startDate: '',
        endDate: '',
        achievements: []
      });
      
      onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting project:', error);
      setErrors({ submit: error.message || 'Failed to submit project. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="project-form-modal" onClick={e => e.stopPropagation()}>
        <div className="form-header">
          <h2>Submit New Project</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="project-form">
          {errors.submit && (
            <div className="error-message global-error">{errors.submit}</div>
          )}

          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="title">Project Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter project title"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="shortDescription">Short Description *</label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                placeholder="Brief description for project cards (max 150 characters)"
                maxLength={150}
                rows={2}
                className={errors.shortDescription ? 'error' : ''}
              />
              {errors.shortDescription && <span className="error-text">{errors.shortDescription}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Detailed Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detailed project description"
                rows={4}
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div className="form-section">
            <h3>Technologies Used *</h3>
            <div className="form-group">
              <div className="input-with-button">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, addTechnology)}
                  placeholder="Add technology (e.g., Python, React, MongoDB)"
                />
                <button type="button" onClick={addTechnology} className="add-button">
                  Add
                </button>
              </div>
              {errors.technologies && <span className="error-text">{errors.technologies}</span>}
              
              <div className="tags-container">
                {formData.technologies.map(tech => (
                  <span key={tech} className="tag">
                    {tech}
                    <button type="button" onClick={() => removeTechnology(tech)} className="tag-remove">
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="form-section">
            <h3>Team Members *</h3>
            <div className="form-group">
              <div className="input-with-button">
                <input
                  type="text"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, addTeamMember)}
                  placeholder="Add team member name"
                />
                <button type="button" onClick={addTeamMember} className="add-button">
                  Add
                </button>
              </div>
              {errors.teamMembers && <span className="error-text">{errors.teamMembers}</span>}
              
              <div className="tags-container">
                {formData.teamMembers.map(member => (
                  <span key={member} className="tag member-tag">
                    {member}
                    <button type="button" onClick={() => removeTeamMember(member)} className="tag-remove">
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="form-section">
            <h3>Project Links</h3>
            
            <div className="form-group">
              <label htmlFor="githubUrl">GitHub Repository *</label>
              <input
                type="url"
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleInputChange}
                placeholder="https://github.com/username/repository"
                className={errors.githubUrl ? 'error' : ''}
              />
              {errors.githubUrl && <span className="error-text">{errors.githubUrl}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="liveUrl">Live Demo URL (Optional)</label>
              <input
                type="url"
                id="liveUrl"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleInputChange}
                placeholder="https://your-demo-url.com"
                className={errors.liveUrl ? 'error' : ''}
              />
              {errors.liveUrl && <span className="error-text">{errors.liveUrl}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="researchPaperUrl">Research Paper URL (Optional)</label>
              <input
                type="url"
                id="researchPaperUrl"
                name="researchPaperUrl"
                value={formData.researchPaperUrl}
                onChange={handleInputChange}
                placeholder="https://link-to-research-paper.com"
                className={errors.researchPaperUrl ? 'error' : ''}
              />
              {errors.researchPaperUrl && <span className="error-text">{errors.researchPaperUrl}</span>}
            </div>
          </div>

          {/* Timeline */}
          <div className="form-section">
            <h3>Project Timeline (Optional)</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="form-section">
            <h3>Achievements & Awards (Optional)</h3>
            <div className="form-group">
              <div className="input-with-button">
                <input
                  type="text"
                  value={achievementInput}
                  onChange={(e) => setAchievementInput(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, addAchievement)}
                  placeholder="Add achievement or award"
                />
                <button type="button" onClick={addAchievement} className="add-button">
                  Add
                </button>
              </div>
              
              <div className="tags-container">
                {formData.achievements.map(achievement => (
                  <span key={achievement} className="tag achievement-tag">
                    {achievement}
                    <button type="button" onClick={() => removeAchievement(achievement)} className="tag-remove">
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="form-section">
            <h3>Settings</h3>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                Featured Project (will be highlighted on the homepage)
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectSubmissionForm;
