import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Import models and services
import Post from '../src/models/Post.model.js';
import { awardXP } from '../src/services/gamification.service.js';

const MONGODB_URI = process.env.MONGODB_URI;

async function calculateXPFromReactions() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all posts with reactions
    console.log('\nFetching posts with reactions...');
    const posts = await Post.find({
      $or: [
        { 'reactions.iFeelYou': { $gt: 0 } },
        { 'reactions.notGood': { $gt: 0 } },
        { 'reactions.youreNotAlone': { $gt: 0 } },
        { 'reactions.sendingStrength': { $gt: 0 } },
        { 'reactions.lamp': { $gt: 0 } },
        { 'reactions.spark': { $gt: 0 } },
        { 'reactions.clap': { $gt: 0 } },
        { 'reactions.push': { $gt: 0 } },
        { 'reactions.pull': { $gt: 0 } },
        { 'reactions.gear': { $gt: 0 } },
        { 'reactions.rocket': { $gt: 0 } }
      ]
    }).select('authorId room reactions title');

    console.log(`Found ${posts.length} posts with reactions`);

    // Calculate XP for each post author
    console.log('\nCalculating XP for post authors...');
    let successCount = 0;
    let errorCount = 0;

    for (const post of posts) {
      try {
        const result = await awardXP(
          post.authorId.toString(),
          post.room,
          post.reactions
        );

        if (result && result.levelUps && result.levelUps.length > 0) {
          console.log(`  ✓ ${post.title || 'Untitled'} (${post.room}): ${result.totalXP} XP awarded`);
          result.levelUps.forEach(levelUp => {
            console.log(`    🎉 ${levelUp.stat}: Level ${levelUp.oldLevel} → ${levelUp.newLevel}`);
          });
        } else {
          console.log(`  ✓ ${post.title || 'Untitled'} (${post.room}): ${result?.totalXP || 0} XP awarded`);
        }
        successCount++;
      } catch (error) {
        console.error(`  ✗ Error processing post ${post._id}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n✅ XP calculation complete!`);
    console.log(`  Success: ${successCount} posts`);
    console.log(`  Errors: ${errorCount} posts`);

  } catch (error) {
    console.error('Error calculating XP:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  }
}

// Run the calculation
calculateXPFromReactions();
