import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcrypt';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Import models
import User from '../src/models/User.model.js';
import Circle from '../src/models/Circle.model.js';
import Post from '../src/models/Post.model.js';

const MONGODB_URI = process.env.MONGODB_URI;

// Circle data with metadata
const circlesData = [
  // Dark Room Circles
  { name: 'Nightfall', description: 'A space for those navigating the darkness', visibility: 'public', categories: ['LOSS', 'SOLITUDE', 'GRIEF'], color: '#4a2c2a', icon: '🌙' },
  { name: 'Silent Tears', description: 'Where unspoken pain finds voice', visibility: 'public', categories: ['GRIEF', 'LOSS'], color: '#3d2d2d', icon: '💧' },
  { name: 'Solace', description: 'Finding peace in the storm', visibility: 'public', categories: ['HOPE', 'SOLITUDE'], color: '#2d3d3d', icon: '❄️' },
  { name: 'In the Shadows', description: 'For those who feel invisible', visibility: 'public', categories: ['LONELINESS', 'ANXIETY'], color: '#2a2a2a', icon: '👁️' },
  
  // Climb Room Circles
  { name: 'Tech', description: 'Technology & Innovation', visibility: 'public', categories: ['HOPE'], color: '#3d5a80', icon: '⚡' },
  { name: 'Mental Health', description: 'Supporting mental wellness', visibility: 'public', categories: ['HOPE', 'ANXIETY'], color: '#5a3d80', icon: '🧠' },
  { name: 'Wellness', description: 'Wellness & Self-Care', visibility: 'public', categories: ['HOPE'], color: '#5a803d', icon: '🌱' },
  { name: 'Data', description: 'Data & Analytics', visibility: 'public', categories: ['HOPE'], color: '#805a3d', icon: '📊' },
  
  // Philo Room Circles
  { name: 'Stoicism', description: 'Stoicism & Philosophy', visibility: 'public', categories: ['HOPE'], color: '#6b5e59', icon: '🏛️' },
  { name: 'Mindfulness', description: 'Present moment awareness', visibility: 'public', categories: ['HOPE'], color: '#5e6b59', icon: '🧘' },
  { name: 'Identity', description: 'Identity & Self', visibility: 'public', categories: ['SOLITUDE'], color: '#596b5e', icon: '🪞' },
  { name: 'Existential', description: 'Existential Thoughts', visibility: 'public', categories: ['SOLITUDE'], color: '#5e596b', icon: '🌌' }
];

// Dark Room posts
const darkRoomPosts = [
  {
    room: 'dark',
    content: `Sometimes the weight of everything feels unbearable. I wake up and the first thought is dread. Not fear of something specific, just... dread.

I keep going through the motions, but I feel like I'm watching myself from outside. Like none of it is real.`,
    category: 'ANXIETY',
    circles: ['Nightfall', 'Silent Tears', 'Solace'],
    reactions: { iFeelYou: 12, youreNotAlone: 8, breathe: 5, iHearYou: 3, sendingStrength: 2 }
  },
  {
    room: 'dark',
    title: 'The silence is deafening',
    content: `Everyone around me is talking, laughing, living. And I'm just... here. Present but absent. Smiling but empty.

I wonder if anyone notices. I wonder if anyone would care if they did.`,
    category: 'LONELINESS',
    circles: ['In the Shadows'],
    reactions: { iHearYou: 15, sendingStrength: 10, youreNotAlone: 7, breathe: 4 }
  },
  {
    room: 'dark',
    content: `The weight of my regrets is suffocating.

I don't know how to escape these thoughts.

It feels like I'm sinking in the dark.`,
    category: 'REGRET',
    circles: ['Nightfall', 'In the Shadows'],
    reactions: { iFeelYou: 8, breathe: 12, sendingStrength: 5 }
  }
];

// Climb Room posts
const climbRoomPosts = [
  {
    room: 'climb',
    title: 'Anonymous Mental Health Support Network',
    content: `What if we built a peer-to-peer support system where people could connect based on shared experiences, not identities?

The idea: Match people anonymously based on what they're going through. No profiles, no history, just presence and understanding.`,
    category: 'HOPE',
    climbState: 'forming',
    circles: ['Tech', 'Mental Health'],
    reactions: { push: 24, pull: 3, gear: 8, rocket: 0 }
  },
  {
    room: 'climb',
    title: 'Micro-journaling for Emotional Patterns',
    content: `A simple tool to track emotional states throughout the day. Not a diary, just quick check-ins.

Over time, it reveals patterns you didn't know existed. When do you feel worst? What triggers it? Data-driven self-awareness.`,
    category: 'HOPE',
    climbState: 'sharpening',
    circles: ['Wellness', 'Data'],
    reactions: { push: 18, pull: 5, gear: 12, rocket: 2 }
  },
  {
    room: 'climb',
    title: 'Community-Driven Mental Health Resources',
    content: `Create a curated database of mental health resources, rated and reviewed by the community.

No corporate sponsors. No ads. Just real people sharing what actually helped them.`,
    category: 'HOPE',
    climbState: 'expanding',
    circles: ['Mental Health', 'Tech'],
    reactions: { push: 32, pull: 2, gear: 15, rocket: 5 }
  }
];

