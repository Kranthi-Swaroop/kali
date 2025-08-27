import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import Register from './Register';
import './Members.css';

const Members = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // If user is already authenticated, show welcome block instead of redirecting
    if (isAuthenticated()) {
      setShowWelcome(true);
    }
  }, [isAuthenticated]);

  return (
    <div className="members-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/kali-logo.png" alt="KALI Club" className="logo" />
            <span className="logo-text">
              <span className="logo-k">K</span>
              <span className="logo-ali">ALI</span>
            </span>
          </div>
          <ul className="nav-menu">
            <li><Link to="/" className="nav-link">HOME</Link></li>
            <li><Link to="/team" className="nav-link">TEAM</Link></li>
            <li><Link to="/projects" className="nav-link">PROJECTS</Link></li>
            <li><Link to="/blogs" className="nav-link">BLOGS</Link></li>
            <li><Link to="/members" className="nav-link active">MEMBERS</Link></li>
            <li><Link to="/join-us" className="nav-link">JOIN US</Link></li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="members-container">
        <div className="members-hero">
          <h1 className="members-title">MEMBERS</h1>
          <p className="members-subtitle">
            Join our AI/ML community. Sign in to access exclusive content and contribute to our projects.
          </p>
        </div>

        <div className="members-content">
          {showWelcome && user ? (
            // Welcome Back Block for authenticated users
            <section className="welcome-section">
              <div className="welcome-container">
                <div className="welcome-avatar">
                  {user.profile?.firstName ? 
                    `${user.profile.firstName[0]}${user.profile.lastName?.[0] || ''}` : 
                    user.username[0].toUpperCase()
                  }
                </div>
                <div className="welcome-content">
                  <h2 className="welcome-title">Welcome Back!</h2>
                  <p className="welcome-name">
                    {user.profile?.firstName ? 
                      `${user.profile.firstName} ${user.profile.lastName || ''}` : 
                      user.username
                    }
                  </p>
                  <p className="welcome-subtitle">
                    You're logged in and ready to explore KALI's AI/ML community.
                  </p>
                  
                  <div className="welcome-stats">
                    <div className="stat-item">
                      <span className="stat-label">Member Since</span>
                      <span className="stat-value">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Role</span>
                      <span className="stat-value">{user.role || 'Member'}</span>
                    </div>
                  </div>

                  <div className="welcome-actions">
                    <Link to="/profile" className="action-btn primary">
                      View Profile
                    </Link>
                    <Link to="/projects" className="action-btn secondary">
                      Browse Projects
                    </Link>
                    <Link to="/blogs" className="action-btn secondary">
                      Read Blogs
                    </Link>
                  </div>

                  <div className="welcome-quick-actions">
                    <p className="quick-actions-title">Quick Actions:</p>
                    <div className="quick-action-links">
                      <Link to="/submit-project" className="quick-link">Submit Project</Link>
                      <Link to="/submit-blog" className="quick-link">Write Blog</Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="quick-link admin-link">Admin Dashboard</Link>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      logout();
                      setShowWelcome(false);
                    }} 
                    className="logout-btn"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </section>
          ) : (
            // Authentication forms for non-authenticated users
            <section className="auth-section">
              <div className="auth-container-wrapper">
                <div className="auth-tabs">
                  <button 
                    className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
                    onClick={() => setActiveTab('login')}
                  >
                    Sign In
                  </button>
                  <button 
                    className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
                    onClick={() => setActiveTab('register')}
                  >
                    Sign Up
                  </button>
                </div>

                <div className="auth-content">
                  {activeTab === 'login' ? <Login /> : <Register />}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Members;
