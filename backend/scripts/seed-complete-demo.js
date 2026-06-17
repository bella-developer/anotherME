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

/**
 * Complete Demo Seed Script
 * Creates posts in all rooms with circles attached
 * - Circle 1: 3 topics (Dark room)
 * - Circle 2: 2 topics (Dark room)
 * - Circle 3: 1 topic (Climb room)
 * Each topic has its own conversation
 */

async function seedDatabase() {
  try {
    console.log('🌱 Starting complete demo seed...\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🧹 Cleaning existing data...');
    await Comment.deleteMany({});
    await Post.deleteMany({});
    await Circle.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Database cleaned\n');

    // Create users
    console.log('👥 Creating users...');
    const users = await User.create([
      { username: 'shadowwalker', password: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', ageRange: '25-34', gender: 'prefer-not-to-say', stats: { darkXP: 150, darkLevel: 2, climbXP: 80, climbLevel: 1, philoXP: 200, philoLevel: 3 } },
      { username: 'quietstorm', password: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', ageRange: '18-24', gender: 'female', stats: { darkXP: 300, darkLevel: 4, climbXP: 50, climbLevel: 1, philoXP: 100, philoLevel: 2 } },
      { username: 'midnightseeker', password: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', ageRange: '35-44', gender: 'male', stats: { darkXP: 100, darkLevel: 2, climbXP: 250, climbLevel: 3, philoXP: 150, philoLevel: 2 } },
      { username: 'echointhevoid', password: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', ageRange: '25-34', gender: 'other', stats: { darkXP: 400, darkLevel: 5, climbXP: 120, climbLevel: 2, philoXP: 300, philoLevel: 4 } },
      { username: 'silentobserver', password: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', ageRange: '45-54', gender: 'prefer-not-to-say', stats: { darkXP: 200, darkLevel: 3, climbXP: 180, climbLevel: 2, philoXP: 250, philoLevel: 3 } },
      { username: 'dawnbreaker', password: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', ageRange: '25-34', gender: 'female', stats: { darkXP: 180, darkLevel: 2, climbXP: 300, climbLevel: 4, philoXP: 150, philoLevel: 2 } }
    ]);
    console.log(`✅ Created ${users.length} users\n`);

    // Create Circle 1 (3 topics)
    console.log('⬢ Creating Circle 1 (will have 3 topics)...');
    const circle1 = await Circle.create({
      name: 'Nightfall',
      description: 'A sanctuary for those who walk in shadows, seeking light in the darkness.',
      creatorId: users[0]._id,
      visibility: 'public',
      memberCount: 6,
      postCount: 0,
      categories: ['LOSS', 'SOLITUDE', 'REGRET', 'GRIEF', 'ANXIETY', 'LONELINESS']
    });
    console.log(`✅ Created: ${circle1.name}\n`);

    // Create Circle 2 (2 topics)
    console.log('⬢ Creating Circle 2 (will have 2 topics)...');
    const circle2 = await Circle.create({
      name: 'Twilight Reflections',
      description: 'Where day meets night, we share our thoughts in the in-between.',
      creatorId: users[1]._id,
      visibility: 'public',
      memberCount: 6,
      postCount: 0,
      categories: ['LOSS', 'REGRET', 'HOPE', 'ANXIETY']
    });
    console.log(`✅ Created: ${circle2.name}\n`);

    // Create Circle 3 (1 topic)
    console.log('⬢ Creating Circle 3 (will have 1 topic)...');
    const circle3 = await Circle.create({
      name: 'Summit Seekers',
      description: 'For those climbing out of the depths, one step at a time.',
      creatorId: users[2]._id,
      visibility: 'public',
      memberCount: 6,
      postCount: 0,
      categories: ['HOPE', 'ANXIETY']
    });
    console.log(`✅ Created: ${circle3.name}\n`);

    // ===== CIRCLE 1: 3 TOPICS (Dark Room) =====
    console.log('📝 Creating 3 topics for Circle 1 (Nightfall)...');
    
    const c1t1 = await Post.create({
      authorId: users[0]._id,
      room: 'dark',
      circleId: circle1._id,
      circles: [{ circleId: circle1._id, name: circle1.name, color: '#D97757', icon: '⬢' }],
      category: 'LOSS',
      content: 'The weight of my regrets is suffocating.\n\nI don\'t know how to escape these thoughts.\n\nIt feels like I\'m sinking in the dark.',
      contentSanitized: 'The weight of my regrets is suffocating.\n\nI don\'t know how to escape these thoughts.\n\nIt feels like I\'m sinking in the dark.',
      reactions: { iFeelYou: 8, notGood: 2, youreNotAlone: 12, sendingStrength: 5, push: 0, pull: 0, gear: 0, rocket: 0, lamp: 0, spark: 0, clap: 0, iRelate: 0, imListening: 0, theAbyss: 0 },
      userReactions: [],
      commentCount: 0,
      isHidden: false,
      isCircleTopic: true,
      circleTopicSetAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      circleTopicSetBy: users[0]._id
    });

    const c1t2 = await Post.create({
      authorId: users[1]._id,
      room: 'dark',
      circleId: circle1._id,
      circles: [{ circleId: circle1._id, name: circle1.name, color: '#D97757', icon: '⬢' }],
      category: 'SOLITUDE',
      content: 'The silence is deafening.\n\nEveryone around me is talking, laughing, living. And I\'m just... here.\n\nPresent but absent. Smiling but empty.',
      contentSanitized: 'The silence is deafening.\n\nEveryone around me is talking, laughing, living. And I\'m just... here.\n\nPresent but absent. Smiling but empty.',
      reactions: { iFeelYou: 15, notGood: 1, youreNotAlone: 18, sendingStrength: 7, push: 0, pull: 0, gear: 0, rocket: 0, lamp: 0, spark: 0, clap: 0, iRelate: 0, imListening: 0, theAbyss: 0 },
      userReactions: [],
      commentCount: 0,
      isHidden: false,
      isCircleTopic: true,
      circleTopicSetAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      circleTopicSetBy: users[1]._id
    });

    const c1t3 = await Post.create({
      authorId: users[2]._id,
      room: 'dark',
      circleId: circle1._id,
      circles: [{ circleId: circle1._id, name: circle1.name, color: '#D97757', icon: '⬢' }],
      category: 'ANXIETY',
      content: 'My mind won\'t stop racing.\n\nEvery small decision feels monumental. Every conversation replays endlessly.\n\nHow do you quiet the noise when it comes from within?',
      contentSanitized: 'My mind won\'t stop racing.\n\nEvery small decision feels monumental. Every conversation replays endlessly.\n\nHow do you quiet the noise when it comes from within?',
      reactions: { iFeelYou: 20, notGood: 3, youreNotAlone: 22, sendingStrength: 10, push: 0, pull: 0, gear: 0, rocket: 0, lamp: 0, spark: 0, clap: 0, iRelate: 0, imListening: 0, theAbyss: 0 },
      userReactions: [],
      commentCount: 0,
      isHidden: false,
      isCircleTopic: true,
      circleTopicSetAt: new Date(),
      circleTopicSetBy: users[2]._id
    });

    circle1.postCount = 3;
    await circle1.save();
    console.log('✅ Created 3 topics for Nightfall\n');

    // Comments for Circle 1 Topic 1
    console.log('💬 Adding comments to Circle 1 Topic 1...');
    await Comment.create([
      { circleId: circle1._id, postId: c1t1._id, authorId: users[1]._id, parentId: null, content: 'I feel this so deeply. The weight never seems to lift.', contentSanitized: 'I feel this so deeply. The weight never seems to lift.', depth: 0, reactions: { resonate: 5, echo: 0 }, userReactions: [], replyCount: 0, isDeleted: false, createdAt: new Date(Date.now() - 47 * 60 * 60 * 1000) },
      { circleId: circle1._id, postId: c1t1._id, authorId: users[3]._id, parentId: null, content: 'Sometimes acknowledging the weight is the first step.', contentSanitized: 'Sometimes acknowledging the weight is the first step.', depth: 0, reactions: { resonate: 3, echo: 0 }, userReactions: [], replyCount: 0, isDeleted: false, createdAt: new Date(Date.now() - 46 * 60 * 60 * 1000) }
    ]);
    c1t1.commentCount = 2;
    await c1t1.save();

    // Comments for Circle 1 Topic 2
    console.log('💬 Adding comments to Circle 1 Topic 2...');
    await Comment.create([
      { circleId: circle1._id, postId: c1t2._id, authorId: users[0]._id, parentId: null, content: 'The invisible loneliness. I know this feeling all too well.', contentSanitized: 'The invisible loneliness. I know this feeling all too well.', depth: 0, reactions: { resonate: 8, echo: 0 }, userReactions: [], replyCount: 0, isDeleted: false, createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000) },
      { circleId: circle1._id, postId: c1t2._id, authorId: users[3]._id, parentId: null, content: 'I see you. Your presence matters, even when it doesn\'t feel like it.', contentSanitized: 'I see you. Your presence matters, even when it doesn\'t feel like it.', depth: 0, reactions: { resonate: 10, echo: 0 }, userReactions: [], replyCount: 0, isDeleted: false, createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000) },
      { circleId: circle1._id, postId: c1t2._id, authorId: users[2]._id, parentId: null, content: 'Sometimes the mask we wear becomes so heavy.', contentSanitized: 'Sometimes the mask we wear becomes so heavy.', depth: 0, reactions: { resonate: 9, echo: 0 }, userReactions: [], replyCount: 0, isDeleted: false, createdAt: new Date(Date.now() - 21 * 60 * 60 * 1000) }
    ]);
    c1t2.commentCount = 3;
    await c1t2.save();

    // Comments for Circle 1 Topic 3
    console.log('💬 Adding comments to Circle 1 Topic 3...');
    await Comment.create([
      { circleId: circle1._id, postId: c1t3._id, authorId: users[1]._id, parentId: null, content: 'The mental replay button that never stops. I understand completely.', contentSanitized: 'The mental replay button that never stops. I understand completely.', depth: 0, reactions: { resonate: 12, echo: 0 }, userReactions: [], replyCount: 0, isDeleted: false, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
      { circleId: circle1._id, postId: c1t3._id, authorId: users[4]._id, parentId: null, content: 'Your mind is trying to protect you. Be gentle with yourself.', contentSanitized: 'Your mind is trying to protect you. Be gentle with yourself.', depth: 0, reactions: { resonate: 11, echo: 0 }, userReactions: [], replyCount: 0, isDeleted: false, createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) }
    ]);
    c1t3.commentCount = 2;
    await c1t3.save();

    // ===== CIRCLE 2: 2 TOPICS (Dark Room) =====
    console.log('📝 Creating 2 topics for Circle 2 (Twilight Reflections)...');
    
    const c2t1 = await Post.create({
      authorId: users[3]._id,
      room: 'dark',
      circleId: circle2._id,
      circles: [{ circleId: circle2._id, name: circle2.name, color: '#D97757', icon: '⬢' }],
      category: 'REGRET',
      content: 'I keep replaying that moment in my mind.\n\nThe words I should have said. The actions I should have taken.\n\nHow do you move forward when the past keeps pulling you back?',
      contentSanitized: 'I keep replaying that moment in my mind.\n\nThe words I should have said. The actions I should have taken.\n\nHow do you move forward when the past keeps pulling you back?',
      reactions: { iFeelYou: 18, notGood: 3, youreNotAlone: 22, sendingStrength: 10, push: 0, pull: 0, gear: 0, rocket: 0, lamp: 0, spark: 0, clap: 0, iRelate: 0, imListening: 0, theAbyss: 0 },
      userReactions: [],
      commentCount: 0,
      isHidden: false,
      isCircleTopic: true,
      circleTopicSetAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      circleTopicSetBy: users[3]._id
    });

    const c2t2 = await Post.create({
      authorId: users[4]._id,
      room: 'dark',
      circleId: circle2._id,
      circles: [{ circleId: circle2._id, name: circle2.name, color: '#D97757', icon: '⬢' }],
      category: 'HOPE',
      content: 'Today I saw a sunrise after weeks of darkness.\n\nIt wasn\'t a cure. It wasn\'t a solution. But it was something.\n\nMaybe that\'s enough for now.',
      contentSanitized: 'Today I saw a sunrise after weeks of darkness.\n\nIt wasn\'t a cure. It wasn\'t a solution. But it was something.\n\nMaybe that\'s enough for now.',
      reactions: { iFeelYou: 25, notGood: 0, youreNotAlone: 30, sendingStrength: 15, push: 0, pull: 0, gear: 0, rocket: 0, lamp: 0, spark: 0, clap: 0, iRelate: 0, imListening: 0, theAbyss: 0 },
      userReactions: [],
      commentCount: 0,
      isHidden: false,
      isCircleTopic: true,
      circleTopicSetAt: new Date(),
      circleTopicSetBy: users[4]._id
    });

    circle2.postCount = 2;
    await circle2.save();
    console.log('✅ Created 2 topics for Twilight Reflections\n');

    // Comments for Circle 2 Topic 1
    console.log('💬 Adding comments to Circle 2 Topic 1...');
    await Comment.create([
      { circleId: circle2._id, postId: c2t1._id, authorId: users[1]._id, parentId: null, content: 'The weight of "what if" is crushing. I carry it every day.', contentSanitized: 'The weight of "what if" is crushing. I carry it every day.', depth: 0, reactions: { resonate: 10, echo: 0 }, userReactions: [], replyCount: 0, isDeleted: false, createdAt: new Date(Date.now() - 11 * 60 * 60 * 1000) },
      { circleId: circle2._id, postId: c2t1._id, authorId: users[5]._id, parentId: null, content: 'Sometimes the hardest person to forgive is ourselves.', contentSanitized: 'Sometimes the hardest person to forgive is ourselves.', depth: 0, reactions: { resonate: 12, echo: 0 }, userReactions: [], replyCount: 0, isDeleted: false, createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000) }
    ]);
    c2t1.commentCount = 2;
    await c2t1.save();

    // Comments for Circle 2 Topic 2
    console.log('💬 Adding comments to Circle 2 Topic 2...');
    await Comment.create([
      { circleId: circle2._id, postId: c2t2._id, authorId: users[0]._id, parentId: null, content: 'This gives me hope. Thank you for sharing this moment.', contentSanitized: 'This gives me hope. Thank you for sharing this moment.', depth: 0, reactions: { resonate: 15, echo: 0 }, userReactions: [], replyCount: 0, isDeleted: false, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
      { circleId: circle2._id, postId: c2t2._id, authorId: users[2]._id, parentId: null, content: 'Small victories matter. They add up, even when we can\'t see it.', contentSanitized: 'Small victories matter. They add up, even when we can\'t see it.', depth: 0, reactions: { resonate: 11, echo: 0 }, userReactions: [], replyCount: 0, isDeleted: false, createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) },
      { circleId: circle2._id, postId: c2t2._id, authorId: users[3]._id, parentId: null, content: 'Maybe tomorrow I\'ll see my own sunrise.', contentSanitized: 'Maybe tomorrow I\'ll see my own sunrise.', depth: 0, reactions: { resonate: 13, echo: 0 }, userReactions: [], replyCount: 0, isDeleted: false, createdAt: new Date(Date.now() - 30 * 60 * 1000) }
    ]);
    c2t2.commentCount = 3;
    await c2t2.save();

    // ===== CIRCLE 3: 1 TOPIC (Climb Room) =====
    console.log('📝 Creating 1 topic for Circle 3 (Summit Seekers)...');
    
    const c3t1 = await Post.create({
      authorId: users[5]._id,
      room: 'climb',
      circleId: circle3._id,
      circles: [{ circleId: circle3._id, name: circle3.name, color: '#D97757', icon: '⬢' }],
      category: 'HOPE',
      title: 'Building a Morning Routine',
      content: 'I want to start my days better. Wake up earlier, exercise, meditate.\n\nI know it won\'t fix everything, but maybe it\'s a start.\n\nWho else is working on their mornings?',
      contentSanitized: 'I want to start my days better. Wake up earlier, exercise, meditate.\n\nI know it won\'t fix everything, but maybe it\'s a start.\n\nWho else is working on their mornings?',
      climbState: 'forming',
      reactions: { iFeelYou: 0, notGood: 0, youreNotAlone: 0, sendingStrength: 0, push: 12, pull: 3, gear: 8, rocket: 5, lamp: 0, spark: 0, clap: 0, iRelate: 0, imListening: 0, theAbyss: 0 },
      userReactions: [],
      commentCount: 0,
      isHidden: false,
      isCircleTopic: true,
      circleTopicSetAt: new Date(),
      circleTopicSetBy: users[5]._id
    });

    circle3.postCount = 1;
    await circle3.save();
    console.log('✅ Created 1 topic for Summit Seekers\n');

    // Comments for Circle 3 Topic 1
    console.log('💬 Adding comments to Circle 3 Topic 1...');
    await Comment.create([
      { circleId: circle3._id, postId: c3t1._id, authorId: users[2]._id, parentId: null, content: 'I\'ve been trying this for a month. Start small - even 5 minutes helps.', contentSanitized: 'I\'ve been trying this for a month. Start small - even 5 minutes helps.', depth: 0, reactions: { resonate: 8, echo: 0 }, userReactions: [], replyCount: 0, isDeleted: false, createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) },
      { circleId: circle3._id, postId: c3t1._id, authorId: users[1]._id, parentId: null, content: 'The hardest part is just getting out of bed. But you\'ve got this.', contentSanitized: 'The hardest part is just getting out of bed. But you\'ve got this.', depth: 0, reactions: { resonate: 10, echo: 0 }, userReactions: [], replyCount: 0, isDeleted: false, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
      { circleId: circle3._id, postId: c3t1._id, authorId: users[4]._id, parentId: null, content: 'I\'m in. Let\'s climb together.', contentSanitized: 'I\'m in. Let\'s climb together.', depth: 0, reactions: { resonate: 12, echo: 0 }, userReactions: [], replyCount: 0, isDeleted: false, createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) }
    ]);
    c3t1.commentCount = 3;
    await c3t1.save();

    console.log('📊 Seed Summary:');
    console.log('================');
    console.log(`Users: ${users.length}`);
    console.log(`Circles: 3`);
    console.log(`\nCircle 1 (Nightfall): 3 topics, 7 comments`);
    console.log(`Circle 2 (Twilight Reflections): 2 topics, 5 comments`);
    console.log(`Circle 3 (Summit Seekers): 1 topic, 3 comments`);
    console.log(`\nTotal Posts: 6`);
    console.log(`Total Comments: 15\n`);

    console.log('✅ Database seeded successfully!\n');
    console.log('🎯 Test the layouts:');
    console.log('   1. Nightfall → See 3 topics in grid');
    console.log('   2. Twilight Reflections → See 2 topics side by side');
    console.log('   3. Summit Seekers → See 1 topic full width\n');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

seedDatabase()
  .then(() => {
    console.log('\n🎉 Seed completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seed failed:', error);
    process.exit(1);
  });
