import React, { useState, useEffect } from 'react';
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [data, setData] = useState({
    applications: [],
    blogs: [],
    projects: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // For delete confirmation

  const fetchData = async (type) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:5000/api/${type}`);
      const result = await response.json();
      
      if (response.ok) {
        setData(prev => ({
          ...prev,
          [type]: result.data || []
        }));
      } else {
        setError(`Failed to fetch ${type}: ${result.message}`);
      }
    } catch (error) {
      setError(`Network error fetching ${type}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (type, id, title) => {
    try {
      const response = await fetch(`http://localhost:5000/api/${type}/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Remove the deleted item from the local state
        setData(prev => ({
          ...prev,
          [type]: prev[type].filter(item => item._id !== id)
        }));
        setDeleteConfirm(null);
        alert(`Successfully deleted: ${title}`);
      } else {
        const result = await response.json();
        alert(`Failed to delete: ${result.message}`);
      }
    } catch (error) {
      alert(`Error deleting item: ${error.message}`);
    }
  };

  const handleApplicationAction = async (id, action, applicantName) => {
    try {
      const response = await fetch(`http://localhost:5000/api/applications/${id}/${action}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Update the application status in the local state
        setData(prev => ({
          ...prev,
          applications: prev.applications.map(app => 
            app._id === id 
              ? { 
                  ...app, 
                  status: action === 'accept' ? 'accepted' : 'denied', 
                  registrationToken: result.registrationToken || result.data?.registrationToken
                }
              : app
          )
        }));
        
        const actionText = action === 'accept' ? 'accepted' : 'denied';
        const token = result.registrationToken || result.data?.registrationToken;
        
        if (action === 'accept' && token) {
          alert(`Application accepted successfully!\n\nRegistration Token: ${token}\n\nPlease share this token with ${applicantName} for registration.\nThey will need to use the same email (${result.application?.email || result.data?.email}) during registration.`);
        } else {
          alert(`Successfully ${actionText} application from ${applicantName}`);
        }
        
        // Refresh data to ensure we have the latest from database
        setTimeout(() => {
          fetchData('applications');
        }, 500);
      } else {
        const result = await response.json();
        alert(`Failed to ${action} application: ${result.message}`);
      }
    } catch (error) {
      alert(`Error ${action}ing application: ${error.message}`);
    }
  };

  const confirmDelete = (type, item) => {
    setDeleteConfirm({
      type,
      id: item._id,
      title: item.title || item.name || item.email || 'this item'
    });
  };

  const renderApplications = () => (
    <div className="data-table">
      <h3>Applications ({data.applications.length})</h3>
      {data.applications.length === 0 ? (
        <p className="no-data">No applications submitted yet.</p>
      ) : (
        <div className="table-container">
          <table className="applications-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Branch & Year</th>
                <th>Role</th>
                <th>Domain</th>
                <th>Status</th>
                <th>Token</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.applications.map((app) => (
                <tr key={app._id}>
                  <td>{app.fullName}</td>
                  <td>{app.email}</td>
                  <td>{app.phone}</td>
                  <td>{app.branchYear}</td>
                  <td>
                    <span className="role-badge">{app.preferredRole}</span>
                  </td>
                  <td>
                    <span className="domain-badge">{app.domain}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${app.status}`}>{app.status}</span>
                  </td>
                  <td>
                    {app.registrationToken ? (
                      <div className="token-container">
                        <code className="token-display" title={app.registrationToken}>
                          {app.registrationToken}
                        </code>
                        <button 
                          className="copy-token-btn"
                          onClick={() => {
                            navigator.clipboard.writeText(app.registrationToken);
                            alert('Token copied to clipboard!');
                          }}
                          title="Copy Token"
                        >
                          📋
                        </button>
                      </div>
                    ) : app.status === 'accepted' ? (
                      <span className="token-pending" title="Token should be available for accepted applications">Pending</span>
                    ) : (
                      <span className="no-token">-</span>
                    )}
                  </td>
                  <td>{formatDate(app.submittedAt)}</td>
                  <td>
                    <div className="action-buttons">
                      {app.status === 'pending' && (
                        <>
                          <button 
                            className="accept-btn"
                            onClick={() => handleApplicationAction(app._id, 'accept', app.fullName)}
                            title="Accept Application"
                          >
                            ✓
                          </button>
                          <button 
                            className="deny-btn"
                            onClick={() => handleApplicationAction(app._id, 'deny', app.fullName)}
                            title="Deny Application"
                          >
                            ✗
                          </button>
                        </>
                      )}
                      <button 
                        className="view-btn"
                        onClick={() => viewDetails('application', app)}
                      >
                        View
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => confirmDelete('applications', app)}
                        title="Delete Application"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderBlogs = () => (
    <div className="data-table">
      <h3>Blog Posts ({data.blogs.length})</h3>
      {data.blogs.length === 0 ? (
        <p className="no-data">No blog posts published yet.</p>
      ) : (
        <div className="table-container">
          <table className="blogs-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Status</th>
                <th>Views</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>{blog.title}</td>
                  <td>{blog.author}</td>
                  <td>
                    <span className="category-badge">{blog.category}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${blog.status}`}>{blog.status}</span>
                  </td>
                  <td>{blog.views || 0}</td>
                  <td>{formatDate(blog.publishedAt || blog.createdAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="view-btn"
                        onClick={() => viewDetails('blog', blog)}
                      >
                        View
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => confirmDelete('blogs', blog)}
                        title="Delete Blog"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderProjects = () => (
    <div className="data-table">
      <h3>Projects ({data.projects.length})</h3>
      {data.projects.length === 0 ? (
        <p className="no-data">No projects added yet.</p>
      ) : (
        <div className="table-container">
          <table className="projects-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Team Size</th>
                <th>Start Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.projects.map((project) => (
                <tr key={project._id}>
                  <td>{project.title}</td>
                  <td>
                    <span className="category-badge">{project.category}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${project.status}`}>{project.status}</span>
                  </td>
                  <td>{project.teamMembers?.length || 0}</td>
                  <td>{formatDate(project.startDate || project.createdAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="view-btn"
                        onClick={() => viewDetails('project', project)}
                      >
                        View
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => confirmDelete('projects', project)}
                        title="Delete Project"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const viewDetails = (type, item) => {
    // Create a popup with detailed information
    const detailsWindow = window.open('', '_blank', 'width=800,height=600');
    detailsWindow.document.write(`
      <html>
        <head>
          <title>${type.charAt(0).toUpperCase() + type.slice(1)} Details</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
            .container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; border-bottom: 2px solid #ff4500; padding-bottom: 10px; }
            .field { margin: 15px 0; }
            .label { font-weight: bold; color: #555; }
            .value { margin-top: 5px; padding: 8px; background: #f9f9f9; border-left: 3px solid #ff4500; }
            .content { white-space: pre-wrap; max-height: 300px; overflow-y: auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${type.charAt(0).toUpperCase() + type.slice(1)} Details</h1>
            ${Object.entries(item).map(([key, value]) => {
              if (key === '_id' || key === '__v') return '';
              return `
                <div class="field">
                  <div class="label">${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</div>
                  <div class="value ${key === 'content' ? 'content' : ''}">${
                    typeof value === 'object' && value !== null 
                      ? JSON.stringify(value, null, 2) 
                      : value || 'N/A'
                  }</div>
                </div>
              `;
            }).join('')}
          </div>
        </body>
      </html>
    `);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="header-content">
          <div className="header-text">
            <h1>KALI Admin Dashboard</h1>
            <p>Manage and view all submitted data</p>
          </div>
          <button 
            className="refresh-btn"
            onClick={() => fetchData(activeTab)}
            disabled={loading}
            title="Refresh current data"
          >
            {loading ? (
              <div className="refresh-spinner">⟳</div>
            ) : (
              '🔄'
            )}
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          Applications
        </button>
        <button 
          className={`tab-btn ${activeTab === 'blogs' ? 'active' : ''}`}
          onClick={() => setActiveTab('blogs')}
        >
          Blogs
        </button>
        <button 
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
      </div>

      <div className="admin-content">
        {loading && <div className="loading">Loading {activeTab}...</div>}
        {error && <div className="error">{error}</div>}
        
        {!loading && !error && (
          <>
            {activeTab === 'applications' && renderApplications()}
            {activeTab === 'blogs' && renderBlogs()}
            {activeTab === 'projects' && renderProjects()}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete "{deleteConfirm.title}"?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button 
                className="confirm-delete-btn"
                onClick={() => handleDelete(deleteConfirm.type, deleteConfirm.id, deleteConfirm.title)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
