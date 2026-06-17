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

async function fixReplyCounts() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    // Get all comments
    const allComments = await Comment.find({}).lean();
    console.log(`Found ${allComments.length} comments`);

    // Build a map of comment ID to its children
    const childrenMap = new Map();
    allComments.forEach(comment => {
      if (comment.parentId) {
        const parentId = comment.parentId.toString();
        if (!childrenMap.has(parentId)) {
          childrenMap.set(parentId, []);
        }
        childrenMap.get(parentId).push(comment._id.toString());
      }
    });

    // Function to count all descendants recursively
    function countDescendants(commentId) {
      const children = childrenMap.get(commentId) || [];
      let count = children.length;
      
      // Add counts from all descendants
      children.forEach(childId => {
        count += countDescendants(childId);
      });
      
      return count;
    }

    // Update each comment's reply count
    let updated = 0;
    for (const comment of allComments) {
      const commentId = comment._id.toString();
      const correctCount = countDescendants(commentId);
      
      if (comment.replyCount !== correctCount) {
        await Comment.findByIdAndUpdate(comment._id, { replyCount: correctCount });
        console.log(`Updated comment ${commentId}: ${comment.replyCount} -> ${correctCount}`);
        updated++;
      }
    }

    console.log(`\nFixed ${updated} comment reply counts`);
    console.log('Done!');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixReplyCounts();
