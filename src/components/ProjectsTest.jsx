import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Projects.css';

const Projects = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple fetch test
    fetch(`${import.meta.env.VITE_API_URI}projects`)
      .then(response => response.json())
      .then(result => {
        console.log('Raw API result:', result);
        setData(result);
        setLoading(false);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setLoading(false);
      });
  }, []);

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
              Simple API Test
            </p>
          </div>

          <div className="projects-grid">
            {loading ? (
              <div style={{color: 'white', fontSize: '24px'}}>Loading...</div>
            ) : (
              <div style={{color: 'white', background: 'black', padding: '20px', fontSize: '16px'}}>
                <h2>API Test Results:</h2>
                <pre>{JSON.stringify(data, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
