import express from 'express';
import TeamMember from '../models/TeamMember.js';

const router = express.Router();

// GET /api/team - Get all team members
router.get('/', async (req, res) => {
  try {
    const { active } = req.query;
    
    let query = {};
    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    const teamMembers = await TeamMember.find(query).sort({ joinDate: 1 });
    
    res.status(200).json({
      status: 'success',
      data: teamMembers,
      count: teamMembers.length
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch team members'
    });
  }
});

// GET /api/team/:id - Get a specific team member
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const member = await TeamMember.findById(id);
    
    if (!member) {
      return res.status(404).json({
        status: 'error',
        message: 'Team member not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: member
    });
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch team member'
    });
  }
});

// POST /api/team - Add a new team member
router.post('/', async (req, res) => {
  try {
    const { name, role, bio, skills, social, image } = req.body;
    
    if (!name || !role) {
      return res.status(400).json({
        status: 'error',
        message: 'Name and role are required'
      });
    }

    const newMember = new TeamMember({
      name,
      role,
      bio: bio || '',
      image: image || '/api/placeholder/300/300',
      skills: skills || [],
      social: social || {}
    });

    const savedMember = await newMember.save();

    res.status(201).json({
      status: 'success',
      data: savedMember,
      message: 'Team member added successfully'
    });
  } catch (error) {
    console.error('Error adding team member:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to add team member'
    });
  }
});

// PUT /api/team/:id - Update a team member
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const member = await TeamMember.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!member) {
      return res.status(404).json({
        status: 'error',
        message: 'Team member not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: member,
      message: 'Team member updated successfully'
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to update team member'
    });
  }
});

// DELETE /api/team/:id - Delete a team member (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent } = req.query;

    if (permanent === 'true') {
      // Permanent deletion
      const member = await TeamMember.findByIdAndDelete(id);
      if (!member) {
        return res.status(404).json({
          status: 'error',
          message: 'Team member not found'
        });
      }
    } else {
      // Soft delete - set isActive to false
      const member = await TeamMember.findByIdAndUpdate(
        id, 
        { isActive: false }, 
        { new: true }
      );
      if (!member) {
        return res.status(404).json({
          status: 'error',
          message: 'Team member not found'
        });
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Team member removed successfully'
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete team member'
    });
  }
});

export default router;
