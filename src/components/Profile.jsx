import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import Register from './Register';
import './Profile.css';
import ParticleSystem from './ParticleSystem';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user: authUser, logout, loading: authLoading } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userProjects, setUserProjects] = useState([]);
  const [userBlogs, setUserBlogs] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Wait for auth context to finish loading
    if (authLoading) {
      return;
    }

    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetchUserProfile();
  }, [navigate, authLoading, isAuthenticated]);

  useEffect(() => {
    if (user) {
      fetchUserProjects();
      fetchUserBlogs();
    }
  }, [user]);

  // Check for URL parameter to refresh content
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const updated = urlParams.get('updated');
    
    if (updated && user) {
      console.log('Detected update parameter, refreshing content...');
      // Add a small delay to ensure backend has processed the update
      setTimeout(() => {
        refreshUserContent();
      }, 500);
      // Clean the URL
      navigate('/profile', { replace: true });
    }
  }, [location.search, user, navigate]);

  // Check for navigation state to refresh content (keeping for backward compatibility)
  useEffect(() => {
    if (location.state?.shouldRefresh && user) {
      setRefreshTrigger(prev => prev + 1);
      // Clear the state to prevent unnecessary re-renders
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, user, navigate, location.pathname]);

  // Refresh content when refreshTrigger changes
  useEffect(() => {
    if (user && refreshTrigger > 0) {
      refreshUserContent();
    }
  }, [refreshTrigger, user]);

  // Refresh content when window gets focus (user comes back to tab)
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        refreshUserContent();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.status === 'success') {
        setUser(data.data.user);
        setFormData({
          firstName: data.data.user.profile.firstName,
          lastName: data.data.user.profile.lastName,
          bio: data.data.user.profile.bio || '',
          skills: data.data.user.profile.skills.join(', '),
          github: data.data.user.profile.github || '',
          linkedin: data.data.user.profile.linkedin || '',
          website: data.data.user.profile.website || ''
        });
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProjects = async () => {
    if (!user?._id) {
      console.log('No user ID available for fetching projects');
      return;
    }
    
    try {
      setLoadingProjects(true);
      console.log('Fetching projects for user:', user._id);
      const token = localStorage.getItem('token');
      // Add timestamp to prevent caching
      const timestamp = Date.now();
      const response = await fetch(`http://localhost:5000/api/projects?t=${timestamp}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      
      const data = await response.json();
      console.log('Projects API response:', data);
      
      if (data.status === 'success') {
        // Filter projects by current user - API returns data directly, not data.projects
        const currentUserProjects = data.data.filter(
          project => project.createdBy && project.createdBy._id === user._id
        );
        console.log('Filtered user projects:', currentUserProjects);
        setUserProjects(currentUserProjects);
      }
    } catch (error) {
      console.error('Error fetching user projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchUserBlogs = async () => {
    if (!user?._id) {
      console.log('No user ID available for fetching blogs');
      return;
    }
    
    try {
      setLoadingBlogs(true);
      console.log('Fetching blogs for user:', user._id);
      const token = localStorage.getItem('token');
      // Add timestamp to prevent caching
      const timestamp = Date.now();
      const response = await fetch(`http://localhost:5000/api/blogs?t=${timestamp}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      
      const data = await response.json();
      console.log('Blogs API response:', data);
      
      if (data.status === 'success') {
        // Filter blogs by current user - API returns data directly, not data.blogs
        const currentUserBlogs = data.data.filter(
          blog => blog.createdBy && blog.createdBy._id === user._id
        );
        console.log('Filtered user blogs:', currentUserBlogs);
        setUserBlogs(currentUserBlogs);
      }
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      setUserBlogs([]); // Set empty array on error to prevent undefined issues
    } finally {
      setLoadingBlogs(false);
    }
  };

  const refreshUserContent = async () => {
    if (!user) return;
    console.log('Refreshing user content for user:', user._id);
    await Promise.all([
      fetchUserProjects(),
      fetchUserBlogs()
    ]);
    console.log('User content refreshed');
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setUserProjects(userProjects.filter(project => project._id !== projectId));
        setSuccess('Project deleted successfully!');
      } else {
        setError('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Failed to delete project');
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setUserBlogs(userBlogs.filter(blog => blog._id !== blogId));
        setSuccess('Blog deleted successfully!');
      } else {
        setError('Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      setError('Failed to delete blog');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const skillsArray = formData.skills 
        ? formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
        : [];

      const updateData = {
        ...formData,
        skills: skillsArray
      };

      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setUser(data.data.user);
        setSuccess('Profile updated successfully!');
        setEditing(false);
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(data.data.user));
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleDeleteProfile = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your profile? This action cannot be undone and will permanently delete your account, all your projects, and blogs.'
    );
    
    if (!confirmed) return;

    // Double confirmation for such a critical action
    const doubleConfirmed = window.confirm(
      'This is your final warning. Are you absolutely sure you want to permanently delete your profile?'
    );
    
    if (!doubleConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/delete-profile', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.status === 'success') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Your profile has been permanently deleted.');
        navigate('/');
      } else {
        setError(data.message || 'Failed to delete profile');
      }
    } catch (error) {
      console.error('Delete profile error:', error);
      setError('Network error. Please try again.');
    }
  };

  // Show loading while auth context is initializing
  if (authLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Add error boundary for rendering issues
  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Profile</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Animated Particles Background */}
      <ParticleSystem />
      
      {/* Navigation */}
      <nav className="profile-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/kali-logo.png" alt="KALI Logo" className="logo" />
            <span className="logo-text">KALI</span>
          </div>
          <ul className="nav-menu">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/projects" className="nav-link">Projects</Link></li>
            <li><Link to="/blogs" className="nav-link">Blogs</Link></li>
            <li><Link to="/team" className="nav-link">Team</Link></li>
            <li><Link to="/joinus" className="nav-link">Join Us</Link></li>
            <li><Link to="/profile" className="nav-link active">Profile</Link></li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="profile-main">
        {isAuthenticated() && user ? (
          <>
            <div className="profile-header">
              <h1 className="profile-title">My Profile</h1>
            </div>

            <div className="profile-content">
              <div className="profile-card">
                <div className="avatar-section">
                  <div className="avatar">
                    {user.profile.firstName[0]}{user.profile.lastName[0]}
                  </div>
                  <h2 className="profile-name">{user.profile.firstName} {user.profile.lastName}</h2>
                  <p className="username">@{user.username}</p>
                  <p className="email">{user.email}</p>
                  <p className="member-since">
                    Member since {new Date(user.joinedAt).toLocaleDateString()}
                  </p>
                </div>

            {/* Profile Action Buttons */}
            <div className="profile-card-actions">
              {!editing ? (
                <button onClick={() => setEditing(true)} className="edit-btn">
                  Edit Profile
                </button>
              ) : (
                <button onClick={() => setEditing(false)} className="cancel-btn">
                  Cancel Edit
                </button>
              )}
              <button onClick={handleDeleteProfile} className="delete-btn">
                Delete Profile
              </button>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>

          <div className="profile-details">
            {!editing ? (
              <>
                <div className="detail-section">
                  <h3>Bio</h3>
                  <p>{user.profile.bio || 'No bio provided'}</p>
                </div>

                <div className="detail-section">
                  <h3>Skills</h3>
                  <div className="skills-list">
                    {user.profile.skills.length > 0 ? (
                      user.profile.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p>No skills listed</p>
                    )}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Links</h3>
                  <div className="links-list">
                    {user.profile.github && (
                      <a href={user.profile.github} target="_blank" rel="noopener noreferrer" className="profile-link">
                        GitHub
                      </a>
                    )}
                    {user.profile.linkedin && (
                      <a href={user.profile.linkedin} target="_blank" rel="noopener noreferrer" className="profile-link">
                        LinkedIn
                      </a>
                    )}
                    {user.profile.website && (
                      <a href={user.profile.website} target="_blank" rel="noopener noreferrer" className="profile-link">
                        Website
                      </a>
                    )}
                  </div>
                </div>

                <div className="detail-section">
                  <div className="section-header">
                    <h3>My Projects ({userProjects.length})</h3>
                    <button 
                      onClick={refreshUserContent} 
                      className="refresh-btn"
                      disabled={loadingProjects}
                      title="Refresh projects"
                    >
                      {loadingProjects ? '↻' : '🔄'}
                    </button>
                  </div>
                  <div className="user-projects">
                    {loadingProjects ? (
                      <p>Loading projects...</p>
                    ) : userProjects.length > 0 ? (
                      <div className="content-grid">
                        {userProjects.map((project) => (
                          <div key={project._id} className="content-card">
                            {project.imageUrl && (
                              <img 
                                src={`http://localhost:5000${project.imageUrl}`} 
                                alt={project.title}
                                className="content-image"
                              />
                            )}
                            <div className="content-info">
                              <h4 className="content-title">{project.title}</h4>
                              <p className="content-description">{project.description}</p>
                              <div className="content-meta">
                                <span className="content-date">
                                  {new Date(project.createdAt).toLocaleDateString()}
                                </span>
                                <div className="content-actions">
                                  <button 
                                    className="delete-content-btn"
                                    onClick={() => handleDeleteProject(project._id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <p>No projects yet. Start creating!</p>
                        <button 
                          className="create-btn"
                          onClick={() => navigate('/projects')}
                        >
                          Create Project
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="detail-section">
                  <div className="section-header">
                    <h3>My Blogs ({userBlogs.length})</h3>
                    <button 
                      onClick={refreshUserContent} 
                      className="refresh-btn"
                      disabled={loadingBlogs}
                      title="Refresh blogs"
                    >
                      {loadingBlogs ? '↻' : '🔄'}
                    </button>
                  </div>
                  <div className="user-blogs">
                    {loadingBlogs ? (
                      <p>Loading blogs...</p>
                    ) : userBlogs.length > 0 ? (
                      <div className="content-grid">
                        {userBlogs.map((blog) => (
                          <div key={blog._id} className="content-card">
                            <div className="content-info">
                              <h4 className="content-title">{blog.title || 'Untitled'}</h4>
                              <p className="content-description">
                                {blog.content ? blog.content.substring(0, 150) + '...' : 'No content available'}
                              </p>
                              <div className="content-meta">
                                <div className="blog-status">
                                  <span className={`status-badge ${blog.status || 'draft'}`}>
                                    {blog.status || 'draft'}
                                  </span>
                                </div>
                                <span className="content-date">
                                  {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'No date'}
                                </span>
                                <div className="content-actions">
                                  <button 
                                    className="delete-content-btn"
                                    onClick={() => handleDeleteBlog(blog._id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <p>No blogs yet. Start writing!</p>
                        <button 
                          className="create-btn"
                          onClick={() => navigate('/blogs')}
                        >
                          Write Blog
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell us about yourself"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="skills">Skills</label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="e.g., React, Node.js, Python (comma separated)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="github">GitHub URL</label>
                  <input
                    type="url"
                    id="github"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="https://github.com/yourusername"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="linkedin">LinkedIn URL</label>
                  <input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourusername"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="website">Website URL</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="success-message">
                    {success}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}
          </div>
        </div>
        </>
        ) : (
          // Authentication section for non-authenticated users
          <div className="auth-section">
            <div className="profile-header">
              <h1 className="profile-title">Profile</h1>
              <p className="auth-subtitle">
                Sign in to access your profile and join the KALI AI/ML community.
              </p>
            </div>

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
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
