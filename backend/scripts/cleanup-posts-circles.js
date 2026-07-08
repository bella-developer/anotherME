import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

/**
 * Cleanup Script - Delete All Posts and Circles
 * 
 * This script removes all posts, comments, and circles from the database
 * while preserving users and their authentication data.
 * 
 * Usage: 
 *   node scripts/cleanup-posts-circles.js
 * Or with direct MongoDB URI:
 *   MONGODB_URI="your-mongodb-uri" node scripts/cleanup-posts-circles.js
 */

async function cleanupDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('❌ Error: MONGODB_URI not found!');
      console.error('\nPlease set MONGODB_URI either:');
      console.error('1. In backend/.env file');
      console.error('2. As environment variable: MONGODB_URI="your-uri" node scripts/cleanup-posts-circles.js');
      console.error('3. On Render Shell (already available as env var)\n');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // Get collection names
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    console.log('📊 Database Collections:', collectionNames.join(', '));
    console.log('\n🗑️  Starting cleanup...\n');

    let deletedCounts = {};

    // Delete Posts
    if (collectionNames.includes('posts')) {
      const postsResult = await db.collection('posts').deleteMany({});
      deletedCounts.posts = postsResult.deletedCount;
      console.log(`✅ Deleted ${postsResult.deletedCount} posts`);
    } else {
      console.log('⚠️  Posts collection not found');
    }

    // Delete Comments
    if (collectionNames.includes('comments')) {
      const commentsResult = await db.collection('comments').deleteMany({});
      deletedCounts.comments = commentsResult.deletedCount;
      console.log(`✅ Deleted ${commentsResult.deletedCount} comments`);
    } else {
      console.log('⚠️  Comments collection not found');
    }

    // Delete Circles
    if (collectionNames.includes('circles')) {
      const circlesResult = await db.collection('circles').deleteMany({});
      deletedCounts.circles = circlesResult.deletedCount;
      console.log(`✅ Deleted ${circlesResult.deletedCount} circles`);
    } else {
      console.log('⚠️  Circles collection not found');
    }

    // Delete Notifications related to posts/circles
    if (collectionNames.includes('notifications')) {
      const notificationsResult = await db.collection('notifications').deleteMany({
        type: { $in: ['post', 'comment', 'circle', 'reaction'] }
      });
      deletedCounts.notifications = notificationsResult.deletedCount;
      console.log(`✅ Deleted ${notificationsResult.deletedCount} notifications`);
    } else {
      console.log('⚠️  Notifications collection not found');
    }

    console.log('\n📈 Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    Object.entries(deletedCounts).forEach(([collection, count]) => {
      console.log(`  ${collection.padEnd(20)} : ${count}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Check remaining data
    const userCount = collectionNames.includes('users') 
      ? await db.collection('users').countDocuments() 
      : 0;
    
    console.log('\n✅ Cleanup complete!');
    console.log(`👥 Preserved ${userCount} users`);
    console.log('\n📝 You can now create production-grade posts manually from the UI\n');

  } catch (error) {
    console.error('\n❌ Error during cleanup:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run cleanup
cleanupDatabase();
