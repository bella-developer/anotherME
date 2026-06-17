import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.model.js';

dotenv.config();

/**
 * Cleanup script to remove old/invalid indexes from the database
 */
async function cleanupIndexes() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully');

    // Get all indexes on the users collection
    const indexes = await User.collection.getIndexes();
    console.log('Current indexes:', Object.keys(indexes));

    // Drop the email index if it exists
    try {
      await User.collection.dropIndex('email_1');
      console.log('Dropped email_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('email_1 index does not exist (already removed)');
      } else {
        console.error('Error dropping email_1 index:', error.message);
      }
    }

    // Rebuild indexes based on current schema
    console.log('Rebuilding indexes from schema...');
    await User.syncIndexes();
    console.log('Indexes synchronized');

    // Show final indexes
    const finalIndexes = await User.collection.getIndexes();
    console.log('Final indexes:', Object.keys(finalIndexes));

    console.log('Cleanup complete!');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed');
  }
}

cleanupIndexes();
