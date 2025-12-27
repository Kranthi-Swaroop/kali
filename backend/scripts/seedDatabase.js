import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TeamMember from '../models/TeamMember.js';
import Project from '../models/Project.js';
import BlogPost from '../models/BlogPost.js';
import User from '../models/User.js';
import connectDB from '../config/database.js';

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await TeamMember.deleteMany({});
    await Project.deleteMany({});
    await BlogPost.deleteMany({});
    await User.deleteMany({});

    // Create a seed user
    console.log('👤 Creating seed user...');
    const seedUser = await User.create({
      email: "admin@kali-team.com",
      password: "password123", // This will be hashed by the model
      profile: {
        firstName: "Admin",
        lastName: "User",
        bio: "System administrator"
      },
      role: "admin"
    });

    // Seed Team Members
    console.log('👥 Seeding team members...');
    const teamMembers = await TeamMember.create([
      {
        name: "John Doe",
        role: "Team Lead",
        bio: "Experienced developer with expertise in cybersecurity and web development.",
        image: "/api/placeholder/300/300",
        skills: ["Leadership", "Cybersecurity", "Full Stack Development"],
        social: {
          linkedin: "https://linkedin.com/in/johndoe",
          github: "https://github.com/johndoe",
          email: "john@kali-team.com"
        }
      },
      {
        name: "Jane Smith",
        role: "Frontend Developer",
        bio: "Creative developer specializing in React and modern web technologies.",
        image: "/api/placeholder/300/300",
        skills: ["React", "JavaScript", "UI/UX Design"],
        social: {
          linkedin: "https://linkedin.com/in/janesmith",
          github: "https://github.com/janesmith",
          email: "jane@kali-team.com"
        }
      },
      {
        name: "Mike Johnson",
        role: "Backend Developer",
        bio: "Systems architect with deep knowledge in server-side technologies.",
        image: "/api/placeholder/300/300",
        skills: ["Node.js", "Database Design", "API Development"],
        social: {
          linkedin: "https://linkedin.com/in/mikejohnson",
          github: "https://github.com/mikejohnson",
          email: "mike@kali-team.com"
        }
      }
    ]);

    // Seed Projects
    console.log('🚀 Seeding projects...');
    const projects = await Project.create([
      {
        title: "Smart Door Guard",
        slug: "smart-door-guard",
        description: "AI-powered security system for intelligent door monitoring and access control.",
        fullDescription: "A comprehensive AI-powered security solution that combines facial recognition, real-time monitoring, and intelligent access control to provide advanced door security for homes and businesses.",
        image: "/smartdoorguard.jpg",
        technologies: ["Python", "TensorFlow", "OpenCV", "Raspberry Pi"],
        status: "Active",
        category: "Security",
        startDate: new Date("2024-01-15"),
        githubUrl: "https://github.com/kali-team/smart-door-guard",
        demoUrl: "https://smartdoorguard.demo.com",
        features: [
          "Facial recognition",
          "Real-time monitoring",
          "Mobile notifications",
          "Access logs"
        ],
        teamMembers: [
          { name: teamMembers[0].name, role: teamMembers[0].role },
          { name: teamMembers[2].name, role: teamMembers[2].role }
        ],
        createdBy: seedUser._id,
        priority: "High"
      },
      {
        title: "Cybersecurity Dashboard",
        slug: "cybersecurity-dashboard",
        description: "Comprehensive dashboard for monitoring network security and threat detection.",
        fullDescription: "A real-time cybersecurity monitoring dashboard that provides comprehensive network security analysis, threat detection, and interactive visualizations for security professionals.",
        image: "/api/placeholder/400/250",
        technologies: ["React", "Node.js", "D3.js", "MongoDB"],
        status: "Completed",
        category: "Cybersecurity",
        startDate: new Date("2023-09-01"),
        endDate: new Date("2024-02-28"),
        githubUrl: "https://github.com/kali-team/cyber-dashboard",
        demoUrl: "https://cyberdash.demo.com",
        features: [
          "Real-time threat monitoring",
          "Interactive visualizations",
          "Alert system",
          "Reporting tools"
        ],
        teamMembers: [
          { name: teamMembers[1].name, role: teamMembers[1].role },
          { name: teamMembers[2].name, role: teamMembers[2].role }
        ],
        createdBy: seedUser._id,
        priority: "High"
      },
      {
        title: "Penetration Testing Toolkit",
        slug: "penetration-testing-toolkit",
        description: "Automated penetration testing tools for security assessment.",
        fullDescription: "A comprehensive suite of automated penetration testing tools designed to help security professionals conduct thorough security assessments and vulnerability testing.",
        image: "/api/placeholder/400/250",
        technologies: ["Python", "Bash", "Metasploit", "Nmap"],
        status: "In Progress",
        category: "Penetration Testing",
        startDate: new Date("2024-03-01"),
        githubUrl: "https://github.com/kali-team/pen-test-toolkit",
        features: [
          "Automated vulnerability scanning",
          "Custom exploit modules",
          "Report generation",
          "Integration with existing tools"
        ],
        teamMembers: [
          { name: teamMembers[0].name, role: teamMembers[0].role }
        ],
        createdBy: seedUser._id,
        priority: "Medium"
      }
    ]);

    // Seed Blog Posts
    console.log('📝 Seeding blog posts...');
    await BlogPost.create([
      {
        title: "Getting Started with Ethical Hacking",
        slug: "getting-started-with-ethical-hacking",
        excerpt: "Learn the fundamentals of ethical hacking and how to get started in cybersecurity.",
        content: `# Getting Started with Ethical Hacking

Ethical hacking is a crucial skill in today's digital landscape. This comprehensive guide will help you understand the basics and get started on your journey.

## What is Ethical Hacking?

Ethical hacking involves the same techniques and tools as malicious hacking, but it's performed legally and with permission to help organizations identify and fix security vulnerabilities.

## Prerequisites

- Basic understanding of networking
- Familiarity with operating systems (Linux, Windows)
- Programming knowledge (Python, Bash scripting)
- Strong analytical thinking

## Getting Started

1. **Learn the Basics**: Start with networking fundamentals
2. **Choose Your Tools**: Familiarize yourself with Kali Linux
3. **Practice Legally**: Use platforms like HackTheBox, TryHackMe
4. **Get Certified**: Consider certifications like CEH, OSCP

## Conclusion

Ethical hacking is a rewarding career path that helps make the digital world safer. Start with the basics and practice regularly.`,
        author: "John Doe",
        authorImage: "/api/placeholder/50/50",
        publishedAt: new Date("2024-01-15T10:00:00Z"),
        tags: ["Ethical Hacking", "Cybersecurity", "Beginner"],
        category: "Tutorial",
        readTime: 8,
        featured: true,
        image: "/api/placeholder/800/400",
        status: "published",
        createdBy: seedUser._id
      },
      {
        title: "Advanced Penetration Testing Techniques",
        slug: "advanced-penetration-testing-techniques",
        excerpt: "Explore advanced methodologies and tools for comprehensive security assessments.",
        content: `# Advanced Penetration Testing Techniques

Take your penetration testing skills to the next level with these advanced techniques and methodologies.

## Advanced Reconnaissance

- OSINT gathering techniques
- Social engineering approaches
- Advanced scanning methodologies

## Exploitation Techniques

- Buffer overflow exploitation
- SQL injection advanced techniques
- Privilege escalation methods

## Post-Exploitation

- Maintaining persistence
- Data exfiltration methods
- Covering tracks

## Tools and Frameworks

- Metasploit advanced modules
- Custom payload development
- Automated testing frameworks

## Best Practices

Always ensure you have proper authorization before conducting any penetration testing activities.`,
        author: "Jane Smith",
        authorImage: "/api/placeholder/50/50",
        publishedAt: new Date("2024-02-20T14:30:00Z"),
        tags: ["Penetration Testing", "Advanced", "Security"],
        category: "Advanced",
        readTime: 12,
        featured: false,
        image: "/api/placeholder/800/400",
        status: "published",
        createdBy: seedUser._id
      },
      {
        title: "Building Secure Web Applications",
        slug: "building-secure-web-applications",
        excerpt: "Learn how to develop web applications with security in mind from the ground up.",
        content: `# Building Secure Web Applications

Security should be built into applications from the beginning, not added as an afterthought.

## Common Vulnerabilities

- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- SQL Injection
- Authentication flaws

## Secure Development Practices

- Input validation and sanitization
- Proper authentication mechanisms
- Secure session management
- Error handling

## Security Testing

- Static code analysis
- Dynamic application security testing
- Penetration testing

## Deployment Security

- Secure server configuration
- HTTPS implementation
- Regular security updates

Building secure applications requires a comprehensive approach throughout the development lifecycle.`,
        author: "Mike Johnson",
        authorImage: "/api/placeholder/50/50",
        publishedAt: new Date("2024-03-10T09:15:00Z"),
        tags: ["Web Security", "Development", "Best Practices"],
        category: "Development",
        readTime: 10,
        featured: true,
        image: "/api/placeholder/800/400",
        status: "published",
        createdBy: seedUser._id
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`👥 Created ${teamMembers.length} team members`);
    console.log(`🚀 Created ${projects.length} projects`);
    console.log(`📝 Created 3 blog posts`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
    process.exit(0);
  }
};

// Run the seed script
if (process.argv[2] === '--run') {
  seedData();
}

export default seedData;
