import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupAtlas() {
  console.log('🌐 MongoDB Atlas Setup\n');
  console.log('Please provide your MongoDB Atlas connection details:\n');

  const connectionString = await question('Enter your Atlas connection string: ');

  if (!connectionString.includes('mongodb+srv://') && !connectionString.includes('mongodb://')) {
    console.error('❌ Invalid connection string format');
    rl.close();
    process.exit(1);
  }

  // Add database name if not present
  let finalConnectionString = connectionString.trim();
  if (!finalConnectionString.includes('kali-website')) {
    // Insert database name before query parameters
    if (finalConnectionString.includes('?')) {
      finalConnectionString = finalConnectionString.replace('/?', '/kali-website?');
    } else if (finalConnectionString.endsWith('.net') || finalConnectionString.endsWith('.net/')) {
      finalConnectionString = finalConnectionString.replace(/\/?$/, '/kali-website');
    }
  }

  const envPath = path.join(__dirname, '..', '.env');
  let envContent = '';

  // Read existing .env file
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Update or add MONGODB_URI
  if (envContent.includes('MONGODB_URI=')) {
    envContent = envContent.replace(
      /MONGODB_URI=.*/,
      `MONGODB_URI=${finalConnectionString}`
    );
  } else {
    envContent += `\n# MongoDB Atlas\nMONGODB_URI=${finalConnectionString}\n`;
  }

  // Write back to .env
  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ Configuration updated successfully!');
  console.log(`📝 Updated: ${envPath}`);
  console.log('\n📊 Connection string saved (with database: kali-website)');
  console.log('\nNext steps:');
  console.log('1. Test connection: npm run dev');
  console.log('2. Seed database: node scripts/seedDatabase.js');
  console.log('3. If you have local data to migrate: node scripts/migrate-to-atlas.js');

  rl.close();
}

setupAtlas().catch(error => {
  console.error('❌ Setup failed:', error.message);
  rl.close();
  process.exit(1);
});
