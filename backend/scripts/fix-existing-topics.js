/**
 * Fix Existing Posts - Set as Circle Topics
 * 
 * This script sets existing posts as circle topics (max 3 per circle)
 * Run this once to migrate existing data
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from '../src/models/Post.model.js';

// Load environment variables
dotenv.config();

async function fixExistingTopics() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Get all circles with posts
    const circlesWithPosts = await Post.aggregate([
      { $match: { isHidden: false } },
      { $group: { _id: '$circleId', count: { $sum: 1 } } },
      { $match: { _id: { $ne: null } } }
    ]);

    console.log(`Found ${circlesWithPosts.length} circles with posts`);

    let totalUpdated = 0;

    // For each circle, set the 3 most recent posts as topics
    for (const circle of circlesWithPosts) {
      const circleId = circle._id;
      
      // Get the 3 most recent posts for this circle
      const recentPosts = await Post.find({
        circleId: circleId,
        isHidden: false
      })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('_id');

      if (recentPosts.length > 0) {
        const postIds = recentPosts.map(p => p._id);
        
        // Set these posts as topics
        const result = await Post.updateMany(
          { _id: { $in: postIds } },
          {
            $set: {
              isCircleTopic: true,
              circleTopicSetAt: new Date()
            }
          }
        );

        console.log(`  Circle ${circleId}: Set ${result.modifiedCount} posts as topics`);
        totalUpdated += result.modifiedCount;
      }
    }

    console.log(`\n✓ Migration complete! Updated ${totalUpdated} posts as circle topics`);

  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
  }
}

// Run the migration
fixExistingTopics();
