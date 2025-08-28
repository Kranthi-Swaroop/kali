import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './JoinUs.css';
import ParticleSystem from './ParticleSystem';

const JoinUs = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    branchYear: '',
    preferredRole: '',
    domain: '',
    programmingExperience: '',
    motivation: '',
    portfolioLink: ''
  });

  const roles = [
    {
      id: 'architect',
      title: 'ARCHITECT',
      subtitle: 'Core Team Members',
      description: 'Lead projects, mentor junior members, and shape the technical direction of KALI. Architects are responsible for major decision-making and project oversight.',
      requirements: [
        'Strong programming skills in Python',
        'Experience with AI/ML frameworks',
        'Leadership and mentoring abilities',
        'Previous project experience',
        'Good communication skills'
      ],
      responsibilities: [
        'Lead and manage project teams',
        'Mentor Neurons and Parameters',
        'Design system architecture',
        'Review code and provide guidance',
        'Represent KALI in competitions',
        'Provide mentorship to students for research'
      ],

    },
    {
      id: 'neuron',
      title: 'NEURON',
      subtitle: 'Active Contributors',
      description: 'The backbone of KALI, actively contributing to projects and learning advanced AI/ML concepts. Neurons work closely with Architects on various initiatives.',
      requirements: [
        'Basic programming knowledge',
        'Interest in AI/ML technologies',
        'Willingness to learn and collaborate',
        'Regular availability for meetings',
        'Academic standing in good condition',
        'Basic knowledge of AI/ML concepts'
      ],
      responsibilities: [
        'Contribute to ongoing projects',
        'Participate in workshops and seminars',
        'Collaborate with team members',
        'Learn new technologies',
        'Share knowledge with Parameters'
      ],

    },
    {
      id: 'parameter',
      title: 'PARAMETER',
      subtitle: 'Learning Members',
      description: 'Entry-level members beginning their AI/ML journey. Parameters focus on building foundational skills and contributing to smaller projects.',
      requirements: [
        'Basic computer science knowledge',
        'Enthusiasm for AI/ML',
        'Regular attendance at meetings',
        'Willingness to learn from scratch',
        'Commitment to improvement',
        'Should have creative thinking'
      ],
      responsibilities: [
        'Attend learning sessions',
        'Complete assigned tutorials',
        'Participate in beginner projects',
        'Support club activities',
        'Build foundational skills'
      ],

    }
  ];

  const membershipProcess = [
    {
      step: 1,
      title: 'Application Submission',
      description: 'Fill out the online application form with your details, interests, and preferred role.'
    },
    {
      step: 2,
      title: 'Interview Round',
      description: 'Participate in a brief interview with current team members to discuss your goals and fit.'
    },
    {
      step: 3,
      title: 'Onboarding',
      description: 'Join orientation sessions and get integrated into your assigned team and projects.'
    }
  ];

  const generalBenefits = [
    {
      icon: '🎓',
      title: 'Skill Development',
      description: 'Learn cutting-edge AI/ML technologies through hands-on projects and workshops.'
    },
    {
      icon: '🤝',
      title: 'Networking',
      description: 'Connect with like-minded peers, alumni, and industry professionals.'
    },
    {
      icon: '🏆',
      title: 'Competitions',
      description: 'Participate in national and international AI/ML competitions and hackathons.'
    },
    {
      icon: '💼',
      title: 'Research Exposure',
      description: 'Personalised mentoring-driven research program guiding students from idea to publication.'
    },
    {
      icon: '📚',
      title: 'Learning Resources',
      description: 'Access to premium courses, research papers, and learning materials.'
    },
    {
      icon: '🌟',
      title: 'Research Paper Discussion',
      description: 'Daily research paper discussions to spark ideation and inspire new research directions.'
    }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleApplyNow = () => {
    setShowApplicationForm(true);
  };

  const closeApplicationForm = () => {
    setShowApplicationForm(false);
    setSelectedRole(null);
    setSubmitStatus(null);
    // Reset form data
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      branchYear: '',
      preferredRole: '',
      domain: '',
      programmingExperience: '',
      motivation: '',
      portfolioLink: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URI}applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: result.message || 'Application submitted successfully! We will contact you soon.'
        });
        // Keep form open to show success message, but reset form data
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          branchYear: '',
          preferredRole: '',
          domain: '',
          programmingExperience: '',
          motivation: '',
          portfolioLink: ''
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || 'Failed to submit application. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="join-us-page">
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
            <li><Link to="/team" className="nav-link">TEAM</Link></li>
            <li><Link to="/blogs" className="nav-link">BLOGS</Link></li>
            <li><Link to="/join-us" className="nav-link active">JOIN US</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="join-hero">
        <div className="join-hero-content">
          <h1 className="join-main-title">JOIN KALI</h1>
          <div className="section-divider"></div>
          <p className="join-subtitle">
            Become part of NIT Raipur's premier AI/ML community and shape the future of technology
          </p>
        </div>
      </section>

      {/* Membership Process */}
      <section className="membership-process">
        <div className="process-container">
          <h2 className="section-title">Membership Process</h2>
          <div className="process-steps">
            {membershipProcess.map((step, index) => (
              <div key={index} className="process-step">
                <div className="step-number">{step.step}</div>
                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
                {index < membershipProcess.length - 1 && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Roles */}
      <section className="available-roles">
        <div className="roles-container">
          <h2 className="section-title">Choose Your Path</h2>
          <p className="roles-subtitle">
            Select a role that matches your current skill level and career goals
          </p>
          
          <div className="roles-grid">
            {roles.map((role) => (
              <div 
                key={role.id} 
                className={`role-card ${selectedRole?.id === role.id ? 'selected' : ''}`}
                onClick={() => handleRoleSelect(role)}
              >
                <div className="role-header">
                  <h3 className="role-title">{role.title}</h3>
                  <p className="role-subtitle">{role.subtitle}</p>
                </div>
                
                <p className="role-description">{role.description}</p>
                
                <div className="role-details">
                  <div className="role-section">
                    <h4>Requirements</h4>
                    <ul>
                      {role.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="role-section">
                    <h4>Responsibilities</h4>
                    <ul>
                      {role.responsibilities.map((resp, index) => (
                        <li key={index}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                  
 
                </div>
                
                <button 
                  className="apply-role-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApplyNow();
                  }}
                >
                  Apply for {role.title}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-container">
          <h2 className="section-title">Why Join KALI?</h2>
          <div className="benefits-grid">
            {generalBenefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Begin Your Journey?</h2>
          <p className="cta-description">
            Join hundreds of students who have transformed their careers through KALI
          </p>
          <div className="cta-buttons">
            <button className="cta-btn primary" onClick={handleApplyNow}>
              Apply Now
            </button>
          </div>
        </div>
      </section>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="application-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Application Form</h2>
              <button className="close-btn" onClick={closeApplicationForm}>×</button>
            </div>
            
            <form className="application-form" onSubmit={handleFormSubmit}>
              {submitStatus && (
                <div className={`status-message ${submitStatus.type}`}>
                  {submitStatus.message}
                </div>
              )}
              
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number *</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Branch & Year *</label>
                <input 
                  type="text" 
                  name="branchYear"
                  value={formData.branchYear}
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Science - 3rd Year" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Preferred Role *</label>
                <select 
                  name="preferredRole"
                  value={formData.preferredRole}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="architect">Architect</option>
                  <option value="neuron">Neuron</option>
                  <option value="parameter">Parameter</option>
                </select>
              </div>

              <div className="form-group">
                <label>Domain *</label>
                <select 
                  name="domain"
                  value={formData.domain}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Domain</option>
                  <option value="computer-vision">Computer Vision</option>
                  <option value="natural-language-processing">Natural Language Processing</option>
                  <option value="data-science">Data Science</option>
                  <option value="gen-ai">Gen AI</option>
                  <option value="reinforcement-learning">Reinforcement Learning</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Programming Experience</label>
                <textarea 
                  name="programmingExperience"
                  value={formData.programmingExperience}
                  onChange={handleInputChange}
                  placeholder="Describe your programming background and any projects you've worked on..."
                ></textarea>
              </div>
              
              <div className="form-group">
                <label>Why do you want to join KALI?</label>
                <textarea 
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  placeholder="Tell us about your motivation and goals..."
                ></textarea>
              </div>
              
              <div className="form-group">
                <label>Portfolio/GitHub Link</label>
                <input 
                  type="url" 
                  name="portfolioLink"
                  value={formData.portfolioLink}
                  onChange={handleInputChange}
                  placeholder="https://github.com/yourusername" 
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={closeApplicationForm}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinUs;
