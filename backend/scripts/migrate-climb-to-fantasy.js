/**
 * Migration Script: Climb Room → Fantasy Room
 * 
 * Migrates all existing "climb" room data to "fantasy":
 * - Posts: room field
 * - Circles: room field
 * - User stats: room references
 * 
 * Run with: node scripts/migrate-climb-to-fantasy.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anotherme';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function migrateClimbToFantasy() {
  console.log('\n🚀 Starting Climb → Fantasy Room Migration\n');
  
  try {
    // 1. Migrate Posts
    console.log('📝 Migrating Posts...');
    const postsResult = await mongoose.connection.db.collection('posts').updateMany(
      { room: 'climb' },
      { $set: { room: 'fantasy' } }
    );
    console.log(`   ✓ Updated ${postsResult.modifiedCount} posts (${postsResult.matchedCount} matched)`);
    
    // 2. Migrate Circles
    console.log('\n🔵 Migrating Circles...');
    const circlesResult = await mongoose.connection.db.collection('circles').updateMany(
      { room: 'climb' },
      { $set: { room: 'fantasy' } }
    );
    console.log(`   ✓ Updated ${circlesResult.modifiedCount} circles (${circlesResult.matchedCount} matched)`);
    
    // 3. Migrate User Stats
    console.log('\n👤 Migrating User Stats...');
    const users = await mongoose.connection.db.collection('users').find({
      'stats.genius.room': 'climb'
    }).toArray();
    
    let statsUpdated = 0;
    for (const user of users) {
      const updates = {};
      
      // Update room field in each stat if it exists and equals 'climb'
      if (user.stats) {
        ['genius', 'hustle', 'legend'].forEach(stat => {
          if (user.stats[stat] && user.stats[stat].room === 'climb') {
            updates[`stats.${stat}.room`] = 'fantasy';
          }
        });
        
        // Apply updates if any
        if (Object.keys(updates).length > 0) {
          await mongoose.connection.db.collection('users').updateOne(
            { _id: user._id },
            { $set: updates }
          );
          statsUpdated++;
        }
      }
    }
    console.log(`   ✓ Updated ${statsUpdated} users' stats`);
    
    // 4. Migrate Notifications (if any reference climb room)
    console.log('\n🔔 Migrating Notifications...');
    const notificationsResult = await mongoose.connection.db.collection('notifications').updateMany(
      { room: 'climb' },
      { $set: { room: 'fantasy' } }
    );
    console.log(`   ✓ Updated ${notificationsResult.modifiedCount} notifications (${notificationsResult.matchedCount} matched)`);
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ MIGRATION COMPLETE');
    console.log('='.repeat(50));
    console.log(`Posts:         ${postsResult.modifiedCount} updated`);
    console.log(`Circles:       ${circlesResult.modifiedCount} updated`);
    console.log(`User Stats:    ${statsUpdated} users updated`);
    console.log(`Notifications: ${notificationsResult.modifiedCount} updated`);
    console.log('='.repeat(50));
    
    // Verification queries
    console.log('\n🔍 Verification:');
    const remainingClimbPosts = await mongoose.connection.db.collection('posts').countDocuments({ room: 'climb' });
    const remainingClimbCircles = await mongoose.connection.db.collection('circles').countDocuments({ room: 'climb' });
    const fantasyPosts = await mongoose.connection.db.collection('posts').countDocuments({ room: 'fantasy' });
    const fantasyCircles = await mongoose.connection.db.collection('circles').countDocuments({ room: 'fantasy' });
    
    console.log(`   Remaining 'climb' posts:   ${remainingClimbPosts}`);
    console.log(`   Remaining 'climb' circles: ${remainingClimbCircles}`);
    console.log(`   Total 'fantasy' posts:     ${fantasyPosts}`);
    console.log(`   Total 'fantasy' circles:   ${fantasyCircles}`);
    
    if (remainingClimbPosts === 0 && remainingClimbCircles === 0) {
      console.log('\n✅ All data successfully migrated!');
    } else {
      console.log('\n⚠️  Some climb data remains - review manually');
    }
    
  } catch (error) {
    console.error('\n❌ Migration error:', error);
    throw error;
  }
}

async function main() {
  try {
    await connectDB();
    await migrateClimbToFantasy();
    console.log('\n✅ Migration script completed successfully\n');
  } catch (error) {
    console.error('\n❌ Migration script failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed\n');
  }
}

main();
