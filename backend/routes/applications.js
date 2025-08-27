import express from 'express';
import Application from '../models/Application.js';

const router = express.Router();

// POST /api/applications - Submit a new application
router.post('/', async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      branchYear,
      preferredRole,
      domain,
      programmingExperience,
      motivation,
      portfolioLink
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !branchYear || !preferredRole || !domain) {
      return res.status(400).json({
        status: 'error',
        message: 'Please fill in all required fields'
      });
    }

    // Check if application already exists for this email
    const existingApplication = await Application.findOne({ email });
    if (existingApplication) {
      return res.status(409).json({
        status: 'error',
        message: 'An application with this email already exists'
      });
    }

    // Create new application
    const newApplication = new Application({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      branchYear: branchYear.trim(),
      preferredRole,
      domain,
      programmingExperience: programmingExperience?.trim() || '',
      motivation: motivation?.trim() || '',
      portfolioLink: portfolioLink?.trim() || ''
    });

    const savedApplication = await newApplication.save();

    res.status(201).json({
      status: 'success',
      data: {
        id: savedApplication._id,
        fullName: savedApplication.fullName,
        email: savedApplication.email,
        preferredRole: savedApplication.preferredRole,
        domain: savedApplication.domain,
        submittedAt: savedApplication.submittedAt
      },
      message: 'Application submitted successfully! We will contact you soon.'
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: errorMessages.join(', ')
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit application. Please try again.'
    });
  }
});

// GET /api/applications - Get all applications (for admin use)
router.get('/', async (req, res) => {
  try {
    const {
      status,
      role,
      domain,
      page = 1,
      limit = 20,
      sortBy = 'submittedAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query object
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (role) {
      query.preferredRole = role;
    }
    
    if (domain) {
      query.domain = domain;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const applications = await Application.find(query)
      .sort(sort)
      .limit(options.limit * options.page)
      .skip((options.page - 1) * options.limit)
      .select('-__v');

    const total = await Application.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: applications,
      pagination: {
        current: options.page,
        total: Math.ceil(total / options.limit),
        count: applications.length,
        totalApplications: total
      },
      filters: { status, role, domain }
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch applications'
    });
  }
});

// GET /api/applications/:id - Get a specific application
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const application = await Application.findById(id);
    
    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: application
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch application'
    });
  }
});

// PUT /api/applications/:id - Update application status (for admin use)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, reviewedBy } = req.body;

    const updateData = {};
    
    if (status) {
      updateData.status = status;
      updateData.reviewedAt = new Date();
    }
    
    if (notes) {
      updateData.notes = notes;
    }
    
    if (reviewedBy) {
      updateData.reviewedBy = reviewedBy;
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: updatedApplication,
      message: 'Application updated successfully'
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update application'
    });
  }
});

// GET /api/applications/stats/overview - Get application statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Application.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          underReview: { $sum: { $cond: [{ $eq: ['$status', 'under-review'] }, 1, 0] } },
          interviewScheduled: { $sum: { $cond: [{ $eq: ['$status', 'interview-scheduled'] }, 1, 0] } },
          accepted: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
          denied: { $sum: { $cond: [{ $eq: ['$status', 'denied'] }, 1, 0] } }
        }
      }
    ]);

    const roleStats = await Application.aggregate([
      {
        $group: {
          _id: '$preferredRole',
          count: { $sum: 1 }
        }
      }
    ]);

    const domainStats = await Application.aggregate([
      {
        $group: {
          _id: '$domain',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        overview: stats[0] || {
          total: 0,
          pending: 0,
          underReview: 0,
          interviewScheduled: 0,
          accepted: 0,
          rejected: 0,
          denied: 0
        },
        roleDistribution: roleStats,
        domainDistribution: domainStats
      }
    });
  } catch (error) {
    console.error('Error fetching application stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch application statistics'
    });
  }
});

// PATCH /api/applications/:id/accept - Accept an application
router.patch('/:id/accept', async (req, res) => {
  try {
    const { id } = req.params;

    // Generate a unique registration token
    const registrationToken = `KALI-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      { 
        status: 'accepted',
        reviewedAt: new Date(),
        registrationToken: registrationToken
      },
      { new: true, runValidators: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: updatedApplication,
      application: updatedApplication,
      registrationToken: registrationToken,
      message: `Application from ${updatedApplication.fullName} has been accepted`
    });
  } catch (error) {
    console.error('Error accepting application:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to accept application'
    });
  }
});

// PATCH /api/applications/:id/deny - Deny an application
router.patch('/:id/deny', async (req, res) => {
  try {
    const { id } = req.params;

    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      { 
        status: 'denied',
        reviewedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: updatedApplication,
      message: `Application from ${updatedApplication.fullName} has been denied`
    });
  } catch (error) {
    console.error('Error denying application:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to deny application'
    });
  }
});

// DELETE /api/applications/:id - Delete an application
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the application
    const deletedApplication = await Application.findByIdAndDelete(id);
    
    if (!deletedApplication) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Application deleted successfully',
      data: deletedApplication
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete application'
    });
  }
});

export default router;
