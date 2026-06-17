import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

// Import models
const circleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  topicPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  memberCount: { type: Number, default: 0 },
  postCount: { type: Number, default: 0 },
  categories: [{ type: String }]
}, { timestamps: true });

const Circle = mongoose.model('Circle', circleSchema);

const postSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: String, required: true },
  title: { type: String },
  content: { type: String, required: true },
  contentSanitized: { type: String, required: true },
  category: { type: String, required: true },
  circles: [{
    circleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Circle' },
    name: { type: String },
    color: { type: String },
    icon: { type: String }
  }],
  reactions: {
    resonate: { type: Number, default: 0 },
    echo: { type: Number, default: 0 },
    amplify: { type: Number, default: 0 }
  },
  commentCount: { type: Number, default: 0 },
  isHidden: { type: Boolean, default: false }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

async function setNightfallTopic() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!\n');

    // Get Nightfall circle
    const nightfallCircleId = '6972243561df0327723e1798';
    const circle = await Circle.findById(nightfallCircleId);
    
    if (!circle) {
      console.log('Nightfall circle not found!');
      process.exit(1);
    }

    console.log(`Found circle: ${circle.name}`);
    console.log(`Current topic post: ${circle.topicPostId || 'None'}\n`);

    // Find a post that belongs to this circle
    const post = await Post.findOne({
      'circles.circleId': nightfallCircleId,
      isHidden: false
    }).sort({ createdAt: -1 });

    if (!post) {
      console.log('No posts found for Nightfall circle. Creating a topic post...\n');
      
      // Get a user to create the post
      const User = mongoose.model('User');
      const user = await User.findOne();
      
      if (!user) {
        console.log('No users found. Please create a user first.');
        process.exit(1);
      }

      // Create a topic post
      const topicPost = new Post({
        authorId: user._id,
        room: 'dark',
        title: 'Welcome to the Nightfall Circle',
        content: 'This is a space for those navigating the darkness. Share your thoughts, experiences, and reflections in this safe space. What brings you here tonight?',
        contentSanitized: 'This is a space for those navigating the darkness. Share your thoughts, experiences, and reflections in this safe space. What brings you here tonight?',
        category: 'reflection',
        circles: [{
          circleId: nightfallCircleId,
          name: 'Nightfall',
          color: '#8B7AA3',
          icon: '🌙'
        }],
        reactions: {
          resonate: 0,
          echo: 0,
          amplify: 0
        },
        commentCount: 0,
        isHidden: false
      });

      await topicPost.save();
      console.log(`✅ Created topic post: "${topicPost.title}"`);
      console.log(`Post ID: ${topicPost._id}\n`);

      // Set as topic
      circle.topicPostId = topicPost._id;
      await circle.save();
      
      console.log(`✅ Set as topic for ${circle.name} circle`);
    } else {
      console.log(`Found existing post: "${post.title || post.content.substring(0, 50)}"`);
      console.log(`Post ID: ${post._id}\n`);

      // Set as topic
      circle.topicPostId = post._id;
      await circle.save();
      
      console.log(`✅ Set as topic for ${circle.name} circle`);
    }

    console.log('\nDone! The Nightfall circle now has a topic post.');
    console.log('Refresh the circle page to see it.');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setNightfallTopic();
