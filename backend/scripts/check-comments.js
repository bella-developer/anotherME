import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Comment from '../src/models/Comment.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

async function checkComments() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const circleId = '697714f57ca9366f6ef2f779';
    
    // Check total comments for this circle
    const totalComments = await Comment.countDocuments({ circleId });
    console.log(`Total comments for circle ${circleId}: ${totalComments}`);
    
    // Check top-level comments (no parent)
    const topLevelComments = await Comment.countDocuments({ 
      circleId,
      parentId: null 
    });
    console.log(`Top-level comments: ${topLevelComments}`);
    
    // Check comments with postId
    const commentsWithPost = await Comment.countDocuments({ 
      circleId,
      postId: { $ne: null }
    });
    console.log(`Comments with postId: ${commentsWithPost}`);
    
    // Check comments without postId
    const commentsWithoutPost = await Comment.countDocuments({ 
      circleId,
      postId: null
    });
    console.log(`Comments without postId: ${commentsWithoutPost}`);
    
    // Show sample comments
    console.log('\nSample top-level comments:');
    const samples = await Comment.find({ 
      circleId,
      parentId: null 
    }).limit(3).lean();
    
    samples.forEach((comment, index) => {
      console.log(`\n${index + 1}. ${comment.content.substring(0, 60)}...`);
      console.log(`   postId: ${comment.postId || 'null'}`);
      console.log(`   replyCount: ${comment.replyCount}`);
      console.log(`   reactions: resonate=${comment.reactions.resonate}, echo=${comment.reactions.echo}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkComments();
