# Kali Website Backend

This is the backend API for the Kali Website, built with Node.js, Express, and MongoDB.

## Features

- RESTful API endpoints
- MongoDB database with Mongoose ODM
- CORS enabled for frontend communication
- Security middleware (Helmet)
- Request logging (Morgan)
- Environment configuration
- Error handling
- Database seeding with sample data
- MongoDB Compass integration

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (Community Server or Atlas)
- MongoDB Compass (recommended for database management)

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Team
- `GET /api/team` - Get all team members
- `GET /api/team/:id` - Get specific team member
- `POST /api/team` - Add new team member

### Projects
- `GET /api/projects` - Get all projects (supports filtering by category, status)
- `GET /api/projects/:id` - Get specific project
- `GET /api/projects/meta/categories` - Get all project categories
- `POST /api/projects` - Add new project

### Blogs
- `GET /api/blogs` - Get all blog posts (supports pagination, filtering)
- `GET /api/blogs/:slug` - Get specific blog post by slug
- `GET /api/blogs/meta/categories` - Get all blog categories
- `GET /api/blogs/meta/tags` - Get all blog tags

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact/info` - Get contact information
- `GET /api/contact/submissions` - Get all submissions (admin)
- `PATCH /api/contact/submissions/:id` - Update submission status (admin)

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MongoDB:
   - Install MongoDB Community Server
   - Install MongoDB Compass
   - See `MONGODB_SETUP.md` for detailed instructions

4. Copy environment file:
   ```bash
   copy .env.example .env
   ```

5. Update the `.env` file with your configuration

6. Seed the database with sample data:
   ```bash
   npm run seed
   ```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 5000 (or the port specified in your .env file).

## Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `MONGODB_URI` - MongoDB connection string (default: mongodb://localhost:27017/kali-website)

## Database

The backend uses MongoDB with Mongoose ODM. The database includes:

### Collections:
- **teammembers** - Team member information
- **projects** - Project details with team member references
- **blogposts** - Blog posts with categories and tags
- **contactsubmissions** - Contact form submissions

### Sample Data:
Run `npm run seed` to populate the database with sample data:
- 3 team members
- 3 projects
- 3 blog posts

## Project Structure

```
backend/
├── config/
│   └── database.js      # MongoDB connection configuration
├── models/
│   ├── TeamMember.js    # Team member schema
│   ├── Project.js       # Project schema
│   ├── BlogPost.js      # Blog post schema
│   └── ContactSubmission.js # Contact form schema
├── routes/
│   ├── team.js          # Team member endpoints
│   ├── projects.js      # Project endpoints
│   ├── blogs.js         # Blog post endpoints
│   └── contact.js       # Contact form endpoints
├── scripts/
│   └── seedDatabase.js  # Database seeding script
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
├── .env                 # Environment variables
├── .env.example         # Environment template
├── MONGODB_SETUP.md     # MongoDB setup guide
└── README.md           # This file
```

## CORS Configuration

The backend is configured to accept requests from your frontend running on `http://localhost:5173` (Vite default). Update the `FRONTEND_URL` in your `.env` file if your frontend runs on a different port.

## Future Enhancements

- Authentication and authorization (JWT)
- File upload handling for images
- Email service integration (SMTP)
- Advanced search and filtering
- API rate limiting
- API documentation with Swagger
- Unit and integration tests
- Docker containerization
- Redis caching
- Database migrations

## Development Notes

- Uses MongoDB with Mongoose ODM for data persistence
- All endpoints return JSON responses with consistent structure
- Error handling middleware catches and formats errors
- Database seeding script provides sample data for development
- MongoDB Compass recommended for visual database management
- Supports both local MongoDB and MongoDB Atlas cloud database
