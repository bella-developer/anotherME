#!/usr/bin/env node

/**
 * Comprehensive Test Script for Post Creation Flow
 * Tests: Circle creation, Post creation in all rooms, Category filtering, Reactions
 */

import mongoose from 'mongoose';
import User from './src/models/User.model.js';
import Circle from './src/models/Circle.model.js';
import Post from './src/models/Post.model.js';
import { hashPassword } from './src/utils/password.utils.js';
import { generateOpaqueId } from './src/utils/id.utils.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anotherme';

// Sample data
const sampleUsers = [
  { username: 'testuser1', password: 'Password123!' },
  { username: 'testuser2', password: 'Password123!' },
  { username: 'testuser3', password: 'Password123!' }
];

const sampleCircles = [
  {
    name: 'Dark Confessions',
    description: 'A safe space to share your deepest confessions and regrets',
    visibility: 'public',
    categories: ['CONFESSION', 'REGRET', 'DARK'],
    room: 'dark'
  },
  {
    name: 'Startup Ideas',
    description: 'Share and refine your entrepreneurial ideas',
    visibility: 'public',
    categories: ['IDEA', 'BUSINESS', 'ENTREPRENEUR'],
    room: 'climb'
  },
  {
    name: 'Deep Thoughts',
    description: 'Philosophical reflections and spiritual insights',
    visibility: 'public',
    categories: ['SPIRITUAL', 'SHADOW', 'DEEP'],
    room: 'philo'
  },
  {
    name: 'Future Vision',
    description: 'Futuristic ideas and innovations',
    visibility: 'public',
    categories: ['FUTURISTIC', 'IDEA'],
    room: 'climb'
  }
];

const samplePosts = [
  // Dark Room Posts
  {
    room: 'dark',
    category: 'CONFESSION',
    content: 'I have been carrying this secret for years. I pretended to be happy at my wedding, but deep down I knew it was a mistake. I was too afraid to speak up and hurt everyone. Now I live with this regret every single day, wondering what my life could have been if I had been brave enough to be honest.',
    circleName: 'Dark Confessions'
  },
  {
    room: 'dark',
    category: 'REGRET',
    content: 'I chose my career over my family. I missed my daughter growing up because I was always traveling for work. Now she barely talks to me, and I realize that all the success in the world cannot replace the moments I lost. If I could go back, I would choose differently.',
    circleName: 'Dark Confessions'
  },
  {
    room: 'dark',
    category: 'DARK',
    content: 'Sometimes I feel like I am drowning in my own thoughts. The darkness feels overwhelming, and I do not know how to reach out for help. I put on a smile every day, but inside I am screaming. I just want someone to understand without judging me.',
    circleName: 'Dark Confessions'
  },
  
  // Climb Room Posts
  {
    room: 'climb',
    category: 'IDEA',
    title: 'AI-Powered Personal Finance Coach',
    content: 'What if we created an AI that learns your spending habits and provides personalized financial advice? Not just budgeting, but understanding your psychology around money. It could predict when you are about to make an impulse purchase and gently nudge you toward better decisions. The key is making it feel like a supportive friend, not a judgmental parent.',
    circleName: 'Startup Ideas'
  },
  {
    room: 'climb',
    category: 'BUSINESS',
    title: 'Subscription Box for Local Artisans',
    content: 'A curated subscription service that connects local artisans with customers. Each month, subscribers receive handmade items from different creators in their region. This supports local economies, reduces shipping emissions, and gives artisans a reliable income stream. The challenge is logistics and maintaining quality control across diverse creators.',
    circleName: 'Startup Ideas'
  },
  {
    room: 'climb',
    category: 'ENTREPRENEUR',
    title: 'Building in Public Strategy',
    content: 'I have been building my SaaS product in public for 6 months. Sharing daily progress, revenue numbers, and failures has been transformative. The accountability keeps me motivated, and the feedback has shaped the product in ways I never imagined. If you are thinking about starting something, consider documenting the journey from day one.',
    circleName: 'Startup Ideas'
  },
  {
    room: 'climb',
    category: 'FUTURISTIC',
    title: 'Decentralized Social Networks',
    content: 'Imagine a social network where you truly own your data. No central authority can censor you or sell your information. Using blockchain and distributed storage, we could create platforms that are censorship-resistant and privacy-first. The technical challenges are significant, but the potential for freedom is worth exploring.',
    circleName: 'Future Vision'
  },
  
  // Philo Room Posts
  {
    room: 'philo',
    category: 'SPIRITUAL',
    title: 'The Illusion of Separation',
    content: 'We spend our lives believing we are separate from everything around us. But what if this separation is just an illusion? Every atom in our body was once part of a star. We breathe the same air as everyone who has ever lived. Perhaps enlightenment is simply remembering that we were never separate to begin with.',
    circleName: 'Deep Thoughts'
  },
  {
    room: 'philo',
    category: 'SHADOW',
    title: 'Embracing Your Dark Side',
    content: 'Carl Jung taught us about the shadow - the parts of ourselves we reject and hide. But what if our darkness is not something to overcome, but something to integrate? Our anger, jealousy, and fear are not enemies. They are messengers trying to show us where we need healing. True wholeness comes from accepting all of who we are.',
    circleName: 'Deep Thoughts'
  },
  {
    room: 'philo',
    category: 'DEEP',
    title: 'The Paradox of Choice',
    content: 'We live in an age of infinite options, yet we feel more trapped than ever. Every choice we make closes doors to other possibilities. Is freedom really about having more choices, or is it about being at peace with the choices we make? Perhaps true freedom is not in having options, but in accepting the path we are on.',
    circleName: 'Deep Thoughts'
  }
];

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function clearData() {
  console.log('\n🗑️  Clearing existing test data...');
  await User.deleteMany({ username: { $in: sampleUsers.map(u => u.username) } });
  await Circle.deleteMany({ name: { $in: sampleCircles.map(c => c.name) } });
  await Post.deleteMany({ room: { $in: ['dark', 'climb', 'philo'] } });
  console.log('✓ Test data cleared');
}

