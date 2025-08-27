import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthNav.css';

const AuthNav = ({ currentPage = '' }) => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <img src="/kali-logo.png" alt="KALI Club" className="logo" />
          <span className="logo-text">KALI</span>
        </div>
        <ul className="nav-menu">
          <li><Link to="/" className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}>HOME</Link></li>
          <li><Link to="/projects" className={`nav-link ${currentPage === 'projects' ? 'active' : ''}`}>PROJECTS</Link></li>
          <li><Link to="/team" className={`nav-link ${currentPage === 'team' ? 'active' : ''}`}>TEAM</Link></li>
          <li><Link to="/blogs" className={`nav-link ${currentPage === 'blogs' ? 'active' : ''}`}>BLOGS</Link></li>
          <li><Link to="/profile" className={`nav-link ${currentPage === 'profile' ? 'active' : ''}`}>PROFILE</Link></li>
          <li><Link to="/join-us" className={`nav-link ${currentPage === 'join-us' ? 'active' : ''}`}>JOIN US</Link></li>
        </ul>
        <div className="nav-auth">
          {isAuthenticated() ? (
            <div className="auth-user">
              <Link to="/profile" className="user-profile">
                <div className="user-avatar">
                  {user?.profile?.firstName?.[0]}{user?.profile?.lastName?.[0]}
                </div>
                <span className="user-name">{user?.profile?.firstName}</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-btn login-btn">Login</Link>
              <Link to="/register" className="auth-btn register-btn">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AuthNav;
