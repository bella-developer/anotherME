import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

// Import models
import User from '../src/models/User.model.js';
import Circle from '../src/models/Circle.model.js';
import Post from '../src/models/Post.model.js';
import Comment from '../src/models/Comment.model.js';

/**
 * Seed script for multi-topic circle with conversations
 * Creates:
 * - 5 users
 * - 1 circle with 3 topic posts
 * - Topic-specific comments under each topic
 */

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clean database
    console.log('🧹 Cleaning existing data...');
    await Comment.deleteMany({});
    await Post.deleteMany({});
    await Circle.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Database cleaned\n');

    // Create users
    console.log('👥 Creating users...');
    const users = await User.create([
      {
        username: 'shadowwalker',
        ageRange: '25-34',
        gender: 'prefer-not-to-say',
        stats: {
          darkXP: 150,
          darkLevel: 2,
          climbXP: 80,
          climbLevel: 1,
          philoXP: 200,
          philoLevel: 3
        }
      },
      {
        username: 'quietstorm',
        ageRange: '18-24',
        gender: 'female',
        stats: {
          darkXP: 300,
          darkLevel: 4,
          climbXP: 50,
          climbLevel: 1,
          philoXP: 100,
          philoLevel: 2
        }
      },
      {
        username: 'midnightseeker',
        ageRange: '35-44',
        gender: 'male',
        stats: {
          darkXP: 100,
          darkLevel: 2,
          climbXP: 250,
          climbLevel: 3,
          philoXP: 150,
          philoLevel: 2
        }
      },
      {
        username: 'echointhevoid',
        ageRange: '25-34',
        gender: 'non-binary',
        stats: {
          darkXP: 400,
          darkLevel: 5,
          climbXP: 120,
          climbLevel: 2,
          philoXP: 300,
          philoLevel: 4
        }
      },
      {
        username: 'silentobserver',
        ageRange: '45-54',
        gender: 'prefer-not-to-say',
        stats: {
          darkXP: 200,
          darkLevel: 3,
          climbXP: 180,
          climbLevel: 2,
          philoXP: 250,
          philoLevel: 3
        }
      }
    ]);
    console.log(`✅ Created ${users.length} users\n`);

    // Create circle
    console.log('⬢ Creating circle...');
    const circle = await Circle.create({
      name: 'Nightfall',
      description: 'A sanctuary for those who walk in shadows, seeking light in the darkness of their thoughts.',
      creatorId: users[0]._id,
      visibility: 'public',
      memberCount: 5,
      postCount: 0,
      categories: ['LOSS', 'SOLITUDE', 'REGRET', 'GRIEF', 'ANXIETY', 'LONELINESS']
    });
    console.log(`✅ Created circle: ${circle.name}\n`);

    // Create 3 topic posts
    console.log('📝 Creating topic posts...');
    
    const topic1 = await Post.create({
      authorId: users[0]._id,
      room: 'dark',
      circleId: circle._id,
      circles: [{
        circleId: circle._id,
        name: circle.name,
        color: '#D97757',
        icon: '⬢'
      }],
      category: 'LOSS',
      title: null,
      content: 'The weight of my regrets is suffocating.\n\nI don\'t know how to escape these thoughts.\n\nIt feels like I\'m sinking in the dark.',
      contentSanitized: 'The weight of my regrets is suffocating.\n\nI don\'t know how to escape these thoughts.\n\nIt feels like I\'m sinking in the dark.',
      reactions: {
        iFeelYou: 8,
        notGood: 2,
        youreNotAlone: 12,
        sendingStrength: 5,
        push: 0, pull: 0, gear: 0, rocket: 0,
        lamp: 0, spark: 0, clap: 0,
        iRelate: 0, imListening: 0, theAbyss: 0
      },
      userReactions: [],
      commentCount: 0,
      isHidden: false,
      isCircleTopic: true,
      circleTopicSetAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      circleTopicSetBy: users[0]._id
    });

    const topic2 = await Post.create({
      authorId: users[1]._id,
      room: 'dark',
      circleId: circle._id,
      circles: [{
        circleId: circle._id,
        name: circle.name,
        color: '#D97757',
        icon: '⬢'
      }],
      category: 'SOLITUDE',
      title: null,
      content: 'The silence is deafening.\n\nEveryone around me is talking, laughing, living. And I\'m just... here. Present but absent. Smiling but empty.\n\nI wonder if anyone notices. I wonder if anyone would care if they did.',
      contentSanitized: 'The silence is deafening.\n\nEveryone around me is talking, laughing, living. And I\'m just... here. Present but absent. Smiling but empty.\n\nI wonder if anyone notices. I wonder if anyone would care if they did.',
      reactions: {
        iFeelYou: 15,
        notGood: 1,
        youreNotAlone: 18,
        sendingStrength: 7,
        push: 0, pull: 0, gear: 0, rocket: 0,
        lamp: 0, spark: 0, clap: 0,
        iRelate: 0, imListening: 0, theAbyss: 0
      },
      userReactions: [],
      commentCount: 0,
      isHidden: false,
      isCircleTopic: true,
      circleTopicSetAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      circleTopicSetBy: users[1]._id
    });

    const topic3 = await Post.create({
      authorId: users[2]._id,
      room: 'dark',
      circleId: circle._id,
      circles: [{
        circleId: circle._id,
        name: circle.name,
        color: '#D97757',
        icon: '⬢'
      }],
      category: 'ANXIETY',
      title: null,
      content: 'My mind won\'t stop racing.\n\nEvery small decision feels monumental. Every conversation replays endlessly. Every mistake magnified a thousand times.\n\nHow do you quiet the noise when it comes from within?',
      contentSanitized: 'My mind won\'t stop racing.\n\nEvery small decision feels monumental. Every conversation replays endlessly. Every mistake magnified a thousand times.\n\nHow do you quiet the noise when it comes from within?',
      reactions: {
        iFeelYou: 20,
        notGood: 3,
        youreNotAlone: 22,
        sendingStrength: 10,
        push: 0, pull: 0, gear: 0, rocket: 0,
        lamp: 0, spark: 0, clap: 0,
        iRelate: 0, imListening: 0, theAbyss: 0
      },
      userReactions: [],
      commentCount: 0,
      isHidden: false,
      isCircleTopic: true,
      circleTopicSetAt: new Date(), // Just now
      circleTopicSetBy: users[2]._id
    });

    console.log(`✅ Created 3 topic posts\n`);

    // Update circle post count
    circle.postCount = 3;
    await circle.save();

    // Create comments for Topic 1 (Regrets)
    console.log('💬 Creating comments for Topic 1 (Regrets)...');
    
    const t1c1 = await Comment.create({
      circleId: circle._id,
      postId: topic1._id,
      authorId: users[1]._id,
      parentId: null,
      content: 'I feel this so deeply. The weight never seems to lift, does it?',
      contentSanitized: 'I feel this so deeply. The weight never seems to lift, does it?',
      depth: 0,
      reactions: { resonate: 5, echo: 0 },
      userReactions: [],
      replyCount: 2,
      isDeleted: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000)
    });

    await Comment.create({
      circleId: circle._id,
      postId: topic1._id,
      authorId: users[3]._id,
      parentId: t1c1._id,
      content: 'Sometimes acknowledging the weight is the first step. You\'re not alone in this.',
      contentSanitized: 'Sometimes acknowledging the weight is the first step. You\'re not alone in this.',
      depth: 1,
      reactions: { resonate: 3, echo: 0 },
      userReactions: [],
      replyCount: 0,
      isDeleted: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)
    });

    await Comment.create({
      circleId: circle._id,
      postId: topic1._id,
      authorId: users[0]._id,
      parentId: t1c1._id,
      content: 'Thank you. It helps to know others understand.',
      contentSanitized: 'Thank you. It helps to know others understand.',
      depth: 1,
      reactions: { resonate: 2, echo: 0 },
      userReactions: [],
      replyCount: 0,
      isDeleted: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000)
    });

    const t1c2 = await Comment.create({
      circleId: circle._id,
      postId: topic1._id,
      authorId: users[4]._id,
      parentId: null,
      content: 'I\'ve been there. The darkness feels endless, but there are moments of light. Hold on to those.',
      contentSanitized: 'I\'ve been there. The darkness feels endless, but there are moments of light. Hold on to those.',
      depth: 0,
      reactions: { resonate: 7, echo: 0 },
      userReactions: [],
      replyCount: 1,
      isDeleted: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000)
    });

    await Comment.create({
      circleId: circle._id,
      postId: topic1._id,
      authorId: users[2]._id,
      parentId: t1c2._id,
      content: 'This resonates. The small moments of peace are what keep me going.',
      contentSanitized: 'This resonates. The small moments of peace are what keep me going.',
      depth: 1,
      reactions: { resonate: 4, echo: 0 },
      userReactions: [],
      replyCount: 0,
      isDeleted: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000)
    });

    console.log('✅ Created 5 comments for Topic 1\n');

    // Create comments for Topic 2 (Silence)
    console.log('💬 Creating comments for Topic 2 (Silence)...');

    const t2c1 = await Comment.create({
      circleId: circle._id,
      postId: topic2._id,
      authorId: users[0]._id,
      parentId: null,
      content: 'The invisible loneliness. I know this feeling all too well.',
      contentSanitized: 'The invisible loneliness. I know this feeling all too well.',
      depth: 0,
      reactions: { resonate: 8, echo: 0 },
      userReactions: [],
      replyCount: 1,
      isDeleted: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000)
    });

    await Comment.create({
      circleId: circle._id,
      postId: topic2._id,
      authorId: users[1]._id,
      parentId: t2c1._id,
      content: 'It\'s the worst kind of loneliness - being surrounded by people but feeling completely alone.',
      contentSanitized: 'It\'s the worst kind of loneliness - being surrounded by people but feeling completely alone.',
      depth: 1,
      reactions: { resonate: 6, echo: 0 },
      userReactions: [],
      replyCount: 0,
      isDeleted: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)
    });

    const t2c2 = await Comment.create({
      circleId: circle._id,
      postId: topic2._id,
      authorId: users[3]._id,
      parentId: null,
      content: 'I see you. Your presence matters, even when it doesn\'t feel like it.',
      contentSanitized: 'I see you. Your presence matters, even when it doesn\'t feel like it.',
      depth: 0,
      reactions: { resonate: 10, echo: 0 },
      userReactions: [],
      replyCount: 2,
      isDeleted: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000)
    });

    await Comment.create({
      circleId: circle._id,
      postId: topic2._id,
      authorId: users[1]._id,
      parentId: t2c2._id,
      content: 'Thank you for this. Sometimes we just need to be seen.',
      contentSanitized: 'Thank you for this. Sometimes we just need to be seen.',
      depth: 1,
      reactions: { resonate: 5, echo: 0 },
      userReactions: [],
      replyCount: 0,
      isDeleted: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000)
    });

    await Comment.create({
      circleId: circle._id,
      postId: topic2._id,
      authorId: users[4]._id,
      parentId: t2c2._id,
      content: 'This is beautiful. We all need reminders that we matter.',
      contentSanitized: 'This is beautiful. We all need reminders that we matter.',
      depth: 1,
      reactions: { resonate: 4, echo: 0 },
      userReactions: [],
      replyCount: 0,
      isDeleted: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000)
    });

    await Comment.create({
      circleId: circle._id,
      postId: topic2._id,
      authorId: users[2]._id,
      parentId: null,
      content: 'Sometimes the mask we wear becomes so heavy. But here, we can take it off.',
      contentSanitized: 'Sometimes the mask we wear becomes so heavy. But here, we can take it off.',
      depth: 0,
      reactions: { resonate: 9, echo: 0 },
      userReactions: [],
      replyCount: 0,
      isDeleted: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000)
    });

    console.log('✅ Created 6 comments for Topic 2\n');

    // Create comments for Topic 3 (Racing Mind)
    console.log('💬 Creating comments for Topic 3 (Racing Mind)...');

    const t3c1 = await Comment.create({
      circleId: circle._id,
      postId: topic3._id,
      authorId: users[1]._id,
      parentId: null,
      content: 'The mental replay button that never stops. I understand this completely.',
      contentSanitized: 'The mental replay button that never stops. I understand this completely.',
      depth: 0,
      reactions: { resonate: 12, echo: 0 },
      userReactions: [],
      replyCount: 3,
      isDeleted: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    });

    await Comment.create({
      circleId: circle._id,
      postId: topic3._id,
      authorId: users[2]._id,
      parentId: t3c1._id,
      content: 'It\'s exhausting, isn\'t it? The constant analysis of everything.',
      contentSanitized: 'It\'s exhausting, isn\'t it? The constant analysis of everything.',
      depth: 1,
      reactions: { resonate: 7, echo: 0 },
      userReactions: [],
      replyCount: 0,
      isDeleted: false,
      createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
    });

    await Comment.create({
      circleId: circle._id,
      postId: topic3._id,
      authorId: users[0]._id,
      parentId: t3c1._id,
      content: 'I\'ve found that writing it down sometimes helps. Getting it out of my head and onto paper.',
      contentSanitized: 'I\'ve found that writing it down sometimes helps. Getting it out of my head and onto paper.',
      depth: 1,
      reactions: { resonate: 8, echo: 0 },
      userReactions: [],
      replyCount: 0,
      isDeleted: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
    });

    await Comment.create({
      circleId: circle._id,
      postId: topic3._id,
      authorId: users[3]._id,
      parentId: t3c1._id,
      content: 'Same here. The overthinking spiral is real.',
      contentSanitized: 'Same here. The overthinking spiral is real.',
      depth: 1,
      reactions: { resonate: 6, echo: 0 },
      userReactions: [],
      replyCount: 0,
      isDeleted: false,
      createdAt: new Date(Date.now() - 45 * 60 * 1000)
    });

    await Comment.create({
      circleId: circle._id,
      postId: topic3._id,
      authorId: users[4]._id,
      parentId: null,
      content: 'Your mind is trying to protect you, even if it doesn\'t feel like it. Be gentle with yourself.',
      contentSanitized: 'Your mind is trying to protect you, even if it doesn\'t feel like it. Be gentle with yourself.',
      depth: 0,
      reactions: { resonate: 11, echo: 0 },
      userReactions: [],
      replyCount: 1,
      isDeleted: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000)
    });

    await Comment.create({
      circleId: circle._id,
      postId: topic3._id,
      authorId: users[2]._id,
      parentId: null,
      content: 'I needed to read this today. Thank you for sharing.',
      contentSanitized: 'I needed to read this today. Thank you for sharing.',
      depth: 0,
      reactions: { resonate: 5, echo: 0 },
      userReactions: [],
      replyCount: 0,
      isDeleted: false,
      createdAt: new Date(Date.now() - 15 * 60 * 1000)
    });

    console.log('✅ Created 6 comments for Topic 3\n');

    // Update comment counts on posts
    topic1.commentCount = 5;
    topic2.commentCount = 6;
    topic3.commentCount = 6;
    await topic1.save();
    await topic2.save();
    await topic3.save();

    // Summary
    console.log('📊 Seed Summary:');
    console.log('================');
    console.log(`Users: ${users.length}`);
    console.log(`Circles: 1`);
    console.log(`Topic Posts: 3`);
    console.log(`  - Topic 1 (Regrets): 5 comments`);
    console.log(`  - Topic 2 (Silence): 6 comments`);
    console.log(`  - Topic 3 (Racing Mind): 6 comments`);
    console.log(`Total Comments: 17\n`);

    console.log('✅ Database seeded successfully!\n');
    console.log('🎯 Test the multi-topic system:');
    console.log('   1. Visit the Nightfall circle');
    console.log('   2. See 3 topics in the navbar');
    console.log('   3. Click each topic to see different conversations');
    console.log('   4. Verify comments are isolated per topic\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
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
