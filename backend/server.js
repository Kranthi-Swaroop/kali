import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import database configuration
import connectDB, { checkDBHealth } from './config/database.js';

// Import routes
import teamRoutes from './routes/team.js';
import projectRoutes from './routes/projects.js';
import blogRoutes from './routes/blogs.js';
import contactRoutes from './routes/contact.js';
import applicationRoutes from './routes/applications.js';
import authRoutes from './routes/auth.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('combined')); // Logging
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite default port
    'http://localhost:3000', // Alternative React port
    'http://localhost:3001', // Alternative React port
    'http://localhost:3002', // Alternative React port
    'http://localhost:3003', // Alternative React port
    'http://localhost:4173', // Vite preview port
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Routes
app.use('/api/team', teamRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const dbHealth = await checkDBHealth();
  res.status(200).json({
    status: 'OK',
    message: 'Kali Website Backend is running',
    timestamp: new Date().toISOString(),
    database: dbHealth
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});

// Start server
const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  });

  // Graceful shutdown handling
  const gracefulShutdown = (signal) => {
    console.log(`\n⚠️ Received ${signal}. Starting graceful shutdown...`);
    
    server.close(() => {
      console.log('📴 HTTP server closed.');
      
      // Close MongoDB connection
      mongoose.connection.close()
        .then(() => {
          console.log('🍃 MongoDB connection closed.');
          process.exit(0);
        })
        .catch(err => {
          console.error('❌ Error closing MongoDB connection:', err);
          process.exit(1);
        });
    });
    
    // Force close after 30 seconds
    setTimeout(() => {
      console.error('⏰ Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 30000);
  };

  // Listen for termination signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

// Start the server
startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

export default app;
