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
    console.log('🌱 Seeding database with 2 TOPICS...\n');

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
        username: 'dusktraveler',
        ageRange: '25-34',
        gender: 'non-binary',
        stats: { darkXP: 200, darkLevel: 3, climbXP: 100, climbLevel: 2, philoXP: 150, philoLevel: 2 }
      },
      {
        username: 'moonlitpath',
        ageRange: '18-24',
        gender: 'female',
        stats: { darkXP: 350, darkLevel: 4, climbXP: 80, climbLevel: 1, philoXP: 200, philoLevel: 3 }
      },
      {
        username: 'quietstorm',
        ageRange: '35-44',
        gender: 'male',
        stats: { darkXP: 150, darkLevel: 2, climbXP: 300, climbLevel: 4, philoXP: 100, philoLevel: 2 }
      },
      {
        username: 'shadowseeker',
        ageRange: '25-34',
        gender: 'prefer-not-to-say',
        stats: { darkXP: 250, darkLevel: 3, climbXP: 150, climbLevel: 2, philoXP: 250, philoLevel: 3 }
      }
    ]);
    console.log(`✅ Created ${users.length} users\n`);

    console.log('⬢ Creating circle...');
    const circle = await Circle.create({
      name: 'Twilight Reflections',
      description: 'Where day meets night, we share our thoughts in the in-between.',
      creatorId: users[0]._id,
      visibility: 'public',
      memberCount: 4,
      postCount: 0,
      categories: ['LOSS', 'REGRET', 'HOPE', 'ANXIETY']
    });
    console.log(`✅ Created circle: ${circle.name}\n`);

    console.log('📝 Creating 2 topic posts...');
    const topic1 = await Post.create({
      authorId: users[0]._id,
      room: 'dark',
      circleId: circle._id,
      circles: [{ circleId: circle._id, name: circle.name, color: '#D97757', icon: '⬢' }],
      category: 'REGRET',
      title: null,
      content: 'I keep replaying that moment in my mind.\n\nThe words I should have said. The actions I should have taken.\n\nHow do you move forward when the past keeps pulling you back?',
      contentSanitized: 'I keep replaying that moment in my mind.\n\nThe words I should have said. The actions I should have taken.\n\nHow do you move forward when the past keeps pulling you back?',
      reactions: { iFeelYou: 18, notGood: 3, youreNotAlone: 22, sendingStrength: 10, push: 0, pull: 0, gear: 0, rocket: 0, lamp: 0, spark: 0, clap: 0, iRelate: 0, imListening: 0, theAbyss: 0 },
      userReactions: [],
      commentCount: 0,
      isHidden: false,
      isCircleTopic: true,
      circleTopicSetAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      circleTopicSetBy: users[0]._id
    });

    const topic2 = await Post.create({
      authorId: users[1]._id,
      room: 'dark',
      circleId: circle._id,
      circles: [{ circleId: circle._id, name: circle.name, color: '#D97757', icon: '⬢' }],
      category: 'HOPE',
      title: null,
      content: 'Today I saw a sunrise after weeks of darkness.\n\nIt wasn\'t a cure. It wasn\'t a solution. But it was something.\n\nMaybe that\'s enough for now.',
      contentSanitized: 'Today I saw a sunrise after weeks of darkness.\n\nIt wasn\'t a cure. It wasn\'t a solution. But it was something.\n\nMaybe that\'s enough for now.',
      reactions: { iFeelYou: 25, notGood: 0, youreNotAlone: 30, sendingStrength: 15, push: 0, pull: 0, gear: 0, rocket: 0, lamp: 0, spark: 0, clap: 0, iRelate: 0, imListening: 0, theAbyss: 0 },
      userReactions: [],
      commentCount: 0,
      isHidden: false,
      isCircleTopic: true,
      circleTopicSetAt: new Date(),
      circleTopicSetBy: users[1]._id
    });

    console.log('✅ Created 2 topic posts\n');

    circle.postCount = 2;
    await circle.save();

    console.log('💬 Creating comments for Topic 1 (Regret)...');
    const t1c1 = await Comment.create({
      circleId: circle._id,
      postId: topic1._id,
      authorId: users[1]._id,
      parentId: null,
      content: 'The weight of "what if" is crushing. I carry it every day.',
      contentSanitized: 'The weight of "what if" is crushing. I carry it every day.',
      depth: 0,
      reactions: { resonate: 10, echo: 0 },
      userReactions: [],
      replyCount: 2,
      isDeleted: false,
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000)
    });

    await Comment.create({
      circleId: circle._id,
      postId: topic1._id,
      authorId: users[2]._id,
      parentId: t1c1._id,
      content: 'I\'ve learned that we can\'t change the past, but we can change how we carry it.',
      contentSanitized: 'I\'ve learned that we can\'t change the past, but we can change how we carry it.',
      depth: 1,
      reactions: { resonate: 7, echo: 0 },
      userReactions: [],
      replyCount: 0,
      isDeleted: false,
      createdAt: new Date(Date.now() - 19 * 60 * 60 * 1000)
    });

    await Comment.create({
      circleId: circle._id,
      postId: topic1._id,
      authorId: users[0]._id,
      parentId: t1c1._id,
      content: 'Thank you. I needed to hear that.',
      contentSanitized: 'Thank you. I needed to hear that.',
      depth: 1,
      reactions: { resonate: 5, echo: 0 },
      userReactions: [],
      replyCount: 0,
      isDeleted: false,
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000)
    });

    await Comment.create({
      circleId: circle._id,
      postId: topic1._id,
      authorId: users[3]._id,
      parentId: null,
      content: 'Sometimes the hardest person to forgive is ourselves.',
      contentSanitized: 'Sometimes the hardest person to forgive is ourselves.',
      depth: 0,
      reactions: { resonate: 12, echo: 0 },
      userReactions: [],
      replyCount: 0,
      isDeleted: false,
      createdAt: new Date(Date.now() - 17 * 60 * 60 * 1000)
    });

    console.log('✅ Created 4 comments for Topic 1\n');

    console.log('💬 Creating comments for Topic 2 (Hope)...');
    await Comment.create({
      circleId: circle._id,
      postId: topic2._id,
      authorId: users[0]._id,
      parentId: null,
      content: 'This gives me hope. Thank you for sharing this moment.',
      contentSanitized: 'This gives me hope. Thank you for sharing this moment.',
      depth: 0,
      reactions: { resonate: 15, echo: 0 },
      userReactions: [],
      replyCount: 0,
      isDeleted: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    });

    await Comment.create({
      circleId: circle._id,
      postId: topic2._id,
      authorId: users[2]._id,
      parentId: null,
      content: 'Small victories matter. They add up, even when we can\'t see it.',
      contentSanitized: 'Small victories matter. They add up, even when we can\'t see it.',
      depth: 0,
      reactions: { resonate: 11, echo: 0 },
      userReactions: [],
      replyCount: 0,
      isDeleted: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
    });

    const t2c3 = await Comment.create({
      circleId: circle._id,
      postId: topic2._id,
      authorId: users[3]._id,
      parentId: null,
      content: 'I needed to read this today. Maybe tomorrow I\'ll see my own sunrise.',
      contentSanitized: 'I needed to read this today. Maybe tomorrow I\'ll see my own sunrise.',
      depth: 0,
      reactions: { resonate: 13, echo: 0 },
      userReactions: [],
      replyCount: 1,
      isDeleted: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000)
    });

    await Comment.create({
      circleId: circle._id,
      postId: topic2._id,
      authorId: users[1]._id,
      parentId: t2c3._id,
      content: 'I hope you do. And when you do, know that it\'s okay if it\'s just a glimpse.',
      contentSanitized: 'I hope you do. And when you do, know that it\'s okay if it\'s just a glimpse.',
      depth: 1,
      reactions: { resonate: 8, echo: 0 },
      userReactions: [],
      replyCount: 0,
      isDeleted: false,
      createdAt: new Date(Date.now() - 15 * 60 * 1000)
    });

    console.log('✅ Created 4 comments for Topic 2\n');

    topic1.commentCount = 4;
    topic2.commentCount = 4;
    await topic1.save();
    await topic2.save();

    console.log('📊 Seed Summary:');
    console.log('================');
    console.log(`Circle: ${circle.name}`);
    console.log(`Topics: 2`);
    console.log(`  - Topic 1 (Regret): 4 comments`);
    console.log(`  - Topic 2 (Hope): 4 comments`);
    console.log(`Total Comments: 8`);
    console.log('\n✅ Database seeded successfully!\n');
    console.log('🎯 Test: Visit the circle to see 2 TOPICS side by side\n');

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
