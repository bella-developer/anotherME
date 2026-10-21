#!/usr/bin/env node

/**
 * PRODUCTION DATA CLEANUP SCRIPT
 * 
 * This script removes ALL development/test data from the database:
 * - All posts from all rooms
 * - All comments
 * - All circles
 * - All notifications
 * 
 * PRESERVES:
 * - User accounts (keeps login credentials)
 * - User stats (resets to 0)
 * 
 * USE WITH EXTREME CAUTION - THIS CANNOT BE UNDONE!
 * 
 * Usage:
 *   node scripts/clean-production-data.js
 * 
 * Or with confirmation bypass (dangerous):
 *   node scripts/clean-production-data.js --yes
 */

import mongoose from 'mongoose';
import readline from 'readline';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '../.env') });

// Import models
import Post from '../src/models/Post.model.js';
import Comment from '../src/models/Comment.model.js';
import Circle from '../src/models/Circle.model.js';
import User from '../src/models/User.model.js';
import Notification from '../src/models/Notification.model.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eso-platform';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bright');
  console.log('='.repeat(60) + '\n');
}

async function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(`${colors.yellow}${question} (yes/no): ${colors.reset}`, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

async function getDataCounts() {
  const [posts, comments, circles, users, notifications] = await Promise.all([
    Post.countDocuments(),
    Comment.countDocuments(),
    Circle.countDocuments(),
    User.countDocuments(),
    Notification.countDocuments()
  ]);

  return { posts, comments, circles, users, notifications };
}

async function cleanDatabase() {
  try {
    logSection('🧹 ESO PLATFORM - PRODUCTION DATA CLEANUP');

    // Connect to database
    log('📡 Connecting to MongoDB...', 'cyan');
    await mongoose.connect(MONGODB_URI);
    log('✓ Connected to database', 'green');

    // Get current data counts
    log('\n📊 Current database state:', 'cyan');
    const beforeCounts = await getDataCounts();
    console.table({
      'Posts': beforeCounts.posts,
      'Comments': beforeCounts.comments,
      'Circles': beforeCounts.circles,
      'Users': beforeCounts.users,
      'Notifications': beforeCounts.notifications
    });

    // Check if confirmation was bypassed
    const bypassConfirmation = process.argv.includes('--yes');

    if (!bypassConfirmation) {
      log('\n⚠️  WARNING: This action will DELETE ALL of the following:', 'red');
      log('  • All posts from Dark, Fantasy, and Philo rooms', 'yellow');
      log('  • All comments', 'yellow');
      log('  • All circles', 'yellow');
      log('  • All notifications', 'yellow');
      log('\n✓ This will PRESERVE:', 'green');
      log('  • User accounts and credentials', 'cyan');
      log('  • User profile information', 'cyan');
      log('\n⚠️  THIS CANNOT BE UNDONE!', 'red');

      const confirmed = await askConfirmation('\nAre you absolutely sure you want to proceed?');
      
      if (!confirmed) {
        log('\n✗ Cleanup cancelled by user', 'yellow');
        await mongoose.disconnect();
        process.exit(0);
      }

      // Double confirmation for safety
      const doubleConfirmed = await askConfirmation('\nType "yes" again to confirm deletion');
      
      if (!doubleConfirmed) {
        log('\n✗ Cleanup cancelled by user', 'yellow');
        await mongoose.disconnect();
        process.exit(0);
      }
    }

    logSection('🗑️  Starting cleanup process...');

    // 1. Delete all posts
    log('1/5 Deleting all posts...', 'cyan');
    const deletedPosts = await Post.deleteMany({});
    log(`✓ Deleted ${deletedPosts.deletedCount} posts`, 'green');

    // 2. Delete all comments
    log('2/5 Deleting all comments...', 'cyan');
    const deletedComments = await Comment.deleteMany({});
    log(`✓ Deleted ${deletedComments.deletedCount} comments`, 'green');

    // 3. Delete all circles
    log('3/5 Deleting all circles...', 'cyan');
    const deletedCircles = await Circle.deleteMany({});
    log(`✓ Deleted ${deletedCircles.deletedCount} circles`, 'green');

    // 4. Delete all notifications
    log('4/5 Deleting all notifications...', 'cyan');
    const deletedNotifications = await Notification.deleteMany({});
    log(`✓ Deleted ${deletedNotifications.deletedCount} notifications`, 'green');

    // 5. Reset user stats
    log('5/5 Resetting user statistics...', 'cyan');
    const resetUsers = await User.updateMany(
      {},
      {
        $set: {
          'stats.xp': 0,
          'stats.level': 1,
          'stats.darkXP': 0,
          'stats.fantasyXP': 0,
          'stats.philoXP': 0,
          'stats.postCount': 0,
          'stats.commentCount': 0
        }
      }
    );
    log(`✓ Reset stats for ${resetUsers.modifiedCount} users`, 'green');

    // Get final data counts
    logSection('📊 Cleanup Summary');
    const afterCounts = await getDataCounts();
    
    console.log('\n📉 Data removed:');
    console.table({
      'Posts': `${beforeCounts.posts} → ${afterCounts.posts}`,
      'Comments': `${beforeCounts.comments} → ${afterCounts.comments}`,
      'Circles': `${beforeCounts.circles} → ${afterCounts.circles}`,
      'Notifications': `${beforeCounts.notifications} → ${afterCounts.notifications}`
    });

    console.log('\n✓ Data preserved:');
    console.table({
      'Users': `${beforeCounts.users} (preserved)`,
      'User Profiles': 'All preserved'
    });

    logSection('✅ CLEANUP COMPLETED SUCCESSFULLY');
    log('Database is now ready for production use!', 'green');
    log('\nNext steps:', 'cyan');
    log('  1. Verify the cleanup in MongoDB', 'blue');
    log('  2. Test user login functionality', 'blue');
    log('  3. Deploy to production', 'blue');

  } catch (error) {
    logSection('❌ ERROR DURING CLEANUP');
    log(`Error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    log('\n📡 Disconnected from database', 'cyan');
  }
}

// Run the cleanup
cleanDatabase();
