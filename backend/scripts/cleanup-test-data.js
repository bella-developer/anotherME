import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.model.js';
import Post from '../src/models/Post.model.js';
import Circle from '../src/models/Circle.model.js';
import Comment from '../src/models/Comment.model.js';

dotenv.config();

/**
 * Cleanup script to remove all test data from the database
 */
async function cleanupTestData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully');

    // Count documents before cleanup
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    const circleCount = await Circle.countDocuments();
    const commentCount = await Comment.countDocuments();

    console.log('\nBefore cleanup:');
    console.log(`- Users: ${userCount}`);
    console.log(`- Posts: ${postCount}`);
    console.log(`- Circles: ${circleCount}`);
    console.log(`- Comments: ${commentCount}`);

    // Delete all documents
    console.log('\nDeleting all documents...');
    await User.deleteMany({});
    await Post.deleteMany({});
    await Circle.deleteMany({});
    await Comment.deleteMany({});

    console.log('All test data deleted successfully!');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed');
  }
}

cleanupTestData();
