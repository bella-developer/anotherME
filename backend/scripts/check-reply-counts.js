import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

// Import Comment model
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

async function checkReplyCounts() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!\n');

    // Get all circle comments (not post comments)
    const circleComments = await Comment.find({ 
      circleId: { $exists: true, $ne: null },
      postId: null 
    })
      .sort({ createdAt: 1 })
      .lean();

    console.log(`Found ${circleComments.length} circle comments\n`);

    // Display each comment with its reply count
    console.log('=== Circle Comments with Reply Counts ===\n');
    
    for (const comment of circleComments) {
      const preview = comment.content.substring(0, 30);
      const indent = '  '.repeat(comment.depth);
      
      console.log(`${indent}[Depth ${comment.depth}] "${preview}"`);
      console.log(`${indent}  ID: ${comment._id}`);
      console.log(`${indent}  Parent: ${comment.parentId || 'none (root)'}`);
      console.log(`${indent}  Reply Count: ${comment.replyCount}`);
      console.log('');
    }

    // Build hierarchy to verify counts
    console.log('=== Verification ===\n');
    
    const commentMap = new Map();
    circleComments.forEach(c => {
      commentMap.set(c._id.toString(), c);
    });

    // Function to count actual descendants
    function countDescendants(commentId) {
      let count = 0;
      for (const c of circleComments) {
        if (c.parentId && c.parentId.toString() === commentId) {
          count++;
          count += countDescendants(c._id.toString());
        }
      }
      return count;
    }

    // Verify each comment's count
    for (const comment of circleComments) {
      const actualCount = countDescendants(comment._id.toString());
      const storedCount = comment.replyCount;
      const match = actualCount === storedCount ? '✅' : '❌';
      const preview = comment.content.substring(0, 30);
      
      console.log(`${match} "${preview}"`);
      console.log(`   Stored: ${storedCount}, Actual: ${actualCount}`);
      
      if (actualCount !== storedCount) {
        console.log(`   ⚠️  MISMATCH! Should be ${actualCount}`);
      }
      console.log('');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkReplyCounts();
