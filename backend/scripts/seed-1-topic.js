import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

import User from '../src/models/User.model.js';
import Circle from '../src/models/Circle.model.js';
import Post from '../src/models/Post.model.js';
import Comment from '../src/models/Comment.model.js';

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with 1 TOPIC...\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🧹 Cleaning existing data...');
    await Comment.deleteMany({});
    await Post.deleteMany({});
    await Circle.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Database cleaned\n');

    console.log('👥 Creating users...');
    const users = await User.create([
      {
        username: 'lonewanderer',
        ageRange: '25-34',
        gender: 'prefer-not-to-say',
        stats: { darkXP: 150, darkLevel: 2, climbXP: 80, climbLevel: 1, philoXP: 200, philoLevel: 3 }
      },
      {
        username: 'whisperindark',
        ageRange: '18-24',
        gender: 'female',
        stats: { darkXP: 300, darkLevel: 4, climbXP: 50, climbLevel: 1, philoXP: 100, philoLevel: 2 }
      },
      {
        username: 'silentwatcher',
        ageRange: '35-44',
        gender: 'male',
        stats: { darkXP: 100, darkLevel: 2, climbXP: 250, climbLevel: 3, philoXP: 150, philoLevel: 2 }
      }
    ]);
    console.log(`✅ Created ${users.length} users\n`);

    console.log('⬢ Creating circle...');
    const circle = await Circle.create({
      name: 'Solitude Haven',
      description: 'A quiet space for those seeking solace in their solitude.',
      creatorId: users[0]._id,
      visibility: 'public',
      memberCount: 3,
      postCount: 0,
      categories: ['SOLITUDE', 'LONELINESS', 'GRIEF']
    });
    console.log(`✅ Created circle: ${circle.name}\n`);

    console.log('📝 Creating 1 topic post...');
    const topic1 = await Post.create({
      authorId: users[0]._id,
      room: 'dark',
      circleId: circle._id,
      circles: [{ circleId: circle._id, name: circle.name, color: '#D97757', icon: '⬢' }],
      category: 'SOLITUDE',
      title: null,
      content: 'Sometimes the loneliest place is a crowded room.\n\nI smile, I nod, I engage. But inside, I\'m miles away.\n\nDoes anyone else feel this disconnect?',
      contentSanitized: 'Sometimes the loneliest place is a crowded room.\n\nI smile, I nod, I engage. But inside, I\'m miles away.\n\nDoes anyone else feel this disconnect?',
      reactions: { iFeelYou: 15, notGood: 2, youreNotAlone: 20, sendingStrength: 8, push: 0, pull: 0, gear: 0, rocket: 0, lamp: 0, spark: 0, clap: 0, iRelate: 0, imListening: 0, theAbyss: 0 },
      userReactions: [],
      commentCount: 0,
      isHidden: false,
      isCircleTopic: true,
      circleTopicSetAt: new Date(),
      circleTopicSetBy: users[0]._id
    });
    console.log('✅ Created 1 topic post\n');

    circle.postCount = 1;
    await circle.save();

    console.log('💬 Creating comments for the topic...');
    const c1 = await Comment.create({
      circleId: circle._id,
      postId: topic1._id,
      authorId: users[1]._id,
      parentId: null,
      content: 'I understand this feeling completely. The invisible wall between you and everyone else.',
      contentSanitized: 'I understand this feeling completely. The invisible wall between you and everyone else.',
      depth: 0,
      reactions: { resonate: 8, echo: 0 },
      userReactions: [],
      replyCount: 1,
      isDeleted: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    });

    await Comment.create({
      circleId: circle._id,
      postId: topic1._id,
      authorId: users[0]._id,
      parentId: c1._id,
      content: 'Yes, exactly. It\'s exhausting to maintain the facade.',
      contentSanitized: 'Yes, exactly. It\'s exhausting to maintain the facade.',
      depth: 1,
      reactions: { resonate: 5, echo: 0 },
      userReactions: [],
      replyCount: 0,
      isDeleted: false,
      createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
    });

    await Comment.create({
      circleId: circle._id,
      postId: topic1._id,
      authorId: users[2]._id,
      parentId: null,
      content: 'You\'re not alone in feeling alone. That\'s the paradox of it all.',
      contentSanitized: 'You\'re not alone in feeling alone. That\'s the paradox of it all.',
      depth: 0,
      reactions: { resonate: 10, echo: 0 },
      userReactions: [],
      replyCount: 0,
      isDeleted: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
    });

    await Comment.create({
      circleId: circle._id,
      postId: topic1._id,
      authorId: users[1]._id,
      parentId: null,
      content: 'Sometimes I wonder if removing the mask would make things better or worse.',
      contentSanitized: 'Sometimes I wonder if removing the mask would make things better or worse.',
      depth: 0,
      reactions: { resonate: 7, echo: 0 },
      userReactions: [],
      replyCount: 0,
      isDeleted: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000)
    });

    console.log('✅ Created 4 comments\n');

    topic1.commentCount = 4;
    await topic1.save();

    console.log('📊 Seed Summary:');
    console.log('================');
    console.log(`Circle: ${circle.name}`);
    console.log(`Topics: 1`);
    console.log(`Comments: 4`);
    console.log('\n✅ Database seeded successfully!\n');
    console.log('🎯 Test: Visit the circle to see 1 TOPIC in full width\n');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

seedDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
