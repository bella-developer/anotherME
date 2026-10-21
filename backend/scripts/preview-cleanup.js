#!/usr/bin/env node

/**
 * PREVIEW PRODUCTION CLEANUP (DRY RUN)
 * 
 * This script shows what WOULD be deleted without actually deleting anything.
 * Use this to verify what data will be removed before running the actual cleanup.
 * 
 * Usage:
 *   node scripts/preview-cleanup.js
 */

import mongoose from 'mongoose';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '../.env') });

import Post from '../src/models/Post.model.js';
import Comment from '../src/models/Comment.model.js';
import Circle from '../src/models/Circle.model.js';
import User from '../src/models/User.model.js';
import Notification from '../src/models/Notification.model.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eso-platform';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function previewCleanup() {
  try {
    console.log('\n' + '='.repeat(60));
    log('🔍 PREVIEW: Production Cleanup (DRY RUN)', 'bright');
    console.log('='.repeat(60) + '\n');

    log('📡 Connecting to MongoDB...', 'cyan');
    await mongoose.connect(MONGODB_URI);
    log('✓ Connected\n', 'green');

    // Get detailed counts
    const [
      totalPosts,
      darkPosts,
      fantasyPosts,
      philoPosts,
      totalComments,
      totalCircles,
      darkCircles,
      fantasyCircles,
      philoCircles,
      totalUsers,
      totalNotifications
    ] = await Promise.all([
      Post.countDocuments(),
      Post.countDocuments({ room: 'dark' }),
      Post.countDocuments({ room: 'fantasy' }),
      Post.countDocuments({ room: 'philo' }),
      Comment.countDocuments(),
      Circle.countDocuments(),
      Circle.countDocuments({ room: 'dark' }),
      Circle.countDocuments({ room: 'fantasy' }),
      Circle.countDocuments({ room: 'philo' }),
      User.countDocuments(),
      Notification.countDocuments()
    ]);

    // Get sample data
    const samplePosts = await Post.find().limit(5).select('title content room createdAt').lean();
    const sampleCircles = await Circle.find().limit(5).select('name room postCount createdAt').lean();
    const sampleUsers = await User.find().limit(5).select('username email role createdAt').lean();

    log('📊 CURRENT DATABASE STATE:', 'bright');
    console.log('\n' + colors.red + '⚠️  WILL BE DELETED:' + colors.reset);
    console.table({
      'Total Posts': totalPosts,
      '  ↳ Dark Room': darkPosts,
      '  ↳ Fantasy Room': fantasyPosts,
      '  ↳ Philo Room': philoPosts,
      'Total Comments': totalComments,
      'Total Circles': totalCircles,
      '  ↳ Dark Circles': darkCircles,
      '  ↳ Fantasy Circles': fantasyCircles,
      '  ↳ Philo Circles': philoCircles,
      'Total Notifications': totalNotifications
    });

    console.log('\n' + colors.green + '✓ WILL BE PRESERVED:' + colors.reset);
    console.table({
      'User Accounts': totalUsers,
      'User Credentials': 'All preserved',
      'User Profiles': 'All preserved'
    });

    if (samplePosts.length > 0) {
      log('\n📝 Sample Posts (first 5):', 'yellow');
      samplePosts.forEach((post, index) => {
        console.log(`  ${index + 1}. [${post.room}] ${post.title || post.content.substring(0, 50)}...`);
      });
    }

    if (sampleCircles.length > 0) {
      log('\n⬢ Sample Circles (first 5):', 'yellow');
      sampleCircles.forEach((circle, index) => {
        console.log(`  ${index + 1}. [${circle.room}] ${circle.name} (${circle.postCount} posts)`);
      });
    }

    if (sampleUsers.length > 0) {
      log('\n👤 Sample Users (first 5 - WILL BE PRESERVED):', 'cyan');
      sampleUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.username} (${user.email}) - Role: ${user.role}`);
      });
    }

    console.log('\n' + '='.repeat(60));
    log('📋 SUMMARY', 'bright');
    console.log('='.repeat(60));
    log(`\n✗ ${totalPosts + totalComments + totalCircles + totalNotifications} items will be DELETED`, 'red');
    log(`✓ ${totalUsers} user accounts will be PRESERVED`, 'green');

    log('\n💡 To proceed with actual cleanup:', 'yellow');
    log('   node scripts/clean-production-data.js', 'cyan');

  } catch (error) {
    log('\n❌ Error:', 'red');
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    log('\n📡 Disconnected from database', 'cyan');
  }
}

previewCleanup();
