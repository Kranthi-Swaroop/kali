import React, { useState, useEffect } from 'react';

const ProjectsMinimalTest = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      console.log('Starting fetch...');
      setLoading(true);
      
      const response = await fetch('http://localhost:5000/api/projects');
      console.log('Response:', response.status, response.statusText);
      
      const result = await response.json();
      console.log('Result:', result);
      
      if (result.status === 'success' && result.data) {
        setProjects(result.data);
        setError(null);
        console.log('Projects loaded:', result.data.length);
      } else {
        setError('No projects found');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load projects: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      color: '#000', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#000' }}>Projects Minimal Test</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff', border: '1px solid #ddd' }}>
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>Error:</strong> {error || 'None'}</p>
        <p><strong>Projects Count:</strong> {projects.length}</p>
      </div>

      {loading && (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Loading projects...</p>
        </div>
      )}

      {error && (
        <div style={{ padding: '20px', backgroundColor: '#ffebee', border: '1px solid #f44336', color: '#d32f2f' }}>
          <p>Error: {error}</p>
          <button onClick={fetchProjects} style={{ padding: '10px 20px', marginTop: '10px' }}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div>
          <h2>Projects ({projects.length})</h2>
          {projects.map((project, index) => (
            <div key={project._id || index} style={{ 
              marginBottom: '20px', 
              padding: '15px', 
              backgroundColor: '#fff', 
              border: '1px solid #ddd',
              borderRadius: '5px'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{project.title}</h3>
              <p style={{ margin: '0 0 10px 0', color: '#666' }}>{project.description}</p>
              <p style={{ margin: '0', fontSize: '14px', color: '#999' }}>
                Status: {project.status} | Tech: {project.technologies?.join(', ')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsMinimalTest;
