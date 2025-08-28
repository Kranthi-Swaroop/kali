import React, { useState } from 'react';

const ProjectSubmissionFormSimple = ({ isOpen, onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    teamMembers: '',
    githubUrl: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert comma-separated strings to arrays
      const submissionData = {
        title: formData.title,
        description: formData.description,
        technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
        teamMembers: formData.teamMembers.split(',').map(member => member.trim()).filter(member => member),
        links: {
          github: formData.githubUrl
        },
        status: 'Planning',
        category: 'AI/ML'
      };

      const response = await fetch(`${import.meta.env.VITE_API_URI}projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        alert('Project submitted successfully!');
        setFormData({
          title: '',
          description: '',
          technologies: '',
          teamMembers: '',
          githubUrl: ''
        });
        onSubmitSuccess();
        onClose();
      } else {
        throw new Error('Failed to submit project');
      }
    } catch (error) {
      console.error('Error submitting project:', error);
      alert('Failed to submit project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        padding: '2rem',
        borderRadius: '10px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid rgba(255, 69, 0, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ margin: 0, color: '#ff6666' }}>Submit New Project</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                color: '#ffffff',
                borderRadius: '5px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                color: '#ffffff',
                borderRadius: '5px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Technologies (comma-separated) *
            </label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleInputChange}
              placeholder="e.g., Python, TensorFlow, React"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                color: '#ffffff',
                borderRadius: '5px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Team Members (comma-separated) *
            </label>
            <input
              type="text"
              name="teamMembers"
              value={formData.teamMembers}
              onChange={handleInputChange}
              placeholder="e.g., John Doe, Jane Smith"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                color: '#ffffff',
                borderRadius: '5px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              GitHub URL
            </label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleInputChange}
              placeholder="https://github.com/username/project"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                color: '#ffffff',
                borderRadius: '5px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                border: '1px solid #666',
                color: '#ffffff',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#ff4444',
                border: 'none',
                color: '#ffffff',
                borderRadius: '5px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectSubmissionFormSimple;
