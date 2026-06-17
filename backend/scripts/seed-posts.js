import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../src/models/User.model.js';
import Circle from '../src/models/Circle.model.js';
import Post from '../src/models/Post.model.js';
import { sanitizePostContent } from '../src/utils/sanitization.utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed data
const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Post.deleteMany({});
    await Circle.deleteMany({});
    await User.deleteMany({});

    console.log('Creating anonymous users...');
    const users = await User.insertMany([
      { 
        username: 'thevoid',
        age: null, 
        gender: 'prefer-not-to-say',
        tokenVersion: 0
      },
      { 
        username: 'echochamber',
        age: null, 
        gender: 'prefer-not-to-say',
        tokenVersion: 0
      },
      { 
        username: 'theabyss',
        age: null, 
        gender: 'prefer-not-to-say',
        tokenVersion: 0
      },
    ]);
    console.log(`Created ${users.length} users`);

    console.log('Creating circles...');
    const circles = await Circle.insertMany([
      {
        name: 'The Void',
        description: 'A space for those who feel empty inside',
        creatorId: users[0]._id,
        visibility: 'public',
        memberCount: 0,
        postCount: 0,
        categories: ['LOSS', 'SOLITUDE', 'REGRET', 'GRIEF']
      },
      {
        name: 'Echo Chamber',
        description: 'Where thoughts echo in the darkness',
        creatorId: users[1]._id,
        visibility: 'public',
        memberCount: 0,
        postCount: 0,
        categories: ['SOLITUDE', 'LONELINESS', 'ANXIETY']
      },
      {
        name: 'The Abyss',
        description: 'Stare into the abyss, and it stares back',
        creatorId: users[2]._id,
        visibility: 'public',
        memberCount: 0,
        postCount: 0,
        categories: ['REGRET', 'FEAR', 'GRIEF']
      },
    ]);
    console.log(`Created ${circles.length} circles`);

    console.log('Creating posts matching the image...');
    
    // Post 1 - LOSS category (3m ago)
    const post1Content = `I often find myself standing in the kitchen, staring at the empty chair where you used to sit. The silence in this house has become a physical weight, pressing against my chest every morning.

I haven't moved your favorite mug yet. It feels like if I do, the last fragment of your presence will finally evaporate into the cold air. Is it normal to keep the clocks stopped at the exact hour you left?`;
    
    const post1 = new Post({
      authorId: users[0]._id,
      circleId: circles[0]._id,
      category: 'LOSS',
      content: post1Content,
      contentSanitized: sanitizePostContent(post1Content),
      reactions: {
        iRelate: 0,
        youreNotAlone: 0,
        imListening: 0,
        theAbyss: 0
      },
      userReactions: [],
      commentCount: 0,
      isHidden: false,
      createdAt: new Date(Date.now() - 3 * 60 * 1000) // 3 minutes ago
    });
    await post1.save();

    // Post 2 - SOLITUDE category (43m ago)
    const post2Content = `I deleted every social app. I told everyone I was going on a "digital detox," but the truth is I just couldn't stand seeing the curated joy anymore. Now that I'm truly offline, the quiet is terrifying.

It's been six days and my phone hasn't made a single sound. I'm starting to realize I wasn't connected to anyone; I was just part of a noise machine.`;
    
    const post2 = new Post({
      authorId: users[1]._id,
      circleId: circles[1]._id,
      category: 'SOLITUDE',
      content: post2Content,
      contentSanitized: sanitizePostContent(post2Content),
      reactions: {
        iRelate: 0,
        youreNotAlone: 0,
        imListening: 0,
        theAbyss: 0
      },
      userReactions: [],
      commentCount: 0,
      isHidden: false,
      createdAt: new Date(Date.now() - 43 * 60 * 1000) // 43 minutes ago
    });
    await post2.save();

    // Post 3 - REGRET category (2h ago)
    const post3Content = `"I should have said something when I had the chance. Now, every 'hello' feels like a missed opportunity from three years ago."`;
    
    const post3 = new Post({
      authorId: users[2]._id,
      circleId: circles[2]._id,
      category: 'REGRET',
      content: post3Content,
      contentSanitized: sanitizePostContent(post3Content),
      reactions: {
        iRelate: 0,
        youreNotAlone: 0,
        imListening: 0,
        theAbyss: 0
      },
      userReactions: [],
      commentCount: 0,
      isHidden: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    });
    await post3.save();

    console.log('Created 3 posts successfully');

    // Update circle post counts
    await Circle.findByIdAndUpdate(circles[0]._id, { postCount: 1 });
    await Circle.findByIdAndUpdate(circles[1]._id, { postCount: 1 });
    await Circle.findByIdAndUpdate(circles[2]._id, { postCount: 1 });

    console.log('✅ Database seeded successfully!');
    console.log('\nSummary:');
    console.log(`- ${users.length} users created`);
    console.log(`- ${circles.length} circles created`);
    console.log('- 3 posts created matching the image');
    
    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
