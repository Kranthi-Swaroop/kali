import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SubmitBlog.css';

const SubmitBlog = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getAuthHeaders, user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    coverImage: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        coverImage: file
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      coverImage: null
    }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setSubmitError('');

      // Validate required fields
      if (!formData.title || !formData.excerpt || !formData.content || !formData.category) {
        throw new Error('Please fill in all required fields');
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add basic blog data
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('excerpt', formData.excerpt.trim());
      formDataToSend.append('content', formData.content.trim());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('tags', formData.tags.trim());
      formDataToSend.append('status', 'published'); // Auto-publish blogs
      
      // Add image if selected
      if (formData.coverImage) {
        formDataToSend.append('image', formData.coverImage);
      }

      // Send to backend API with authentication
      const response = await fetch('http://localhost:5000/api/blogs', {
        method: 'POST',
        headers: {
          ...getAuthHeaders()
        },
        body: formDataToSend, // Don't set Content-Type header, let browser set it for FormData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit blog post');
      }

      // Success - reset form and navigate
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        tags: '',
        coverImage: null
      });
      setImagePreview(null);
      
      alert('Blog article submitted successfully! Your article is now live.');
      navigate('/blogs');
    } catch (error) {
      console.error('Error submitting blog:', error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="submit-blog-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/kali-logo.png" alt="Kali Logo" className="logo" />
            <span className="logo-text">KALI</span>
          </div>
          <ul className="nav-menu">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/projects" className="nav-link">Projects</Link></li>
            <li><Link to="/team" className="nav-link">Team</Link></li>
            <li><Link to="/blogs" className="nav-link active">Blogs</Link></li>
            <li><Link to="/join-us" className="nav-link">Join Us</Link></li>
          </ul>
        </div>
      </nav>

      {/* Submit Blog Section */}
      <section className="submit-blog-section">
        <div className="submit-blog-container">
          <div className="section-header">
            <h1 className="submit-blog-title">Write an Article</h1>
            <div className="section-divider"></div>
            <p className="submit-blog-subtitle">
              Share your knowledge and insights with the KALI community. Write about AI/ML research, tutorials, or industry insights.
            </p>
          </div>

          <div className="form-container">
            <form className="blog-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Article Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter a compelling title for your article"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="excerpt">Article Summary *</label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Write a brief summary of your article (2-3 sentences)"
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Deep Learning">Deep Learning</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Computer Vision">Computer Vision</option>
                    <option value="Natural Language Processing">Natural Language Processing</option>
                    <option value="Reinforcement Learning">Reinforcement Learning</option>
                    <option value="Research Papers">Research Papers</option>
                    <option value="Tutorials">Tutorials</option>
                    <option value="Industry Insights">Industry Insights</option>
                    <option value="Tools & Frameworks">Tools & Frameworks</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="tags">Tags *</label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g., Neural Networks, PyTorch, Transformers (comma-separated)"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="coverImage">Cover Image</label>
                <div className="image-upload-container">
                  <input
                    type="file"
                    id="coverImage"
                    name="coverImage"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="image-input"
                  />
                  
                  {!imagePreview ? (
                    <label htmlFor="coverImage" className="image-upload-label">
                      <div className="upload-placeholder">
                        <span className="upload-icon">📸</span>
                        <span className="upload-text">Click to upload cover image</span>
                        <span className="upload-subtext">PNG, JPG, GIF up to 5MB</span>
                      </div>
                    </label>
                  ) : (
                    <div className="image-preview-container">
                      <img src={imagePreview} alt="Cover preview" className="image-preview" />
                      <button type="button" className="remove-image-btn" onClick={removeImage}>
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="content">Article Content *</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your full article content here. You can use markdown formatting."
                  rows="15"
                  required
                />
                <div className="content-help">
                  <p>You can use basic HTML or markdown formatting:</p>
                  <ul>
                    <li><strong>&lt;h2&gt;</strong> for headings</li>
                    <li><strong>&lt;p&gt;</strong> for paragraphs</li>
                    <li><strong>&lt;strong&gt;</strong> for bold text</li>
                    <li><strong>&lt;em&gt;</strong> for italic text</li>
                    <li><strong>&lt;ul&gt;&lt;li&gt;</strong> for lists</li>
                  </ul>
                </div>
              </div>

              {submitError && (
                <div className="error-message">
                  <p>❌ {submitError}</p>
                </div>
              )}

              <div className="form-actions">
                <Link to="/blogs" className="btn-cancel">
                  Cancel
                </Link>
                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubmitBlog;
