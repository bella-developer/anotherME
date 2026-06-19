#!/usr/bin/env node

/**
 * Clear and Reseed Database Script
 * Clears all data and reseeds with fresh demo data
 */

import mongoose from 'mongoose';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '../.env') });

// Import models
import User from '../src/models/User.model.js';
import Circle from '../src/models/Circle.model.js';
import Post from '../src/models/Post.model.js';
import Comment from '../src/models/Comment.model.js';
import Notification from '../src/models/Notification.model.js';

/**
 * Connect to MongoDB
 */
async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

/**
 * Clear all collections
 */
async function clearDatabase() {
  try {
    console.log('\n🗑️  Clearing database...');
    
    // Drop collections entirely (removes data AND indexes)
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    if (collectionNames.includes('users')) {
      await mongoose.connection.db.dropCollection('users');
      console.log('  ✓ Dropped users collection');
    }
    
    if (collectionNames.includes('circles')) {
      await mongoose.connection.db.dropCollection('circles');
      console.log('  ✓ Dropped circles collection');
    }
    
    if (collectionNames.includes('posts')) {
      await mongoose.connection.db.dropCollection('posts');
      console.log('  ✓ Dropped posts collection');
    }
    
    if (collectionNames.includes('comments')) {
      await mongoose.connection.db.dropCollection('comments');
      console.log('  ✓ Dropped comments collection');
    }
    
    if (collectionNames.includes('notifications')) {
      await mongoose.connection.db.dropCollection('notifications');
      console.log('  ✓ Dropped notifications collection');
    }
    
    console.log('✅ Database cleared successfully\n');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}

/**
 * Ensure indexes are created for all models
 */
async function ensureIndexes() {
  try {
    console.log('🔨 Creating indexes...');
    
    await User.createIndexes();
    console.log('  ✓ Created user indexes');
    
    await Circle.createIndexes();
    console.log('  ✓ Created circle indexes');
    
    await Post.createIndexes();
    console.log('  ✓ Created post indexes');
    
    await Comment.createIndexes();
    console.log('  ✓ Created comment indexes');
    
    await Notification.createIndexes();
    console.log('  ✓ Created notification indexes');
    
    console.log('✅ Indexes created successfully\n');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    throw error;
  }
}

/**
 * Create demo users
 */
async function seedUsers() {
  try {
    console.log('👤 Creating demo users...');
    
    // Hash the demo password
    const hashedPassword = await bcrypt.hash('demo123', 12);
    
    const users = await User.create([
      {
        username: 'alice',
        email: 'alice@example.com',
        password: hashedPassword,
        bio: 'Explorer of thoughts and ideas',
      },
      {
        username: 'bob',
        email: 'bob@example.com',
        password: hashedPassword,
        bio: 'Climbing towards success',
      },
      {
        username: 'charlie',
        email: 'charlie@example.com',
        password: hashedPassword,
        bio: 'Philosopher and thinker',
      }
    ]);
    
    console.log(`  ✓ Created ${users.length} users`);
    return users;
  } catch (error) {
    console.error('❌ Error creating users:', error);
    throw error;
  }
}

/**
 * Create demo circles
 */
async function seedCircles(users) {
  try {
    console.log('⭕ Creating demo circles...');
    
    const circles = await Circle.create([
      // Dark Room circles
      {
        name: 'Late Night Thoughts',
        description: 'A safe space for sharing thoughts that keep us awake',
        room: 'dark',
        visibility: 'public',
        creatorId: users[0]._id,
        memberCount: 2,
        categories: ['ANXIETY', 'LONELINESS', 'DARK'],
      },
      {
        name: 'Healing Hearts',
        description: 'Supporting each other through difficult times',
        room: 'dark',
        visibility: 'public',
        creatorId: users[1]._id,
        memberCount: 2,
        categories: ['LOSS', 'REGRET', 'GRIEF'],
      },
      
      // Climb Room circles
      {
        name: 'Startup Journey',
        description: 'Building the future together',
        room: 'climb',
        visibility: 'public',
        creatorId: users[1]._id,
        memberCount: 3,
        categories: ['BUSINESS', 'ENTREPRENEUR', 'IDEA'],
      },
      {
        name: 'Innovation Hub',
        description: 'Where ideas become reality',
        room: 'climb',
        visibility: 'public',
        creatorId: users[2]._id,
        memberCount: 2,
        categories: ['IDEA', 'FUTURISTIC', 'BUSINESS'],
      },
      
      // Philo Room circles
      {
        name: 'Deep Thinkers',
        description: 'Exploring the nature of existence',
        room: 'philo',
        visibility: 'public',
        creatorId: users[2]._id,
        memberCount: 2,
        categories: ['DEEP', 'SPIRITUAL', 'SHADOW'],
      },
      {
        name: 'Wisdom Seekers',
        description: 'Finding truth in the questions',
        room: 'philo',
        visibility: 'public',
        creatorId: users[0]._id,
        memberCount: 3,
        categories: ['SPIRITUAL', 'DEEP'],
      },
    ]);
    
    console.log(`  ✓ Created ${circles.length} circles`);
    return circles;
  } catch (error) {
    console.error('❌ Error creating circles:', error);
    throw error;
  }
}

/**
 * Create demo posts
 */
async function seedPosts(users, circles) {
  try {
    console.log('📝 Creating demo posts...');
    
    const posts = await Post.create([
      // Dark Room posts
      {
        content: 'Sometimes the weight of the world feels too heavy. Anyone else feel this way?',
        contentSanitized: 'Sometimes the weight of the world feels too heavy. Anyone else feel this way?',
        room: 'dark',
        category: 'DARK',
        authorId: users[0]._id,
        circleId: circles[0]._id,
        reactions: { iFeelYou: 5, youreNotAlone: 3 },
      },
      {
        content: 'Learning to accept that some things are beyond our control...',
        contentSanitized: 'Learning to accept that some things are beyond our control...',
        room: 'dark',
        category: 'ANXIETY',
        authorId: users[1]._id,
        circleId: circles[0]._id,
        reactions: { sendingStrength: 2 },
      },
      
      // Climb Room posts
      {
        title: 'First Customer Milestone',
        content: 'Just got our first paying customer! The journey is just beginning.',
        contentSanitized: 'Just got our first paying customer! The journey is just beginning.',
        room: 'climb',
        category: 'BUSINESS',
        authorId: users[1]._id,
        circleId: circles[2]._id,
        reactions: { push: 8, rocket: 4 },
      },
      {
        title: 'MVP Launch Strategy',
        content: 'Working on our minimum viable product. What features matter most?',
        contentSanitized: 'Working on our minimum viable product. What features matter most?',
        room: 'climb',
        category: 'IDEA',
        authorId: users[2]._id,
        circleId: circles[2]._id,
        reactions: { gear: 3, pull: 1 },
      },
      
      // Philo Room posts
      {
        title: 'The Nature of Time',
        content: 'Is time a human construct or a fundamental aspect of reality?',
        contentSanitized: 'Is time a human construct or a fundamental aspect of reality?',
        room: 'philo',
        category: 'DEEP',
        authorId: users[2]._id,
        circleId: circles[4]._id,
        reactions: { lamp: 6, spark: 4 },
      },
      {
        title: 'Finding Meaning',
        content: 'How do we create meaning in a seemingly meaningless universe?',
        contentSanitized: 'How do we create meaning in a seemingly meaningless universe?',
        room: 'philo',
        category: 'SPIRITUAL',
        authorId: users[0]._id,
        circleId: circles[5]._id,
        reactions: { clap: 5, lamp: 3 },
      },
    ]);
    
    console.log(`  ✓ Created ${posts.length} posts`);
    return posts;
  } catch (error) {
    console.error('❌ Error creating posts:', error);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🚀 Starting clear and reseed process...\n');
    
    await connectDB();
    await clearDatabase();
    await ensureIndexes();
    
    const users = await seedUsers();
    const circles = await seedCircles(users);
    const posts = await seedPosts(users, circles);
    
    console.log('\n✅ Database cleared and reseeded successfully!');
    console.log(`\nSummary:`);
    console.log(`  - Users: ${users.length}`);
    console.log(`  - Circles: ${circles.length}`);
    console.log(`  - Posts: ${posts.length}`);
    console.log('\n💡 You can now test with these demo accounts:');
    console.log('  - Username: alice, bob, or charlie');
    console.log('  - Password: demo123 (default for all)\n');
    
  } catch (error) {
    console.error('\n❌ Error during reseed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  }
}

// Run the script
main();
