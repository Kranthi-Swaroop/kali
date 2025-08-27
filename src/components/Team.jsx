import React from 'react';
import { Link } from 'react-router-dom';
import './Team.css';
import ParticleSystem from './ParticleSystem';

const Team = () => {
  return (
    <div className="team-page">
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
            <li><Link to="/projects" className="nav-link">PROJECTS</Link></li>
            <li><Link to="/team" className="nav-link active">TEAM</Link></li>
            <li><Link to="/blogs" className="nav-link">BLOGS</Link></li>
            <li><Link to="/profile" className="nav-link">PROFILE</Link></li>
            <li><Link to="/join-us" className="nav-link">JOIN US</Link></li>
          </ul>
        </div>
      </nav>

      {/* Team Section */}
      <section className="team-section">
        <div className="team-container">
          <div className="section-header" style={{textAlign: 'center', width: '100%', display: 'block'}}>
            <h1 className="team-main-title" style={{textAlign: 'center', margin: '0 auto', display: 'block', width: '100%'}}>Our Team</h1>
            <div className="section-divider"></div>
          </div>

          {/* Chief Optimizer - Center Top */}
          <div className="chief-optimizer-section">
            <div className="chief-card">
              <div className="member-avatar chief-avatar">
                <div className="avatar-placeholder">CG</div>
              </div>
              <h2 className="member-name chief-name">Chirag Garg</h2>
              <h3 className="member-role chief-role">Chief Optimizer</h3>
              <p className="member-details">4th Year, Computer Science & Engineering</p>
              <div className="member-description">
                Leading the optimization strategies and overseeing the technical excellence of all AI/ML initiatives.
              </div>
            </div>
          </div>

          {/* Architects */}
          <div className="architects-section">
            <h3 className="section-title">Architects</h3>
            <div className="architects-grid">
              <div className="member-card architect-card">
                <div className="member-avatar">
                  <div className="avatar-placeholder">SR</div>
                </div>
                <h4 className="member-name">Sundram Rai</h4>
                <h5 className="member-role">Vision Architect</h5>
                <p className="member-details">3rd Year, Electrical Engineering</p>
                <div className="member-description">
                  Designing the strategic vision and future roadmap for the club's AI initiatives.
                </div>
              </div>

              <div className="member-card architect-card">
                <div className="member-avatar">
                  <div className="avatar-placeholder">SS</div>
                </div>
                <h4 className="member-name">Shivajay Saxena</h4>
                <h5 className="member-role">Language Architect</h5>
                <p className="member-details">4th Year, Computer Science & Engineering</p>
                <div className="member-description">
                  Specializing in NLP, language models, and communication frameworks for AI systems.
                </div>
              </div>

              <div className="member-card architect-card">
                <div className="member-avatar">
                  <div className="avatar-placeholder">SR</div>
                </div>
                <h4 className="member-name">Sundram Rai</h4>
                <h5 className="member-role">Policy Architect</h5>
                <p className="member-details">3rd Year, Electrical Engineering</p>
                <div className="member-description">
                  Developing ethical AI policies and governance frameworks for responsible innovation.
                </div>
              </div>

              <div className="member-card architect-card">
                <div className="member-avatar">
                  <div className="avatar-placeholder">CG</div>
                </div>
                <h4 className="member-name">Chirag Garg</h4>
                <h5 className="member-role">Generative Architect</h5>
                <p className="member-details">4th Year, Computer Science & Engineering</p>
                <div className="member-description">
                  Leading generative AI research and implementation of creative AI solutions.
                </div>
              </div>
            </div>
          </div>

          {/* Neurons */}
          <div className="neurons-section">
            <h3 className="section-title">Neurons</h3>
            <div className="neurons-grid">
              <div className="member-card neuron-card">
                <div className="member-avatar neuron-avatar">
                  <div className="avatar-placeholder">BK</div>
                </div>
                <h4 className="member-name">B Kranthi Swaroop</h4>
                <h5 className="member-role">Neuron</h5>
                <p className="member-details">2nd Year, Computer Science & Engineering</p>
              </div>

              <div className="member-card neuron-card">
                <div className="member-avatar neuron-avatar">
                  <div className="avatar-placeholder">RS</div>
                </div>
                <h4 className="member-name">Rahul Sharma</h4>
                <h5 className="member-role">Neuron</h5>
                <p className="member-details">2nd Year, Bio Medical Engineering</p>
              </div>

              <div className="member-card neuron-card">
                <div className="member-avatar neuron-avatar">
                  <div className="avatar-placeholder">AS</div>
                </div>
                <h4 className="member-name">Aditya Kumar Sahu</h4>
                <h5 className="member-role">Neuron</h5>
                <p className="member-details">2nd Year, Computer Science & Engineering</p>
              </div>
            </div>
          </div>

          {/* Parameters Section - Placeholder for future members */}
          <div className="parameters-section">
            <h3 className="section-title">Parameters</h3>
            <div className="parameters-grid">
              <div className="member-card parameter-card">
                <h4 className="member-name">Join Our Team</h4>
                <h5 className="member-role">Parameter Position</h5>
                <div className="member-description">
                  Ready to contribute to AI/ML innovation? Join our growing team of parameters!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;
