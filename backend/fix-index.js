import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function fixUsernameIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kali-website');
    console.log('Connected to MongoDB');

    // Get the users collection
    const db = mongoose.connection.db;
    const collection = db.collection('users');

    // Check existing indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));

    // Drop the username index if it exists
    try {
      await collection.dropIndex('username_1');
      console.log('Successfully dropped username_1 index');
    } catch (error) {
      if (error.code === 27 || error.codeName === 'IndexNotFound') {
        console.log('Username index not found (already dropped)');
      } else {
        console.error('Error dropping index:', error.message);
      }
    }

    // Drop the compound email_username index if it exists
    try {
      await collection.dropIndex('email_1_username_1');
      console.log('Successfully dropped email_1_username_1 index');
    } catch (error) {
      if (error.code === 27 || error.codeName === 'IndexNotFound') {
        console.log('Compound email_username index not found (already dropped)');
      } else {
        console.error('Error dropping compound index:', error.message);
      }
    }

    // List indexes after dropping
    const newIndexes = await collection.indexes();
    console.log('Indexes after cleanup:', newIndexes.map(idx => idx.name));

    console.log('Index cleanup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing index:', error);
    process.exit(1);
  }
}

fixUsernameIndex();