// Philo Room posts
const philoRoomPosts = [
  {
    room: 'philo',
    title: 'On the nature of suffering',
    content: `Is suffering inherent to existence, or is it a construct of consciousness?

We spend so much energy trying to avoid pain, but what if pain is simply information? A signal, not a sentence.

Perhaps the suffering comes not from the pain itself, but from our resistance to it.`,
    category: 'SOLITUDE',
    circles: ['Stoicism', 'Mindfulness'],
    reactions: { lamp: 18, spark: 12, clap: 9 }
  },
  {
    room: 'philo',
    content: `I've been thinking about authenticity. We're told to "be ourselves," but which self?

The self that exists in solitude? The self that emerges in conversation? The self we wish we were?

Maybe authenticity isn't about finding a fixed self, but about being honest with the self that's present in each moment.`,
    category: 'SOLITUDE',
    circles: ['Identity', 'Existential'],
    reactions: { lamp: 24, spark: 15, clap: 11 }
  },
  {
    room: 'philo',
    title: 'The paradox of choice',
    content: `We live in an age of infinite options, yet we feel more trapped than ever.

Is freedom the ability to choose, or the wisdom to know what to choose? Or perhaps it's the courage to accept the consequences of our choices.`,
    category: 'HOPE',
    circles: ['Existential', 'Stoicism'],
    reactions: { lamp: 14, spark: 20, clap: 8 }
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('\nClearing existing data...');
    await User.deleteMany({});
    await Circle.deleteMany({});
    await Post.deleteMany({});
    console.log('Existing data cleared');

    // Create multiple test users
    console.log('\nCreating test users...');
    const hashedPassword = await bcrypt.hash('TestPass123!', 10);
    
    const users = [];
    const userConfigs = [
      { username: 'test_observer', age: 28, gender: 'prefer-not-to-say' },
      { username: 'user_alpha', age: 25, gender: 'female' },
      { username: 'user_beta', age: 32, gender: 'male' },
      { username: 'user_gamma', age: 29, gender: 'other' },
      { username: 'user_delta', age: 27, gender: 'prefer-not-to-say' }
    ];

    for (const config of userConfigs) {
      const user = await User.create({
        username: config.username,
        password: hashedPassword,
        age: config.age,
        gender: config.gender,
        lastActive: new Date(),
        isBanned: false
        // Stats will be initialized by gamification service when reactions are added
      });
      users.push(user);
      console.log(`  ✓ ${user.username}`);
    }
    
    const testUser = users[0]; // Main test user

    // Create circles
    console.log('\nCreating circles...');
    const circleMap = {};
    for (const circleData of circlesData) {
      const circle = await Circle.create({
        name: circleData.name,
        description: circleData.description,
        visibility: circleData.visibility,
        categories: circleData.categories,
        creatorId: testUser._id,
        memberCount: 1,
        postCount: 0
      });
      circleMap[circleData.name] = {
        _id: circle._id,
        name: circleData.name,
        color: circleData.color,
        icon: circleData.icon
      };
      console.log(`  ✓ ${circle.name}`);
    }

    // Helper function to create posts with reactions from other users
    const createPost = async (postData, authorIndex = 0) => {
      const circlesArray = postData.circles.map(circleName => ({
        circleId: circleMap[circleName]._id,
        name: circleMap[circleName].name,
        color: circleMap[circleName].color,
        icon: circleMap[circleName].icon
      }));

      const author = users[authorIndex];
      
      // Create user reactions array from other users (not the author)
      const userReactions = [];
      const reactionTypes = Object.keys(postData.reactions);
      
      // Distribute reactions among other users
      for (const reactionType of reactionTypes) {
        const count = postData.reactions[reactionType];
        for (let i = 0; i < count; i++) {
          // Pick a random user that's not the author
          const reactorIndex = (authorIndex + 1 + (i % (users.length - 1))) % users.length;
          if (reactorIndex !== authorIndex) {
            userReactions.push({
              userId: users[reactorIndex]._id,
              type: reactionType
            });
          }
        }
      }

      const post = await Post.create({
        room: postData.room,
        title: postData.title || null,
        content: postData.content,
        contentSanitized: postData.content,
        authorId: author._id,
        circleId: circlesArray[0].circleId,
        circles: circlesArray,
        category: postData.category,
        climbState: postData.climbState || 'forming',
        reactions: postData.reactions,
        userReactions: userReactions,
        commentCount: 0
      });

      // Update circle post counts
      for (const circleName of postData.circles) {
        await Circle.findByIdAndUpdate(circleMap[circleName]._id, {
          $inc: { postCount: 1 }
        });
      }

      return post;
    };

    // Create Dark Room posts (authored by testUser)
    console.log('\nCreating Dark Room posts...');
    for (const postData of darkRoomPosts) {
      await createPost(postData, 0); // testUser is author
      console.log(`  ✓ Dark Room post by ${testUser.username} (${postData.circles.join(', ')})`);
    }

    // Create Climb Room posts (authored by testUser)
    console.log('\nCreating Climb Room posts...');
    for (const postData of climbRoomPosts) {
      await createPost(postData, 0); // testUser is author
      console.log(`  ✓ Climb Room: ${postData.title} by ${testUser.username}`);
    }

    // Create Philo Room posts (authored by testUser)
    console.log('\nCreating Philo Room posts...');
    for (const postData of philoRoomPosts) {
      await createPost(postData, 0); // testUser is author
      console.log(`  ✓ Philo Room: ${postData.title || 'Untitled'} by ${testUser.username}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Accounts (all use password: TestPass123!):');
    users.forEach(user => {
      console.log(`  - ${user.username}`);
    });
    console.log(`\nCreated:`);
    console.log(`  - ${users.length} users`);
    console.log(`  - ${circlesData.length} circles`);
    console.log(`  - ${darkRoomPosts.length} Dark Room posts (with reactions from other users)`);
    console.log(`  - ${climbRoomPosts.length} Climb Room posts (with reactions from other users)`);
    console.log(`  - ${philoRoomPosts.length} Philo Room posts (with reactions from other users)`);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();
