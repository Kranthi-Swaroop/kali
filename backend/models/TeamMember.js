import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: '/api/placeholder/300/300'
  },
  skills: [{
    type: String,
    trim: true
  }],
  social: {
    linkedin: {
      type: String,
      default: ''
    },
    github: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    twitter: {
      type: String,
      default: ''
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for better performance
teamMemberSchema.index({ name: 1 });
teamMemberSchema.index({ role: 1 });
teamMemberSchema.index({ isActive: 1 });

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

export default TeamMember;
