#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.model.js';
import Circle from '../src/models/Circle.model.js';
import Post from '../src/models/Post.model.js';
import Comment from '../src/models/Comment.model.js';
import { hashPassword } from '../src/utils/password.utils.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anotherme';

/**
 * Comprehensive seed script with proper room assignments
 * Clears database and creates fresh data with room fields
 */

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed with room assignments...\n');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Circle.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    console.log('✅ Database cleared\n');

    // Create users
    console.log('👥 Creating users...');
    const hashedPassword = await hashPassword('TestPass123!');
    
    const users = await User.create([
      {
        username: 'testuser1',
        password: hashedPassword,
        age: 28,
        gender: 'prefer-not-to-say'
      },
      {
        username: 'testuser2',
        password: hashedPassword,
        age: 32,
        gender: 'prefer-not-to-say'
      },
      {
        username: 'testuser3',
        password: hashedPassword,
        age: 25,
        gender: 'prefer-not-to-say'
      },
      {
        username: 'testuser4',
        password: hashedPassword,
        age: 30,
        gender: 'prefer-not-to-say'
      },
      {
        username: 'testuser5',
        password: hashedPassword,
        age: 27,
        gender: 'prefer-not-to-say'
      }
    ]);
    console.log(`✅ Created ${users.length} users\n`);

    // Create Dark Room circles
    console.log('🌑 Creating Dark Room circles...');
    const darkCircles = await Circle.create([
      {
        name: 'Dark Confessions',
        description: 'A safe space to share your deepest confessions and regrets',
        creatorId: users[0]._id,
        visibility: 'public',
        categories: ['CONFESSION', 'REGRET', 'DARK'],
        room: 'dark',
        memberCount: 0,
        postCount: 0
      },
      {
        name: 'Twilight Reflections',
        description: 'Where day meets night, we share our shadows',
        creatorId: users[1]._id,
        visibility: 'public',
        categories: ['DARK', 'REGRET'],
        room: 'dark',
        memberCount: 0,
        postCount: 0
      },
      {
        name: 'The Void',
        description: 'Speak into the darkness, find solace in anonymity',
        creatorId: users[2]._id,
        visibility: 'public',
        categories: ['CONFESSION', 'DARK'],
        room: 'dark',
        memberCount: 0,
        postCount: 0
      }
    ]);
    console.log(`✅ Created ${darkCircles.length} Dark Room circles\n`);

    // Create Climb Room circles
    console.log('🚀 Creating Climb Room circles...');
    const climbCircles = await Circle.create([
      {
        name: 'Startup Ideas',
        description: 'Share and refine your entrepreneurial ideas',
        creatorId: users[0]._id,
        visibility: 'public',
        categories: ['IDEA', 'BUSINESS', 'ENTREPRENEUR'],
        room: 'climb',
        memberCount: 0,
        postCount: 0
      },
      {
        name: 'Future Vision',
        description: 'Futuristic ideas and innovations',
        creatorId: users[1]._id,
        visibility: 'public',
        categories: ['FUTURISTIC', 'IDEA'],
        room: 'climb',
        memberCount: 0,
        postCount: 0
      },
      {
        name: 'Summit Seekers',
        description: 'For those climbing out of the depths, one step at a time',
        creatorId: users[2]._id,
        visibility: 'public',
        categories: ['ENTREPRENEUR', 'BUSINESS'],
        room: 'climb',
        memberCount: 0,
        postCount: 0
      },
      {
        name: 'Business Ventures',
        description: 'Discuss business strategies and commercial opportunities',
        creatorId: users[3]._id,
        visibility: 'public',
        categories: ['BUSINESS', 'ENTREPRENEUR'],
        room: 'climb',
        memberCount: 0,
        postCount: 0
      }
    ]);
    console.log(`✅ Created ${climbCircles.length} Climb Room circles\n`);

    // Create Philo Room circles
    console.log('🧘 Creating Philo Room circles...');
    const philoCircles = await Circle.create([
      {
        name: 'Deep Thoughts',
        description: 'Philosophical reflections and spiritual insights',
        creatorId: users[0]._id,
        visibility: 'public',
        categories: ['DEEP', 'SPIRITUAL'],
        room: 'philo',
        memberCount: 0,
        postCount: 0
      },
      {
        name: 'Shadow Work',
        description: 'Exploring the hidden parts of ourselves',
        creatorId: users[1]._id,
        visibility: 'public',
        categories: ['SHADOW', 'DEEP'],
        room: 'philo',
        memberCount: 0,
        postCount: 0
      },
      {
        name: 'Wisdom Seekers',
        description: 'In search of meaning and understanding',
        creatorId: users[2]._id,
        visibility: 'public',
        categories: ['SPIRITUAL', 'DEEP'],
        room: 'philo',
        memberCount: 0,
        postCount: 0
      }
    ]);
    console.log(`✅ Created ${philoCircles.length} Philo Room circles\n`);

    // Create Dark Room posts
    console.log('📝 Creating Dark Room posts...');
    const darkPosts = await Post.create([
      {
        authorId: users[0]._id,
        room: 'dark',
        circleId: darkCircles[0]._id,
        circles: [{
          circleId: darkCircles[0]._id,
          name: darkCircles[0].name
        }],
        category: 'CONFESSION',
        content: 'I carry a weight that no one sees. Every smile is a mask, every laugh a performance. Sometimes I wonder if anyone would notice if I just... stopped pretending.',
        contentSanitized: 'I carry a weight that no one sees. Every smile is a mask, every laugh a performance. Sometimes I wonder if anyone would notice if I just... stopped pretending.',
        reactions: {
          iFeelYou: 5,
          notGood: 2,
          youreNotAlone: 8,
          sendingStrength: 3
        },
        commentCount: 0
      },
      {
        authorId: users[1]._id,
        room: 'dark',
        circleId: darkCircles[1]._id,
        circles: [{
          circleId: darkCircles[1]._id,
          name: darkCircles[1].name
        }],
        category: 'REGRET',
        content: 'I said things I can never take back. Words that cut deeper than any blade. Now they haunt me in the quiet moments, echoing in the spaces between heartbeats.',
        contentSanitized: 'I said things I can never take back. Words that cut deeper than any blade. Now they haunt me in the quiet moments, echoing in the spaces between heartbeats.',
        reactions: {
          iFeelYou: 12,
          youreNotAlone: 6,
          sendingStrength: 4
        },
        commentCount: 0
      }
    ]);
    console.log(`✅ Created ${darkPosts.length} Dark Room posts\n`);

    // Create Climb Room posts
    console.log('📝 Creating Climb Room posts...');
    const climbPosts = await Post.create([
      {
        authorId: users[2]._id,
        room: 'climb',
        circleId: climbCircles[0]._id,
        circles: [{
          circleId: climbCircles[0]._id,
          name: climbCircles[0].name
        }],
        category: 'IDEA',
        title: 'AI-Powered Mental Health Companion',
        content: 'What if we built an AI that truly understands emotional context? Not just keywords, but the nuance of human struggle. A companion that listens without judgment, available 24/7 for those midnight moments when everything feels too heavy.',
        contentSanitized: 'What if we built an AI that truly understands emotional context? Not just keywords, but the nuance of human struggle. A companion that listens without judgment, available 24/7 for those midnight moments when everything feels too heavy.',
        climbState: 'forming',
        reactions: {
          push: 15,
          pull: 2,
          gear: 8,
          rocket: 5
        },
        commentCount: 0
      },
      {
        authorId: users[3]._id,
        room: 'climb',
        circleId: climbCircles[1]._id,
        circles: [{
          circleId: climbCircles[1]._id,
          name: climbCircles[1].name
        }],
        category: 'FUTURISTIC',
        title: 'Decentralized Anonymous Social Network',
        content: 'Imagine a social platform where your identity is truly yours. No corporate servers, no data mining, just pure human connection. Built on blockchain, powered by community, owned by no one.',
        contentSanitized: 'Imagine a social platform where your identity is truly yours. No corporate servers, no data mining, just pure human connection. Built on blockchain, powered by community, owned by no one.',
        climbState: 'sharpening',
        reactions: {
          push: 20,
          gear: 12,
          rocket: 8
        },
        commentCount: 0
      },
      {
        authorId: users[4]._id,
        room: 'climb',
        circleId: climbCircles[2]._id,
        circles: [{
          circleId: climbCircles[2]._id,
          name: climbCircles[2].name
        }],
        category: 'ENTREPRENEUR',
        title: 'Micro-SaaS for Mental Wellness',
        content: 'Small, focused tools for specific mental health needs. Not another all-in-one app, but precise instruments for precise problems. Anxiety tracker. Gratitude journal. Mood patterns. Each one perfect at its single job.',
        contentSanitized: 'Small, focused tools for specific mental health needs. Not another all-in-one app, but precise instruments for precise problems. Anxiety tracker. Gratitude journal. Mood patterns. Each one perfect at its single job.',
        climbState: 'forming',
        reactions: {
          push: 10,
          gear: 6,
          rocket: 3
        },
        commentCount: 0
      }
    ]);
    console.log(`✅ Created ${climbPosts.length} Climb Room posts\n`);

    // Create Philo Room posts
    console.log('📝 Creating Philo Room posts...');
    const philoPosts = await Post.create([
      {
        authorId: users[0]._id,
        room: 'philo',
        circleId: philoCircles[0]._id,
        circles: [{
          circleId: philoCircles[0]._id,
          name: philoCircles[0].name
        }],
        category: 'DEEP',
        title: 'The Weight of Consciousness',
        content: 'To be aware is to suffer, yet to be unaware is to not truly live. We are cursed with the knowledge of our own mortality, blessed with the capacity to find meaning in the finite. Is this the human condition, or is there something beyond?',
        contentSanitized: 'To be aware is to suffer, yet to be unaware is to not truly live. We are cursed with the knowledge of our own mortality, blessed with the capacity to find meaning in the finite. Is this the human condition, or is there something beyond?',
        reactions: {
          lamp: 15,
          spark: 8,
          clap: 12
        },
        commentCount: 0
      },
      {
        authorId: users[1]._id,
        room: 'philo',
        circleId: philoCircles[1]._id,
        circles: [{
          circleId: philoCircles[1]._id,
          name: philoCircles[1].name
        }],
        category: 'SHADOW',
        title: 'Embracing the Darkness Within',
        content: 'What if our shadows are not enemies to be conquered, but teachers to be understood? The parts of ourselves we hide, the thoughts we dare not speak—perhaps they hold the keys to our wholeness.',
        contentSanitized: 'What if our shadows are not enemies to be conquered, but teachers to be understood? The parts of ourselves we hide, the thoughts we dare not speak—perhaps they hold the keys to our wholeness.',
        reactions: {
          lamp: 10,
          spark: 15,
          clap: 8
        },
        commentCount: 0
      }
    ]);
    console.log(`✅ Created ${philoPosts.length} Philo Room posts\n`);

    // Update circle post counts
    console.log('📊 Updating circle statistics...');
    for (const circle of [...darkCircles, ...climbCircles, ...philoCircles]) {
      const postCount = await Post.countDocuments({ circleId: circle._id });
      await Circle.findByIdAndUpdate(circle._id, { postCount });
    }
    console.log('✅ Circle statistics updated\n');

    // Summary
    console.log('═══════════════════════════════════════');
    console.log('📊 SEED SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log(`👥 Users: ${users.length}`);
    console.log(`\n🌑 Dark Room:`);
    console.log(`   Circles: ${darkCircles.length}`);
    console.log(`   Posts: ${darkPosts.length}`);
    console.log(`\n🚀 Climb Room:`);
    console.log(`   Circles: ${climbCircles.length}`);
    console.log(`   Posts: ${climbPosts.length}`);
    console.log(`\n🧘 Philo Room:`);
    console.log(`   Circles: ${philoCircles.length}`);
    console.log(`   Posts: ${philoPosts.length}`);
    console.log(`\n📝 Total Circles: ${darkCircles.length + climbCircles.length + philoCircles.length}`);
    console.log(`📝 Total Posts: ${darkPosts.length + climbPosts.length + philoPosts.length}`);
    console.log('═══════════════════════════════════════\n');

    console.log('✅ Database seeded successfully!\n');
    console.log('🎯 Test Accounts (password: TestPass123!):');
    console.log('   • testuser1');
    console.log('   • testuser2');
    console.log('   • testuser3');
    console.log('   • testuser4');
    console.log('   • testuser5\n');

    console.log('🎨 All circles now have room badges:');
    console.log('   🌑 Dark Room circles will show [DARK] badge');
    console.log('   🚀 Climb Room circles will show [CLIMB] badge');
    console.log('   🧘 Philo Room circles will show [PHILO] badge\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
}

// Run the seed
seedDatabase()
  .then(() => {
    console.log('\n🎉 Seed completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seed failed:', error);
    process.exit(1);
  });
