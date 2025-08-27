import express from 'express';
import ContactSubmission from '../models/ContactSubmission.js';

const router = express.Router();

// POST /api/contact - Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body;
    
    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, and message are required'
      });
    }

    // Get client information
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || '';

    const submission = new ContactSubmission({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ? subject.trim() : 'General Inquiry',
      message: message.trim(),
      phone: phone ? phone.trim() : '',
      ipAddress,
      userAgent,
      source: 'website'
    });

    const savedSubmission = await submission.save();

    // In a real app, you would:
    // 1. Send email notification
    // 2. Add to CRM system
    // 3. Send auto-reply email
    
    res.status(201).json({
      status: 'success',
      message: 'Thank you for your message! We will get back to you soon.',
      data: {
        id: savedSubmission._id,
        submittedAt: savedSubmission.createdAt
      }
    });
  } catch (error) {
    console.error('Contact form error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit contact form. Please try again later.'
    });
  }
});

// GET /api/contact/info - Get contact information
router.get('/info', (req, res) => {
  try {
    const contactInfo = {
      email: 'contact@kali-team.com',
      phone: '+1 (555) 123-4567',
      address: {
        street: '123 Cyber Street',
        city: 'Tech City',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      },
      social: {
        linkedin: 'https://linkedin.com/company/kali-team',
        github: 'https://github.com/kali-team',
        twitter: 'https://twitter.com/kali_team'
      },
      businessHours: {
        monday: '9:00 AM - 6:00 PM',
        tuesday: '9:00 AM - 6:00 PM',
        wednesday: '9:00 AM - 6:00 PM',
        thursday: '9:00 AM - 6:00 PM',
        friday: '9:00 AM - 6:00 PM',
        saturday: 'Closed',
        sunday: 'Closed'
      }
    };

    res.status(200).json({
      status: 'success',
      data: contactInfo
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch contact information'
    });
  }
});

// GET /api/contact/submissions - Get all contact submissions (admin only)
router.get('/submissions', async (req, res) => {
  try {
    // In a real app, you would check for admin authentication here
    const { status, priority, assignedTo, limit = 10, page = 1 } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 }
    };

    const submissions = await ContactSubmission.find(query)
      .sort(options.sort)
      .limit(options.limit * options.page)
      .skip((options.page - 1) * options.limit);

    const total = await ContactSubmission.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: submissions,
      pagination: {
        current: options.page,
        total: Math.ceil(total / options.limit),
        count: submissions.length,
        totalSubmissions: total
      },
      filters: { status, priority, assignedTo }
    });
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch contact submissions'
    });
  }
});

// GET /api/contact/submissions/:id - Get a specific submission
router.get('/submissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await ContactSubmission.findById(id);
    
    if (!submission) {
      return res.status(404).json({
        status: 'error',
        message: 'Submission not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: submission
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch submission'
    });
  }
});

// PATCH /api/contact/submissions/:id - Update submission status (admin only)
router.patch('/submissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assignedTo, notes, tags } = req.body;
    
    const updateData = {};
    
    if (status && ['new', 'in_progress', 'resolved', 'closed'].includes(status)) {
      updateData.status = status;
      if (status === 'resolved' || status === 'closed') {
        updateData.responseDate = new Date();
      }
    }
    
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      updateData.priority = priority;
    }
    
    if (assignedTo !== undefined) {
      updateData.assignedTo = assignedTo;
    }
    
    if (notes !== undefined) {
      updateData.notes = notes;
    }
    
    if (tags !== undefined) {
      updateData.tags = tags;
    }

    const submission = await ContactSubmission.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!submission) {
      return res.status(404).json({
        status: 'error',
        message: 'Submission not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: submission,
      message: 'Submission updated successfully'
    });
  } catch (error) {
    console.error('Error updating submission:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to update submission'
    });
  }
});

// DELETE /api/contact/submissions/:id - Delete a submission (admin only)
router.delete('/submissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await ContactSubmission.findByIdAndDelete(id);
    
    if (!submission) {
      return res.status(404).json({
        status: 'error',
        message: 'Submission not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Submission deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete submission'
    });
  }
});

// GET /api/contact/analytics - Get contact submission analytics (admin only)
router.get('/analytics', async (req, res) => {
  try {
    const totalSubmissions = await ContactSubmission.countDocuments();
    const newSubmissions = await ContactSubmission.countDocuments({ status: 'new' });
    const inProgressSubmissions = await ContactSubmission.countDocuments({ status: 'in_progress' });
    const resolvedSubmissions = await ContactSubmission.countDocuments({ status: 'resolved' });
    
    // Get submissions by priority
    const priorityStats = await ContactSubmission.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent submissions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSubmissions = await ContactSubmission.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      status: 'success',
      data: {
        total: totalSubmissions,
        byStatus: {
          new: newSubmissions,
          in_progress: inProgressSubmissions,
          resolved: resolvedSubmissions,
          closed: totalSubmissions - newSubmissions - inProgressSubmissions - resolvedSubmissions
        },
        byPriority: priorityStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recent: recentSubmissions
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch analytics'
    });
  }
});

export default router;
