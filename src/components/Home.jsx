import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const particleContainer = document.querySelector('.particles-container');
    if (!particleContainer) return;

    // Particle system configuration
    const config = {
      floatingParticles: 30,
      blinkingParticles: 15,
      shootingStars: 5,
      backgroundStars: 100,
      colors: ['#ff4500', '#ffffff', '#ff6b35', '#ffa500', '#ff8c00']
    };

    // Particle classes
    class Particle {
      constructor(container, type) {
        this.container = container;
        this.type = type;
        this.element = document.createElement('div');
        this.init();
      }

      init() {
        this.element.style.position = 'absolute';
        this.element.style.pointerEvents = 'none';
        this.element.style.zIndex = '1';
        
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        
        this.setupByType();
        this.container.appendChild(this.element);
      }

      setupByType() {
        const color = config.colors[Math.floor(Math.random() * config.colors.length)];
        
        switch(this.type) {
          case 'floating':
            this.setupFloating(color);
            break;
          case 'blinking':
            this.setupBlinking(color);
            break;
          case 'shooting':
            this.setupShooting(color);
            break;
          case 'background':
            this.setupBackgroundStar();
            break;
        }
      }

      setupFloating(color) {
        this.element.style.width = Math.random() * 4 + 2 + 'px';
        this.element.style.height = this.element.style.width;
        this.element.style.backgroundColor = color;
        this.element.style.borderRadius = '50%';
        this.element.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px ${color}`;
        
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.element.style.opacity = this.opacity;
      }

      setupBlinking(color) {
        this.element.style.width = Math.random() * 6 + 3 + 'px';
        this.element.style.height = this.element.style.width;
        this.element.style.backgroundColor = color;
        this.element.style.borderRadius = '50%';
        this.element.style.boxShadow = `0 0 ${Math.random() * 15 + 10}px ${color}`;
        
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.blinkSpeed = Math.random() * 0.05 + 0.02;
        this.opacity = 1;
        this.blinkDirection = 1;
      }

      setupShooting(color) {
        // Create shooting star as a small glowing line
        this.element.style.width = '40px';
        this.element.style.height = '2px';
        this.element.style.background = 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)';
        this.element.style.boxShadow = '0 0 6px rgba(255,255,255,0.8), 0 0 12px rgba(255,255,255,0.4)';
        this.element.style.borderRadius = '1px';
        this.element.style.transform = 'rotate(45deg)'; // 45-degree angle
        this.element.style.transformOrigin = 'center';
        
        // Start from random position in top area
        this.x = Math.random() * window.innerWidth * 0.8 - 100;
        this.y = -50;
        
        // Movement speed for diagonal trajectory (45 degrees)
        this.speedX = Math.random() * 2 + 3; // Right movement
        this.speedY = Math.random() * 2 + 3; // Down movement
        this.life = 0;
        this.maxLife = Math.random() * 100 + 80;
      }

      setupBackgroundStar() {
        // Small white background stars for space look
        this.element.style.width = Math.random() * 2 + 1 + 'px';
        this.element.style.height = this.element.style.width;
        this.element.style.backgroundColor = '#ffffff';
        this.element.style.borderRadius = '50%';
        this.element.style.boxShadow = '0 0 2px rgba(255,255,255,0.8)';
        
        // Random position across screen
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        
        // Slow twinkling effect
        this.opacity = Math.random() * 0.8 + 0.2;
        this.element.style.opacity = this.opacity;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;
      }

      update() {
        switch(this.type) {
          case 'floating':
            this.updateFloating();
            break;
          case 'blinking':
            this.updateBlinking();
            break;
          case 'shooting':
            this.updateShooting();
            break;
          case 'background':
            this.updateBackground();
            break;
        }
        
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
      }

      updateFloating() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x <= 0 || this.x >= window.innerWidth) this.speedX *= -1;
        if (this.y <= 0 || this.y >= window.innerHeight) this.speedY *= -1;
        
        // Keep in bounds
        this.x = Math.max(0, Math.min(window.innerWidth, this.x));
        this.y = Math.max(0, Math.min(window.innerHeight, this.y));
      }

      updateBlinking() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x <= 0 || this.x >= window.innerWidth) this.speedX *= -1;
        if (this.y <= 0 || this.y >= window.innerHeight) this.speedY *= -1;
        
        // Keep in bounds
        this.x = Math.max(0, Math.min(window.innerWidth, this.x));
        this.y = Math.max(0, Math.min(window.innerHeight, this.y));
        
        // Blinking effect
        this.opacity += this.blinkSpeed * this.blinkDirection;
        if (this.opacity >= 1) {
          this.opacity = 1;
          this.blinkDirection = -1;
        } else if (this.opacity <= 0.1) {
          this.opacity = 0.1;
          this.blinkDirection = 1;
        }
        this.element.style.opacity = this.opacity;
      }

      updateShooting() {
        // Simple diagonal movement
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;
        
        // Fade out as it travels
        const fadeRatio = Math.max(0, 1 - (this.life / this.maxLife));
        this.element.style.opacity = fadeRatio;
        
        // Reset when off screen or life expired
        if (this.x > window.innerWidth + 100 || this.y > window.innerHeight + 100 || this.life >= this.maxLife) {
          // Reset to new random position
          this.x = Math.random() * window.innerWidth * 0.8 - 100;
          this.y = -50;
          this.life = 0;
          this.maxLife = Math.random() * 100 + 80;
          this.speedX = Math.random() * 2 + 3;
          this.speedY = Math.random() * 2 + 3;
        }
      }

      updateBackground() {
        // Gentle twinkling effect
        this.opacity += this.twinkleSpeed * this.twinkleDirection;
        
        if (this.opacity >= 1) {
          this.opacity = 1;
          this.twinkleDirection = -1;
        } else if (this.opacity <= 0.2) {
          this.opacity = 0.2;
          this.twinkleDirection = 1;
        }
        
        this.element.style.opacity = this.opacity;
      }

      destroy() {
        if (this.element && this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
        }
      }
    }

    // Create particles
    const createParticleSystem = () => {
      // Clear existing particles
      particlesRef.current.forEach(particle => particle.destroy());
      particlesRef.current = [];

      // Create background stars first (lowest layer)
      for (let i = 0; i < config.backgroundStars; i++) {
        particlesRef.current.push(new Particle(particleContainer, 'background'));
      }

      // Create floating particles
      for (let i = 0; i < config.floatingParticles; i++) {
        particlesRef.current.push(new Particle(particleContainer, 'floating'));
      }

      // Create blinking particles
      for (let i = 0; i < config.blinkingParticles; i++) {
        particlesRef.current.push(new Particle(particleContainer, 'blinking'));
      }

      // Create shooting stars
      for (let i = 0; i < config.shootingStars; i++) {
        particlesRef.current.push(new Particle(particleContainer, 'shooting'));
      }
    };

    // Animation loop
    const animate = () => {
      particlesRef.current.forEach(particle => particle.update());
      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    createParticleSystem();
    animate();

    // Handle window resize
    const handleResize = () => {
      createParticleSystem();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      particlesRef.current.forEach(particle => particle.destroy());
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="home">
      {/* Animated Particles Background */}
      <div className="particles-container"></div>
      
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/kali-logo.png" alt="KALI Club" className="logo" />
            <span className="logo-text">KALI</span>
          </div>
          <ul className="nav-menu">
            <li><a href="#home" className="nav-link active">HOME</a></li>
            <li><a href="#about" className="nav-link">ABOUT</a></li>
            <li><a href="#activities" className="nav-link">ACTIVITIES</a></li>
            <li><Link to="/projects" className="nav-link">PROJECTS</Link></li>
            <li><Link to="/team" className="nav-link">TEAM</Link></li>
            <li><Link to="/blogs" className="nav-link">BLOGS</Link></li>
            <li><Link to="/profile" className="nav-link">PROFILE</Link></li>
            <li><Link to="/join-us" className="nav-link">JOIN US</Link></li>
            <li><a href="#contact" className="nav-link">CONTACT</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          {/* Main Title */}
          <h1 className="main-title">KALI</h1>

          {/* Subtitle */}
          <h2 className="subtitle">
            Knowledge in AI and Learning Innovation
          </h2>

          {/* Institution */}
          <p className="institution">
            An AI/ML Group at NIT Raipur
          </p>

          {/* CTA Buttons */}
          <div className="cta-buttons">
            <button className="btn btn-primary">
              <span>Explore Our Group</span>
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="about-container">
          <div className="section-header">
            <h2 className="section-title">About KALI</h2>
            <div className="section-divider"></div>
          </div>

          {/* Main Introduction */}
          <div className="intro-section">
            <div className="intro-content">
              <p className="intro-text">
                <strong>KALI (Knowledge in AI and Learning Innovation)</strong> is a student-driven club dedicated to exploring and advancing the world of Machine Learning, Artificial Intelligence, and Data Science. At NIT Raipur, the culture of coding and AI exploration is still in its early stages — and KALI is here to change that.
              </p>
              <p className="intro-text">
                Our mission is to ignite curiosity, build skills, and foster innovation in the field of ML/AI by providing a collaborative space where learners of all levels — from beginners to experts — can come together to learn, create, and grow.
              </p>
              <p className="intro-text">
                Through workshops, coding challenges, research discussions, and real-world projects, we aim to bridge the gap between theory and practice. Whether you are just getting started or already passionate about AI, KALI will give you the right platform to enhance your skills, collaborate with peers, and work on exciting projects that matter.
              </p>
            </div>
          </div>

          {/* Community Benefits */}
          <div className="community-section">
            <h3 className="community-title">By joining KALI, you become part of a community that:</h3>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">🎯</div>
                <h4 className="benefit-heading">Hands-on Learning</h4>
                <p className="benefit-description">
                  Encourages hands-on learning in ML/AI through practical projects and real-world applications.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">🧭</div>
                <h4 className="benefit-heading">Guidance & Mentorship</h4>
                <p className="benefit-description">
                  Provides guidance and mentorship to help you upskill and advance your AI/ML knowledge.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">💡</div>
                <h4 className="benefit-heading">Innovation Opportunities</h4>
                <p className="benefit-description">
                  Creates opportunities for innovation, hackathons, and collaborative projects.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">�️</div>
                <h4 className="benefit-heading">Coding Culture</h4>
                <p className="benefit-description">
                  Builds a culture of coding and problem-solving that our college truly needs.
                </p>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="mission-statement">
            <div className="mission-highlight">
              <h3 className="mission-text">At KALI, we don't just learn Machine Learning — we shape the future with it.</h3>
            </div>
          </div>

          {/* What Makes KALI Unique */}
          <div className="unique-section">
            <h3 className="unique-title">What Makes KALI Unique</h3>
            <div className="unique-intro">
              <p className="unique-text">
                While many clubs stop at coding practice, KALI goes a step further. We believe true growth in Machine Learning comes not just from writing code, but from understanding research, questioning ideas, and building something new from them.
              </p>
            </div>

            <div className="unique-offerings">
              <h4 className="offerings-subtitle">That's why KALI offers:</h4>
              
              <div className="offerings-grid">
                <div className="offering-card">
                  <div className="offering-icon">📋</div>
                  <h4 className="offering-title">Research Paper Discussions</h4>
                  <p className="offering-description">
                    Decode cutting-edge ML and AI research with peers, break down complex ideas, and learn how innovations are shaping the future.
                  </p>
                </div>

                <div className="offering-card">
                  <div className="offering-icon">🎓</div>
                  <h4 className="offering-title">In-House Lectures</h4>
                  <p className="offering-description">
                    Peer-to-peer knowledge sharing sessions where members teach, learn, and grow together in a collaborative, supportive environment.
                  </p>
                </div>

                <div className="offering-card">
                  <div className="offering-icon">🔬</div>
                  <h4 className="offering-title">Research Incubation Program</h4>
                  <p className="offering-description">
                    A unique initiative to nurture innovative ideas, support mini-research projects, and guide members towards publishing their own work in conferences and journals.
                  </p>
                </div>
              </div>
            </div>

            <div className="conclusion-section">
              <p className="conclusion-text">
                This blend of learning, discussion, and innovation makes KALI not just a club, but a <strong>launchpad for future researchers, engineers, and innovators</strong> in AI and Machine Learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="activities" id="activities">
        <div className="activities-container">
          <div className="section-header">
            <h2 className="section-title">Our Activities</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">
              Explore our diverse range of AI/ML activities designed to enhance learning and foster innovation
            </p>
          </div>

          <div className="activities-grid">
            <div className="activity-card">
              <div className="activity-icon">📚</div>
              <h3 className="activity-title">Weekly Reading Groups</h3>
              <p className="activity-description">
                Collaborative sessions exploring cutting-edge research papers, AI breakthroughs, and emerging trends in machine learning.
              </p>
              <div className="activity-tags">
                <span className="tag">Research</span>
                <span className="tag">Discussion</span>
              </div>
            </div>

            <div className="activity-card">
              <div className="activity-icon">🎓</div>
              <h3 className="activity-title">In-house ML Foundation Lectures</h3>
              <p className="activity-description">
                Comprehensive lecture series covering fundamental ML concepts, algorithms, and practical implementations from basics to advanced topics.
              </p>
              <div className="activity-tags">
                <span className="tag">Education</span>
                <span className="tag">Foundation</span>
              </div>
            </div>

            <div className="activity-card">
              <div className="activity-icon">🛠️</div>
              <h3 className="activity-title">Specialized Workshops</h3>
              <p className="activity-description">
                Hands-on workshops on specific AI/ML tools, frameworks, and technologies including TensorFlow, PyTorch, and cloud platforms.
              </p>
              <div className="activity-tags">
                <span className="tag">Hands-on</span>
                <span className="tag">Tools</span>
              </div>
            </div>

            <div className="activity-card">
              <div className="activity-icon">🏆</div>
              <h3 className="activity-title">Data Forming Competitions</h3>
              <p className="activity-description">
                Competitive events focused on data preprocessing, feature engineering, and model optimization to solve real-world challenges.
              </p>
              <div className="activity-tags">
                <span className="tag">Competition</span>
                <span className="tag">Data Science</span>
              </div>
            </div>

            <div className="activity-card">
              <div className="activity-icon">🥇</div>
              <h3 className="activity-title">Mini Kaggle Challenges</h3>
              <p className="activity-description">
                Internal competitions mimicking Kaggle-style challenges to build practical ML skills and encourage healthy competition.
              </p>
              <div className="activity-tags">
                <span className="tag">Kaggle</span>
                <span className="tag">Challenge</span>
              </div>
            </div>

            <div className="activity-card">
              <div className="activity-icon">🔬</div>
              <h3 className="activity-title">Research Incubation Program</h3>
              <p className="activity-description">
                Mentorship program supporting student research projects from ideation to publication, fostering innovation and academic excellence.
              </p>
              <div className="activity-tags">
                <span className="tag">Research</span>
                <span className="tag">Mentorship</span>
              </div>
            </div>

            <div className="activity-card">
              <div className="activity-icon">⚔️</div>
              <h3 className="activity-title">ML Coding Battles</h3>
              <p className="activity-description">
                Fast-paced coding competitions focusing on algorithm implementation, optimization, and problem-solving in machine learning contexts.
              </p>
              <div className="activity-tags">
                <span className="tag">Coding</span>
                <span className="tag">Speed</span>
              </div>
            </div>

            <div className="activity-card">
              <div className="activity-icon">📰</div>
              <h3 className="activity-title">Newsletters and Blogs</h3>
              <p className="activity-description">
                Regular publications sharing insights, tutorials, member achievements, and the latest developments in AI/ML community.
              </p>
              <div className="activity-tags">
                <span className="tag">Content</span>
                <span className="tag">Community</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
