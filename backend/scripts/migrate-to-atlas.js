import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Import models
import '../models/User.js';
import '../models/Project.js';
import '../models/BlogPost.js';
import '../models/TeamMember.js';
import '../models/Application.js';
import '../models/ContactSubmission.js';

const localURI = 'mongodb://localhost:27017/kali-website';
const atlasURI = process.env.MONGODB_URI;

async function migrateToAtlas() {
  console.log('🚀 Starting MongoDB Atlas Migration\n');

  if (!atlasURI || atlasURI.includes('localhost')) {
    console.error('❌ Atlas connection string not found in .env');
    console.log('Please run: node scripts/setup-atlas.js first');
    process.exit(1);
  }

  let localConnection, atlasConnection;

  try {
    // Connect to local MongoDB
    console.log('📡 Connecting to local MongoDB...');
    localConnection = await mongoose.createConnection(localURI).asPromise();
    console.log('✅ Connected to local MongoDB');

    // Connect to Atlas
    console.log('📡 Connecting to MongoDB Atlas...');
    atlasConnection = await mongoose.createConnection(atlasURI).asPromise();
    console.log('✅ Connected to MongoDB Atlas');

    // Get all collections
    const collections = await localConnection.db.listCollections().toArray();
    console.log(`\n📦 Found ${collections.length} collections to migrate:\n`);

    let totalDocuments = 0;
    const migrationResults = [];

    // Migrate each collection
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`📋 Migrating collection: ${collectionName}`);

      const sourceCollection = localConnection.db.collection(collectionName);
      const targetCollection = atlasConnection.db.collection(collectionName);

      // Get all documents
      const documents = await sourceCollection.find({}).toArray();
      const count = documents.length;

      if (count > 0) {
        // Clear existing data in Atlas (optional - remove if you want to keep existing data)
        await targetCollection.deleteMany({});
        
        // Insert documents
        await targetCollection.insertMany(documents);
        console.log(`   ✅ Migrated ${count} documents`);
        totalDocuments += count;
        migrationResults.push({ collection: collectionName, count, status: 'success' });
      } else {
        console.log(`   ℹ️  No documents to migrate`);
        migrationResults.push({ collection: collectionName, count: 0, status: 'empty' });
      }
    }

    // Verify migration
    console.log('\n🔍 Verifying migration...');
    for (const result of migrationResults) {
      if (result.status === 'success') {
        const count = await atlasConnection.db.collection(result.collection).countDocuments();
        if (count === result.count) {
          console.log(`   ✅ ${result.collection}: ${count} documents verified`);
        } else {
          console.log(`   ⚠️  ${result.collection}: Expected ${result.count}, found ${count}`);
        }
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('✨ Migration Summary');
    console.log('='.repeat(50));
    console.log(`Total documents migrated: ${totalDocuments}`);
    console.log(`Collections processed: ${collections.length}`);
    console.log(`Status: SUCCESS`);
    console.log('='.repeat(50));
    console.log('\n✅ Migration completed successfully!');
    console.log('\nYour application is now using MongoDB Atlas.');
    console.log('You can start your server with: npm run dev\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    // Close connections
    if (localConnection) {
      await localConnection.close();
      console.log('🔌 Disconnected from local MongoDB');
    }
    if (atlasConnection) {
      await atlasConnection.close();
      console.log('🔌 Disconnected from MongoDB Atlas');
    }
  }
}

// Run migration
migrateToAtlas().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
