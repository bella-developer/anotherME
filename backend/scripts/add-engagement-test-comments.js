import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

// Import models
const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  circleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Circle' },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  content: { type: String, required: true },
  contentSanitized: { type: String, required: true },
  depth: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  reactions: {
    resonate: { type: Number, default: 0 },
    echo: { type: Number, default: 0 }
  },
  replyCount: { type: Number, default: 0 }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  age: { type: Number },
  gender: { type: String }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function addTestComments() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!\n');

    // Get Nightfall circle ID
    const nightfallCircleId = '6972243561df0327723e1798';
    
    // Get a test user
    const testUser = await User.findOne();
    if (!testUser) {
      console.log('No users found. Please create a user first.');
      process.exit(1);
    }

    console.log(`Using test user: ${testUser.username}\n`);

    // Create test comments with different engagement levels
    const testComments = [
      {
        content: 'Low engagement test (3 replies) - should have NO color',
        targetReplies: 3,
        description: 'No styling'
      },
      {
        content: 'Medium engagement test (5 replies) - should be AMBER/YELLOW',
        targetReplies: 5,
        description: 'Dim amber border and background'
      },
      {
        content: 'High engagement test (12 replies) - should be DIM GREEN',
        targetReplies: 12,
        description: 'Dim green border and background'
      },
      {
        content: 'Very high engagement test (18 replies) - should be DEEP GREEN with high contrast',
        targetReplies: 18,
        description: 'Deep green with stronger glow'
      }
    ];

    for (const testComment of testComments) {
      console.log(`Creating: "${testComment.content}"`);
      console.log(`Target replies: ${testComment.targetReplies}`);
      console.log(`Expected styling: ${testComment.description}\n`);

      // Create root comment
      const rootComment = new Comment({
        circleId: nightfallCircleId,
        postId: null,
        authorId: testUser._id,
        parentId: null,
        content: testComment.content,
        contentSanitized: testComment.content,
        depth: 0,
        isDeleted: false,
        replyCount: testComment.targetReplies
      });

      await rootComment.save();

      // Create the specified number of replies
      let currentParent = rootComment._id;
      for (let i = 0; i < testComment.targetReplies; i++) {
        const reply = new Comment({
          circleId: nightfallCircleId,
          postId: null,
          authorId: testUser._id,
          parentId: currentParent,
          content: `Reply ${i + 1} to test engagement levels`,
          contentSanitized: `Reply ${i + 1} to test engagement levels`,
          depth: i + 1,
          isDeleted: false,
          replyCount: 0
        });

        await reply.save();
        
        // For nested structure, make next reply a child of current
        // This creates a deep thread
        currentParent = reply._id;
      }

      console.log(`✅ Created comment with ${testComment.targetReplies} replies\n`);
    }

    console.log('=== Summary ===');
    console.log('Created 4 test comment threads in Nightfall circle:');
    console.log('1. 3 replies - No color (default)');
    console.log('2. 5 replies - Amber/yellow (medium engagement)');
    console.log('3. 12 replies - Dim green (high engagement)');
    console.log('4. 18 replies - Deep green with high contrast (very high engagement)');
    console.log('\nNavigate to the Nightfall circle to see the visual differences!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addTestComments();
