import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import BlogPost from '../models/BlogPost.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'))
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'blog-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

// Helper function to generate unique slug
async function generateUniqueSlug(title) {
  let baseSlug = title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim();
  
  let slug = baseSlug;
  let counter = 1;
  
  while (await BlogPost.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

// GET /api/blogs - Get all blog posts
router.get('/', async (req, res) => {
  try {
    const { category, tag, featured, status = 'published', limit = 10, page = 1 } = req.query;
    
    let query = { status };
    
    // Filter by category
    if (category) {
      query.category = new RegExp(category, 'i');
    }
    
    // Filter by tag
    if (tag) {
      query.tags = { $regex: tag, $options: 'i' };
    }
    
    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { publishedAt: -1, createdAt: -1 }
    };

    const posts = await BlogPost.find(query)
      .populate({
        path: 'createdBy',
        select: 'username email profile'
      })
      .sort(options.sort)
      .limit(options.limit * options.page)
      .skip((options.page - 1) * options.limit)
      .select('-content'); // Exclude full content from list view

    const total = await BlogPost.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: posts,
      pagination: {
        current: options.page,
        total: Math.ceil(total / options.limit),
        count: posts.length,
        totalPosts: total
      },
      filters: { category, tag, featured, status }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch blog posts'
    });
  }
});

// GET /api/blogs/:slug - Get a specific blog post by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await BlogPost.findOne({ slug, status: 'published' });
    
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog post not found'
      });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.status(200).json({
      status: 'success',
      data: post
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch blog post'
    });
  }
});

// GET /api/blogs/meta/categories - Get all blog categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await BlogPost.distinct('category', { status: 'published' });
    
    res.status(200).json({
      status: 'success',
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch categories'
    });
  }
});

// GET /api/blogs/meta/tags - Get all blog tags
router.get('/meta/tags', async (req, res) => {
  try {
    const posts = await BlogPost.find({ status: 'published' }, 'tags');
    const allTags = posts.flatMap(p => p.tags);
    const uniqueTags = [...new Set(allTags)];
    
    res.status(200).json({
      status: 'success',
      data: uniqueTags
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch tags'
    });
  }
});

// GET /api/blogs/meta/authors - Get all blog authors
router.get('/meta/authors', async (req, res) => {
  try {
    const authors = await BlogPost.distinct('author', { status: 'published' });
    
    res.status(200).json({
      status: 'success',
      data: authors
    });
  } catch (error) {
    console.error('Error fetching authors:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch authors'
    });
  }
});

// POST /api/blogs - Create a new blog post with image upload
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      author,
      tags,
      category,
      readTime,
      featured,
      status
    } = req.body;

    // Validate required fields
    if (!title || !excerpt || !content || !category) {
      return res.status(400).json({
        status: 'error',
        message: 'Title, excerpt, content, and category are required'
      });
    }

    // Use authenticated user as author
    const authorName = author || `${req.user.profile.firstName} ${req.user.profile.lastName}`;

    // Generate unique slug
    const slug = await generateUniqueSlug(title);

    // Process tags if they're provided as a string
    let tagsArray = [];
    if (tags) {
      try {
        // If tags is a string, split by comma and clean up
        if (typeof tags === 'string') {
          tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        } else if (Array.isArray(tags)) {
          tagsArray = tags;
        }
      } catch (error) {
        console.warn('Error processing tags:', error);
        tagsArray = [];
      }
    }

    // Prepare blog post data
    const blogPostData = {
      title: title.trim(),
      slug,
      excerpt: excerpt.trim(),
      content: content.trim(),
      author: authorName.trim(),
      createdBy: req.user._id, // Set the user who created the blog
      tags: tagsArray,
      category: category.trim(),
      readTime: readTime ? parseInt(readTime) : 5,
      featured: featured === 'true' || featured === true,
      status: status || 'published',
      image: req.file ? `/uploads/${req.file.filename}` : '/api/placeholder/800/400'
    };

    // Create new blog post
    const newPost = new BlogPost(blogPostData);
    const savedPost = await newPost.save();

    res.status(201).json({
      status: 'success',
      data: savedPost,
      message: 'Blog post created successfully'
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'A blog post with this slug already exists'
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to create blog post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/blogs/:id - Update a blog post
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const post = await BlogPost.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog post not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: post,
      message: 'Blog post updated successfully'
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to update blog post'
    });
  }
});

// DELETE /api/blogs/:id - Delete a blog post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await BlogPost.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog post not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete blog post'
    });
  }
});

// PATCH /api/blogs/:id/like - Like a blog post
router.patch('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await BlogPost.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog post not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { likes: post.likes },
      message: 'Blog post liked successfully'
    });
  } catch (error) {
    console.error('Error liking blog post:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to like blog post'
    });
  }
});

// DELETE /api/blogs/:id - Delete a blog post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the blog post
    const deletedBlog = await BlogPost.findByIdAndDelete(id);
    
    if (!deletedBlog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog post not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Blog post deleted successfully',
      data: deletedBlog
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete blog post'
    });
  }
});

export default router;
