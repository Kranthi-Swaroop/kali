import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  branchYear: {
    type: String,
    required: true,
    trim: true
  },
  preferredRole: {
    type: String,
    required: true,
    enum: ['architect', 'neuron', 'parameter']
  },
  domain: {
    type: String,
    required: true,
    enum: ['computer-vision', 'natural-language-processing', 'data-science', 'gen-ai', 'reinforcement-learning']
  },
  programmingExperience: {
    type: String,
    trim: true
  },
  motivation: {
    type: String,
    trim: true
  },
  portfolioLink: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // Allow empty string or valid URL
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Please enter a valid URL starting with http:// or https://'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'under-review', 'interview-scheduled', 'accepted', 'rejected', 'denied'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  },
  reviewedBy: {
    type: String,
    trim: true
  },
  reviewedAt: {
    type: Date
  },
  registrationToken: {
    type: String,
    trim: true,
    unique: true,
    sparse: true // Only enforce uniqueness for non-null values
  },
  registeredAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient querying
applicationSchema.index({ email: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ preferredRole: 1 });
applicationSchema.index({ domain: 1 });
applicationSchema.index({ submittedAt: -1 });

// Compound index for role and domain filtering
applicationSchema.index({ preferredRole: 1, domain: 1 });

export default mongoose.model('Application', applicationSchema);
