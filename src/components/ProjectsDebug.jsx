import React, { useState, useEffect } from 'react';

const ProjectsDebug = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setDebugInfo('Starting fetch...');
      
      const response = await fetch('http://localhost:5000/api/projects');
      setDebugInfo(`Response status: ${response.status}`);
      
      const result = await response.json();
      setDebugInfo(`Response data: ${JSON.stringify(result, null, 2)}`);
      
      if (result.status === 'success' && result.data) {
        setProjects(result.data);
        setError(null);
      } else {
        setError('No projects found');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects: ' + error.message);
      setDebugInfo(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'white', 
      color: 'black', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Projects Debug Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Status:</h2>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>Error: {error || 'None'}</p>
        <p>Projects count: {projects.length}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Debug Info:</h2>
        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
          {debugInfo}
        </pre>
      </div>

      <div>
        <h2>Projects Data:</h2>
        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
          {JSON.stringify(projects, null, 2)}
        </pre>
      </div>

      <button onClick={fetchProjects} style={{ 
        padding: '10px 20px', 
        backgroundColor: '#007bff', 
        color: 'white', 
        border: 'none', 
        borderRadius: '5px',
        cursor: 'pointer' 
      }}>
        Retry Fetch
      </button>
    </div>
  );
};

export default ProjectsDebug;