async function createUsers() {
  console.log('\n👥 Creating test users...');
  const users = [];
  
  for (const userData of sampleUsers) {
    const hashedPassword = await hashPassword(userData.password);
    const user = await User.create({
      username: userData.username,
      password: hashedPassword,
      age: 25,
      gender: 'prefer-not-to-say'
    });
    users.push(user);
    console.log(`✓ Created user: ${user.username}`);
  }
  
  return users;
}

async function createCircles(users) {
  console.log('\n⭕ Creating circles...');
  const circles = [];
  
  for (const circleData of sampleCircles) {
    const creator = users[Math.floor(Math.random() * users.length)];
    const circle = await Circle.create({
      ...circleData,
      creatorId: creator._id
    });
    circles.push(circle);
    console.log(`✓ Created circle: ${circle.name} (ID: ${generateOpaqueId(circle._id.toString())})`);
  }
  
  return circles;
}

async function createPosts(users, circles) {
  console.log('\n📝 Creating posts...');
  const posts = [];
  
  for (const postData of samplePosts) {
    const author = users[Math.floor(Math.random() * users.length)];
    const circle = circles.find(c => c.name === postData.circleName);
    
    if (!circle) {
      console.log(`✗ Circle not found: ${postData.circleName}`);
      continue;
    }
    
    const post = await Post.create({
      authorId: author._id,
      room: postData.room,
      title: postData.title || null,
      circleId: circle._id,
      circles: [{
        circleId: circle._id,
        name: circle.name,
        color: '#D97757',
        icon: '⬢'
      }],
      category: postData.category,
      content: postData.content,
      contentSanitized: postData.content,
      climbState: postData.room === 'climb' ? 'forming' : undefined,
      isCircleTopic: true, // Set as circle topic
      circleTopicSetAt: new Date(),
      circleTopicSetBy: author._id,
      reactions: {
        // Initialize all reaction types to 0
        iFeelYou: 0,
        notGood: 0,
        youreNotAlone: 0,
        sendingStrength: 0,
        push: 0,
        pull: 0,
        gear: 0,
        rocket: 0,
        lamp: 0,
        spark: 0,
        clap: 0
      }
    });
    
    posts.push(post);
    console.log(`✓ Created ${postData.room} room post: ${postData.title || postData.content.substring(0, 50)}...`);
  }
  
  return posts;
}

async function testQueries(circles, posts) {
  console.log('\n🔍 Testing queries...');
  
  // Test 1: Query posts by room
  console.log('\n1. Query posts by room:');
  for (const room of ['dark', 'climb', 'philo']) {
    const roomPosts = await Post.find({ room }).countDocuments();
    console.log(`   ${room}: ${roomPosts} posts`);
  }
  
  // Test 2: Query posts by category
  console.log('\n2. Query posts by category:');
  const categories = ['CONFESSION', 'REGRET', 'DARK', 'IDEA', 'BUSINESS', 'ENTREPRENEUR', 'FUTURISTIC', 'SPIRITUAL', 'SHADOW', 'DEEP'];
  for (const category of categories) {
    const categoryPosts = await Post.find({ category }).countDocuments();
    if (categoryPosts > 0) {
      console.log(`   ${category}: ${categoryPosts} posts`);
    }
  }
  
  // Test 3: Query posts by circle
  console.log('\n3. Query posts by circle:');
  for (const circle of circles) {
    const circlePosts = await Post.find({ circleId: circle._id }).countDocuments();
    console.log(`   ${circle.name}: ${circlePosts} posts`);
  }
  
  // Test 4: Combined filters (room + category)
  console.log('\n4. Combined filters (room + category):');
  const darkConfessions = await Post.find({ room: 'dark', category: 'CONFESSION' }).countDocuments();
  const climbIdeas = await Post.find({ room: 'climb', category: 'IDEA' }).countDocuments();
  const philoSpiritual = await Post.find({ room: 'philo', category: 'SPIRITUAL' }).countDocuments();
  console.log(`   Dark + Confession: ${darkConfessions} posts`);
  console.log(`   Climb + Idea: ${climbIdeas} posts`);
  console.log(`   Philo + Spiritual: ${philoSpiritual} posts`);
}

async function displaySummary(users, circles, posts) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Users created: ${users.length}`);
  console.log(`Circles created: ${circles.length}`);
  console.log(`Posts created: ${posts.length}`);
  console.log('\n📋 Test Credentials:');
  for (const user of sampleUsers) {
    console.log(`   Username: ${user.username} | Password: ${user.password}`);
  }
  console.log('\n🎯 Next Steps:');
  console.log('   1. Start the backend: npm run dev');
  console.log('   2. Start the frontend: cd frontend && npm run dev');
  console.log('   3. Login with any test user');
  console.log('   4. Navigate to each room and test:');
  console.log('      - View posts');
  console.log('      - Filter by category');
  console.log('      - Create new posts');
  console.log('      - Add reactions');
  console.log('      - View circle details');
  console.log('='.repeat(60));
}

async function main() {
  try {
    console.log('🚀 Starting Post Creation Flow Test\n');
    
    await connectDB();
    await clearData();
    
    const users = await createUsers();
    const circles = await createCircles(users);
    const posts = await createPosts(users, circles);
    
    await testQueries(circles, posts);
    await displaySummary(users, circles, posts);
    
    console.log('\n✅ Test completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('✓ Database connection closed');
  }
}

main();
