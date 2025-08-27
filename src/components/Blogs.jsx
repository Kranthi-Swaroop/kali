import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Blogs.css';
import ParticleSystem from './ParticleSystem';

const Blogs = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [dynamicBlogs, setDynamicBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/blogs?status=published&limit=20');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const result = await response.json();
        setDynamicBlogs(result.data || []);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs from server');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Static blog posts (original content)
  const staticBlogs = [
    {
      id: 1,
      title: "From the Curse to the Cure: Why LoRA Works",
      excerpt: "Exploring how LoRA transforms the curse of dimensionality into efficient model adaptation through the manifold hypothesis and low-rank mathematics.",
      author: "Chirag Garg",
      date: "August 20, 2025",
      readTime: "8 min read",
      category: "Deep Learning",
      tags: ["LoRA", "Machine Learning", "Optimization", "Neural Networks"],
      image: "/blog-lora.jpg",
      content: `
        <h2>From the Curse to the Cure: Why LoRA Works</h2>
        
        <p>When we first step into machine learning, everything feels magical — models with millions or even billions of parameters somehow learn to recognize cats, translate languages, or write essays. But behind this magic lies a very old problem: <strong>the curse of dimensionality</strong>.</p>
        
        <p>Think about it this way: suppose you're trying to find a friend in a city. In a small town, you only need a few clues, the street and maybe the house color. But if your friend is hiding in a massive futuristic megacity with thousands of streets stacked in skyscrapers and underground tunnels, those same clues suddenly become almost useless. You'd need many more hints to narrow down the search.</p>
        
        <p>This is exactly what happens in high-dimensional spaces. As the number of features grows, the space expands so fast that data points become sparse, distances lose meaning, and learning requires an enormous amount of data. That's the curse: <em>more dimensions make the problem harder, not easier</em>.</p>
        
        <h3>The Hidden Structure</h3>
        
        <p>But here's where things get interesting: although our data lives in these high-dimensional spaces, it rarely uses all of that space. Images, speech, text — they look complicated, but in reality they follow patterns. For example, the set of all possible 256×256 pixel images is unimaginably huge. But the set of images that actually look like faces, cars, or landscapes is just a tiny slice of that space. It's like a crumpled sheet of paper inside a box: the paper sits in 3D space, but all the action really happens on a thin 2D surface.</p>
        
        <p>This is the <strong>manifold hypothesis</strong>: real-world data, though high-dimensional in raw form, actually lies on low-dimensional surfaces embedded in that larger space. And suddenly, the curse looks less scary because instead of trying to cover the whole megacity, we just need to map the few neighborhoods where people actually live. Deep learning works so well because neural networks are incredibly good at discovering and untangling these hidden manifolds.</p>
        
        <h3>The LoRA Innovation</h3>
        
        <p>Now, here's the clever twist. If data lies on low-dimensional manifolds, then maybe models don't need to explore the entire giant parameter space either. And this is exactly the insight behind <strong>LoRA (Low-Rank Adaptation)</strong>. When we fine-tune a massive model, instead of changing every single weight (which is expensive and memory-hungry), LoRA says: let's only move the model along the important low-rank directions — the manifold of useful adaptations. In other words, instead of remodeling the whole city, we just renovate the few key streets where people actually walk.</p>
        
        <p>This is why LoRA is so powerful. It transforms what could have been an impossible problem — adapting billion-parameter models — into something efficient and practical. By embracing the geometry of data and models, it lets us fine-tune giant systems with just a fraction of the resources.</p>
        
        <h3>The Journey</h3>
        
        <p>And that, in a nutshell, is the journey:</p>
        <ul>
          <li>We start with a <strong>curse</strong> — high dimensions that make learning hard.</li>
          <li>We discover the <strong>cure</strong> — data really lives on simpler manifolds.</li>
          <li>And we end with the <strong>trick</strong> — LoRA, which harnesses this insight to adapt models efficiently.</li>
        </ul>
        
        <p>In the end, it's a story of turning complexity into structure, and structure into smarter learning.</p>
      `
    },
    {
      id: 2,
      title: "Why Contrastive Learning Works: Pulling and Pushing in Latent Space",
      excerpt: "Understanding how contrastive learning transforms unlabeled data into meaningful representations through the simple act of comparison and spatial organization.",
      author: "Chirag Garg", 
      date: "August 18, 2025",
      readTime: "7 min read",
      category: "Self-Supervised Learning",
      tags: ["Contrastive Learning", "SimCLR", "CLIP", "Representation Learning"],
      image: "/blog-contrastive.jpg",
      content: `
        <h2>Why Contrastive Learning Works: Pulling and Pushing in Latent Space</h2>
        
        <p>Imagine you walk into a crowded party full of strangers. At first, it feels like noise — dozens of faces, voices, and gestures blending together. But slowly, your brain begins to organize the chaos. That guy in the corner laughs like your old classmate. The woman by the table has the same hairstyle as your cousin. Even though you don't know their names, you've already begun grouping them by similarity and separating them by difference.</p>
        
        <p>This simple act of comparing — noticing what is alike and what is not — is one of the oldest tricks our brains know. And it turns out, it's also one of the most powerful tricks in modern machine learning. That's the essence of <strong>contrastive learning</strong>.</p>
        
        <h3>The Labeling Challenge</h3>
        
        <p>The challenge in machine learning is that most data comes without labels. Millions of images, sounds, and texts exist out there, but hardly anyone has taken the time to tag them neatly as "dog," "cat," or "car." If we were to rely only on labeled data, we'd barely scratch the surface of what's available. So instead of asking the model to recognize <em>what</em> something is, contrastive learning asks it to recognize <em>how things relate</em>.</p>
        
        <h3>The Elegant Recipe</h3>
        
        <p>The recipe is surprisingly elegant: if two views come from the same object — say a photo of a dog and a slightly cropped or color-shifted version of it — the model should <strong>pull their representations closer</strong>. If two views come from different objects — a dog and a cat — their representations should be <strong>pushed apart</strong>. Do this over and over with thousands of pairs, and slowly the model begins to tidy up its world. Things that belong together fall into clusters; things that don't belong drift apart.</p>
        
        <h3>The Geometry of Meaning</h3>
        
        <p>What emerges is a <strong>geometry of meaning</strong>. In this learned space, all dogs gather nearby, while cats sit in a different region. Within the dog cluster, golden retrievers might snuggle close to labradors, but both stay farther from huskies. None of this came from labels — it comes entirely from the act of pulling and pushing through comparisons. The messy universe of pixels is sculpted into an organized landscape.</p>
        
        <p>Once you have such a landscape, amazing things become possible. You can classify new data simply by seeing where it lands — find the nearest cluster, and you've found its identity. You can transfer knowledge to new tasks without retraining everything from scratch. You can even bridge modalities, like connecting images with text, by pulling together pairs that belong and pushing apart those that don't.</p>
        
        <h3>Real-World Impact</h3>
        
        <p>This is the magic behind systems like <strong>SimCLR</strong>, which learned image features as good as supervised ones, or <strong>CLIP</strong>, which aligned pictures and captions so well that it can "understand" both language and vision.</p>
        
        <p>At its heart, contrastive learning works because it mirrors something deeply human. We rarely learn in isolation; we learn by comparison. We know an apple is an apple not because someone labeled every fruit for us, but because over time we realized this red fruit is like that other one, but different from a banana. By doing the same — pulling the similar, pushing the different — our models slowly carve sense out of raw data, discovering structure without ever needing names.</p>
        
        <p>Contrastive learning, in the end, is a story of turning noise into meaning through the most natural act of all: noticing what belongs together, and what does not.</p>
      `
    }
  ];

  // Combine static and dynamic blogs, with dynamic blogs first
  const allBlogs = [...dynamicBlogs.map(blog => ({
    ...blog,
    date: new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    readTime: `${blog.readTime || 5} min read`,
    image: blog.image?.startsWith('/') ? `http://localhost:5000${blog.image}` : blog.image,
    // Format content for HTML display - convert line breaks to paragraphs
    content: blog.content ? formatContentForDisplay(blog.content) : '',
    isDynamic: true
  })), ...staticBlogs];

  // Helper function to format plain text content into HTML
  const formatContentForDisplay = (content) => {
    if (!content) return '';
    
    // If content already contains HTML tags, return as is
    if (content.includes('<') && content.includes('>')) {
      return content;
    }
    
    // Convert plain text to HTML paragraphs
    return content
      .split('\n\n')
      .filter(paragraph => paragraph.trim().length > 0)
      .map(paragraph => `<p>${paragraph.trim().replace(/\n/g, '<br>')}</p>`)
      .join('');
  };

  // Helper function to format plain text content into HTML
  const formatBlogContent = (content) => {
    console.log('Input content:', content);
    
    if (!content) {
      console.log('No content provided');
      return '<p>No content available.</p>';
    }
    
    // If content already contains HTML tags, return as is
    if (content.includes('<h') || content.includes('<p>') || content.includes('<div>')) {
      console.log('Content already has HTML, returning as-is');
      return content;
    }
    
    // Simple conversion: just wrap in paragraphs and handle line breaks
    const formattedContent = content
      .trim()
      .split('\n\n')
      .filter(para => para.trim())
      .map(para => `<p>${para.trim().replace(/\n/g, '<br/>')}</p>`)
      .join('');
    
    console.log('Formatted content:', formattedContent);
    return formattedContent || `<p>${content}</p>`;
  };

  const handleBlogClick = async (blog) => {
    if (blog.isDynamic && blog.slug) {
      // Fetch full blog content for dynamic blogs
      try {
        const response = await fetch(`http://localhost:5000/api/blogs/${blog.slug}`);
        if (response.ok) {
          const result = await response.json();
          const fullBlog = {
            ...blog,
            content: formatBlogContent(result.data.content)
          };
          setSelectedBlog(fullBlog);
        } else {
          console.error('Failed to fetch blog content');
          setSelectedBlog(blog);
        }
      } catch (error) {
        console.error('Error fetching blog content:', error);
        setSelectedBlog(blog);
      }
    } else {
      // For static blogs, use content as is
      setSelectedBlog(blog);
    }
    setShowBlogModal(true);
  };

  const closeBlogModal = () => {
    setShowBlogModal(false);
    setSelectedBlog(null);
  };

  const copyBlogLink = () => {
    if (selectedBlog) {
      // For dynamic blogs, use the slug-based URL, for static blogs use a hash-based URL
      const blogUrl = selectedBlog.isDynamic && selectedBlog.slug
        ? `${window.location.origin}/blogs/${selectedBlog.slug}`
        : `${window.location.origin}/blogs#${selectedBlog.title.replace(/\s+/g, '-').toLowerCase()}`;
      
      navigator.clipboard.writeText(blogUrl).then(() => {
        // You could add a toast notification here
        alert('Link copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy link:', err);
        alert('Failed to copy link');
      });
    }
  };

  return (
    <div className="blogs-page">
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
            <li><Link to="/blogs" className="nav-link active">BLOGS</Link></li>
            <li><Link to="/profile" className="nav-link">PROFILE</Link></li>
            <li><Link to="/join-us" className="nav-link">JOIN US</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="blogs-hero">
        <div className="blogs-hero-content">
          <h1 className="blogs-main-title">KALI BLOGS</h1>
          <div className="section-divider"></div>
          <p className="blogs-subtitle">
            Explore cutting-edge research, insights, and discoveries in AI/ML from our community
          </p>
        </div>
      </section>

      {/* Blogs Section */}
      <section className="blogs-section">
        <div className="blogs-container">
          <div className="section-header">
            <h2 className="section-title">Latest Articles</h2>
            <p className="section-description">
              Deep dives into machine learning concepts, research breakthroughs, and technical insights
            </p>
          </div>
          
          {loading && (
            <div className="loading-message">
              <p>Loading articles...</p>
            </div>
          )}
          
          {error && (
            <div className="error-message">
              <p>⚠️ {error}</p>
              <p>Showing offline content only.</p>
            </div>
          )}
          
          <div className="blogs-list">
            {allBlogs.map((blog, index) => (
              <article 
                key={blog.id || blog._id || index} 
                className="blog-card"
                onClick={() => handleBlogClick(blog)}
              >
                <div className="blog-image">
                  <img 
                    src={blog.image} 
                    alt={blog.title}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSJyZ2JhKDI1NSwgNjksIDAsIDAuMSkiLz4KPHN2ZyB4PSI0MCIgeT0iNDAiIHdpZHRoPSIzMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMzIwIDEyMCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xNjAgNjBMMTIwIDEwMEgyMDBMMTYwIDYwWiIgZmlsbD0icmdiYSgyNTUsIDY5LCAwLCAwLjMpIi8+CjxjaXJjbGUgY3g9IjEyNSIgY3k9IjQwIiByPSI4IiBmaWxsPSJyZ2JhKDI1NSwgNjksIDAsIDAuNSkiLz4KPC9zdmc+Cjx0ZXh0IHg9IjIwMCIgeT0iMTA1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9InJnYmEoMjU1LCA2OSwgMCwgMC43KSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QmxvZyBJbWFnZTwvdGV4dD4KPC9zdmc+';
                    }}
                  />
                  <div className="blog-category">{blog.category}</div>
                </div>
                
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="blog-author">{blog.author}</span>
                    <span className="blog-date">{blog.date}</span>
                    <span className="blog-read-time">{blog.readTime}</span>
                  </div>
                  
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-excerpt">{blog.excerpt}</p>
                  
                  <div className="blog-tags">
                    {blog.tags.map((tag, index) => (
                      <span key={index} className="blog-tag">{tag}</span>
                    ))}
                  </div>
                  
                  <div className="blog-actions">
                    <button className="read-more-btn">
                      Read Full Article
                      <span className="arrow">→</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {/* Add Blog Card */}
            <article className="blog-card add-blog-card">
              <div className="add-blog-content">
                <div className="add-blog-icon">✍️</div>
                <h3 className="add-blog-title">Share Your Knowledge</h3>
                <p className="add-blog-description">
                  Have insights about AI/ML? Write a blog post and share your knowledge with the KALI community.
                </p>
                <Link to="/submit-blog" className="add-blog-btn">
                  Write Article
                </Link>
              </div>
            </article>
          </div>
          
          {/* Coming Soon */}
          <div className="coming-soon-section">
            <h3 className="coming-soon-title">More Articles Coming Soon</h3>
            <p className="coming-soon-description">
              Our team is constantly researching and writing about the latest developments in AI/ML. 
              Stay tuned for more insights and technical deep-dives.
            </p>
            <div className="coming-soon-topics">
              <span className="topic-tag">Transformer Architecture</span>
              <span className="topic-tag">Graph Neural Networks</span>
              <span className="topic-tag">Reinforcement Learning</span>
              <span className="topic-tag">Computer Vision</span>
              <span className="topic-tag">Natural Language Processing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Modal */}
      {showBlogModal && selectedBlog && (
        <div className="blog-modal">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-meta">
                <span className="modal-category">{selectedBlog.category}</span>
                <span className="modal-date">{selectedBlog.date}</span>
                <span className="modal-read-time">{selectedBlog.readTime}</span>
              </div>
              <button className="close-btn" onClick={closeBlogModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="blog-content-full">
                <div 
                  dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                />
              </div>
              
              <div className="blog-footer">
                <div className="blog-author-info">
                  <span className="author-label">Written by:</span>
                  <span className="author-name">{selectedBlog.author}</span>
                </div>
                
                <div className="blog-tags-full">
                  {selectedBlog.tags.map((tag, index) => (
                    <span key={index} className="blog-tag-full">{tag}</span>
                  ))}
                </div>
                
                <div className="blog-share">
                  <span className="share-label">Share this article:</span>
                  <div className="share-buttons">
                    <button className="share-btn copy" onClick={copyBlogLink}>Copy Link</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
