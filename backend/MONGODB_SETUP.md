# MongoDB Setup Guide with MongoDB Compass

This guide will help you set up MongoDB with MongoDB Compass for your Kali Website backend.

## 🍃 MongoDB Installation

### Option 1: MongoDB Community Server (Recommended)

1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Select your OS (Windows)
   - Download and install

2. **Download MongoDB Compass**
   - Visit: https://www.mongodb.com/try/download/compass
   - Download and install the GUI tool

### Option 2: MongoDB Atlas (Cloud)

1. **Create Free Account**
   - Visit: https://www.mongodb.com/atlas
   - Sign up for a free account
   - Create a new cluster (M0 Sandbox - Free)

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

## 🚀 Local MongoDB Setup

### 1. Start MongoDB Service

**Windows:**
```bash
# Start MongoDB as a service (if installed as service)
net start MongoDB

# Or start manually
mongod --dbpath "C:\data\db"
```

**Alternative: Using MongoDB Compass**
- Open MongoDB Compass
- Connect to `mongodb://localhost:27017`

### 2. Verify Connection

Open MongoDB Compass and connect to:
```
mongodb://localhost:27017
```

You should see the connection successful.

## 🔧 Backend Configuration

### 1. Environment Variables

Your `.env` file is already configured:
```bash
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/kali-website
```

**For MongoDB Atlas, update MONGODB_URI:**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kali-website
```

### 2. Database Models

Your backend now includes these MongoDB models:

#### TeamMember Model
- `name` (String, required)
- `role` (String, required)
- `bio` (String)
- `image` (String)
- `skills` (Array of Strings)
- `social` (Object with linkedin, github, email, twitter)
- `isActive` (Boolean)
- `joinDate` (Date)

#### Project Model
- `title` (String, required)
- `slug` (String, unique)
- `description` (String, required)
- `fullDescription` (String)
- `technologies` (Array of Strings)
- `status` (Enum: Active, Completed, In Progress, On Hold)
- `category` (String, required)
- `startDate` / `endDate` (Dates)
- `githubUrl` / `demoUrl` (Strings)
- `features` (Array of Strings)
- `teamMembers` (References to TeamMember)
- `priority` (Enum: Low, Medium, High)

#### BlogPost Model
- `title` (String, required)
- `slug` (String, unique)
- `excerpt` (String, required)
- `content` (String, required)
- `author` (String, required)
- `tags` (Array of Strings)
- `category` (String, required)
- `readTime` (Number)
- `featured` (Boolean)
- `status` (Enum: draft, published, archived)
- `views` / `likes` (Numbers)
- `publishedAt` (Date)

#### ContactSubmission Model
- `name` (String, required)
- `email` (String, required, validated)
- `subject` (String, required)
- `message` (String, required)
- `phone` (String)
- `status` (Enum: new, in_progress, resolved, closed)
- `priority` (Enum: low, medium, high)
- `ipAddress` / `userAgent` (Strings)

## 📊 Database Seeding

### 1. Seed Sample Data

Run the seed script to populate your database with sample data:

```bash
cd backend
npm run seed
```

This will create:
- 3 team members
- 3 projects
- 3 blog posts

### 2. Verify in MongoDB Compass

1. Open MongoDB Compass
2. Connect to your database
3. You should see `kali-website` database with collections:
   - `teammembers`
   - `projects`
   - `blogposts`
   - `contactsubmissions` (empty initially)

## 🔄 Starting the Backend

### 1. Start MongoDB
Make sure MongoDB is running (either as service or manually)

### 2. Start Backend Server
```bash
cd backend
npm run dev
```

You should see:
```
🍃 MongoDB Connected: localhost
📂 Database: kali-website
🚀 Server is running on port 5000
📍 Health check: http://localhost:5000/api/health
```

### 3. Test Database Connection

Visit: `http://localhost:5000/api/health`

Response should include database status:
```json
{
  "status": "OK",
  "message": "Kali Website Backend is running",
  "timestamp": "2025-08-26T...",
  "database": {
    "status": "connected",
    "message": "Database is healthy"
  }
}
```

## 📈 MongoDB Compass Operations

### 1. View Collections
- **Teams**: Browse team members
- **Projects**: View project details with populated team members
- **Blog Posts**: Check blog content and metadata
- **Contact Submissions**: Monitor form submissions

### 2. Query Examples

**Find all active team members:**
```javascript
{ "isActive": true }
```

**Find projects by category:**
```javascript
{ "category": "Security" }
```

**Find published blog posts:**
```javascript
{ "status": "published" }
```

**Find recent contact submissions:**
```javascript
{ "createdAt": { "$gte": new Date("2025-08-01") } }
```

### 3. Create Indexes (Optional)

For better performance, you can create indexes in Compass:

**Team Members:**
- `{ "name": 1 }`
- `{ "role": 1 }`

**Projects:**
- `{ "category": 1 }`
- `{ "status": 1 }`
- `{ "slug": 1 }`

**Blog Posts:**
- `{ "slug": 1 }`
- `{ "status": 1, "publishedAt": -1 }`
- `{ "tags": 1 }`

## 🛠️ Troubleshooting

### MongoDB Connection Issues

1. **Port 27017 in use:**
   ```bash
   # Check what's using the port
   netstat -an | findstr :27017
   ```

2. **MongoDB not starting:**
   - Check if MongoDB service is installed
   - Verify data directory exists: `C:\data\db`
   - Check MongoDB logs

3. **Permission Issues:**
   - Run command prompt as Administrator
   - Ensure MongoDB has write permissions to data directory

### Backend Issues

1. **Database not connecting:**
   - Verify MongoDB is running
   - Check connection string in `.env`
   - Look for firewall blocking port 27017

2. **Seed script fails:**
   - Ensure MongoDB is running
   - Check if collections already exist (script clears them)
   - Verify no validation errors in console

## 🔮 Next Steps

### 1. Data Management
- Use MongoDB Compass to manually add/edit data
- Create backup/restore procedures
- Set up data validation rules

### 2. Performance Optimization
- Add appropriate indexes
- Implement database connection pooling
- Add query optimization

### 3. Production Setup
- Configure replica sets
- Set up automated backups
- Implement database monitoring

### 4. Security
- Enable MongoDB authentication
- Configure SSL/TLS
- Set up user roles and permissions

Your MongoDB integration is now complete! The backend will automatically use the database for all operations, and you can manage your data visually through MongoDB Compass.
