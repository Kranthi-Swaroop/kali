import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Project from '../models/Project.js';
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
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
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

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
  try {
    const { category, status, isPublic, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (category) {
      query.category = new RegExp(category, 'i');
    }
    
    if (status) {
      query.status = status;
    }
    
    if (isPublic !== undefined) {
      query.isPublic = isPublic === 'true';
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        {
          path: 'teamMembers',
          select: 'name role image'
        },
        {
          path: 'createdBy',
          select: 'username email profile'
        }
      ]
    };

    const projects = await Project.find(query)
      .populate(options.populate)
      .sort(options.sort)
      .limit(options.limit * options.page)
      .skip((options.page - 1) * options.limit);

    const total = await Project.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: projects,
      pagination: {
        current: options.page,
        total: Math.ceil(total / options.limit),
        count: projects.length,
        totalProjects: total
      },
      filters: { category, status, isPublic }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch projects'
    });
  }
});

// GET /api/projects/:id - Get a specific project
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Support both MongoDB ObjectId and slug
    let project;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // It's a valid ObjectId
      project = await Project.findById(id).populate('createdBy', 'name email');
    } else {
      // It's likely a slug
      project = await Project.findOne({ slug: id }).populate('createdBy', 'name email');
    }
    
    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch project'
    });
  }
});

// GET /api/projects/meta/categories - Get all project categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Project.distinct('category');
    
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

// GET /api/projects/meta/technologies - Get all technologies used
router.get('/meta/technologies', async (req, res) => {
  try {
    const projects = await Project.find({}, 'technologies');
    const allTechnologies = projects.flatMap(p => p.technologies);
    const uniqueTechnologies = [...new Set(allTechnologies)];
    
    res.status(200).json({
      status: 'success',
      data: uniqueTechnologies
    });
  } catch (error) {
    console.error('Error fetching technologies:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch technologies'
    });
  }
});

// POST /api/projects - Add a new project
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { 
      name,
      description, 
      techStack,
      members,
      githubLink,
      status
    } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({
        status: 'error',
        message: 'Project name and description are required'
      });
    }

    // Parse JSON strings back to arrays
    let technologies = [];
    let teamMemberNames = [];
    
    try {
      technologies = techStack ? JSON.parse(techStack) : [];
      teamMemberNames = members ? JSON.parse(members) : [];
    } catch (parseError) {
      // Fallback to splitting by comma if JSON parsing fails
      technologies = techStack ? techStack.split(',').map(tech => tech.trim()) : [];
      teamMemberNames = members ? members.split(',').map(member => member.trim()) : [];
    }

    // Handle uploaded image
    let imagePath = "/smartdoorguard.jpg"; // Default image
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    // Generate unique slug from title
    let baseSlug = name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    
    // Check if slug exists and make it unique
    let slug = baseSlug;
    let counter = 1;
    
    while (await Project.findOne({ slug: slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newProject = new Project({
      title: name, // Map 'name' to 'title'
      slug: slug, // Generate slug manually
      description,
      fullDescription: description,
      image: imagePath,
      technologies,
      status: "Completed", // Use correct capitalized status
      category: "AI/ML", // Default category since frontend doesn't send it
      githubUrl: githubLink || '',
      demoUrl: '',
      features: [],
      teamMembers: teamMemberNames.map(memberName => ({ name: memberName })), // Convert names to objects
      createdBy: req.user._id, // Set the user who created the project
      priority: 'Medium',
      isPublic: true
    });

    const savedProject = await newProject.save();

    res.status(201).json({
      status: 'success',
      data: savedProject,
      message: 'Project added successfully'
    });
  } catch (error) {
    console.error('Error adding project:', error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: validationErrors
      });
    }
    if (error.code === 11000) {
      // Handle duplicate key error
      return res.status(400).json({
        status: 'error',
        message: 'A project with this name already exists. Please choose a different name.',
        errors: ['Duplicate project name']
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to add project'
    });
  }
});

// PUT /api/projects/:id - Update a project
router.put('/:id', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, techStack, members, githubLink, status } = req.body;

    // Find the project first to check ownership
    const existingProject = await Project.findById(id);
    
    if (!existingProject) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    // Check if user owns this project
    if (existingProject.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only edit your own projects'
      });
    }

    // Prepare update data
    const updateData = {
      name,
      description,
      status: status || existingProject.status
    };

    // Parse arrays if they exist
    if (techStack) {
      updateData.techStack = JSON.parse(techStack);
    }
    
    if (members) {
      updateData.members = JSON.parse(members);
    }

    if (githubLink !== undefined) {
      updateData.githubLink = githubLink;
    }

    // Handle image upload
    if (req.file) {
      updateData.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const project = await Project.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    res.status(200).json({
      status: 'success',
      data: project,
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('Error updating project:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to update project'
    });
  }
});

// DELETE /api/projects/:id - Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete project'
    });
  }
});

export default router;
