import React, { useEffect, useRef } from 'react';

const ParticleSystem = () => {
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

  return <div className="particles-container"></div>;
};

export default ParticleSystem;
