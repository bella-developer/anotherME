import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

import Circle from '../src/models/Circle.model.js';
import Comment from '../src/models/Comment.model.js';
import User from '../src/models/User.model.js';
import { sanitizeCommentContent } from '../src/utils/sanitization.utils.js';

/**
 * Seed "The Void" circle with nested comments
 */
async function seedVoidComments() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find or create "The Void" circle
    let voidCircle = await Circle.findOne({ name: 'The Void' });
    
    if (!voidCircle) {
      console.log('Creating "The Void" circle...');
      
      // Get first user as creator
      const firstUser = await User.findOne();
      if (!firstUser) {
        console.error('No users found. Please create a user first.');
        process.exit(1);
      }

      voidCircle = new Circle({
        name: 'The Void',
        description: 'A space for thoughts that have no other home.',
        creatorId: firstUser._id,
        visibility: 'public',
        memberCount: 1204,
        postCount: 0,
        categories: ['SOLITUDE', 'REGRET', 'ANXIETY', 'LONELINESS']
      });

      await voidCircle.save();
      console.log('Created "The Void" circle');
    }

    // Get some users for comments
    const users = await User.find().limit(10);
    if (users.length === 0) {
      console.error('No users found. Please create users first.');
      process.exit(1);
    }

    // Clear existing comments for The Void
    await Comment.deleteMany({ circleId: voidCircle._id });
    console.log('Cleared existing comments');

    // Create nested comments matching the design
    const comments = [];

    // Top-level comment 1: Anon_829
    const comment1Content = "Sometimes the silence in this city is louder than the noise. Does anyone else feel like they're just watching a movie of their own life? The graphite lines of the subway, the repetitive motions... it all feels scripted.";
    const comment1 = new Comment({
      circleId: voidCircle._id,
      postId: null,
      authorId: users[0]._id,
      parentId: null,
      content: comment1Content,
      contentSanitized: sanitizeCommentContent(comment1Content),
      depth: 0,
      reactions: { resonate: 42, echo: 12 },
      replyCount: 3
    });
    await comment1.save();
    comments.push(comment1);
    console.log('Created comment 1');

    // Reply 1.1: Anon_104
    const reply1_1Content = "Every single day. It's like being a ghost in a machine that doesn't know you're there. The digital connections we make here are the only things that feel real lately.";
    const reply1_1 = new Comment({
      circleId: voidCircle._id,
      postId: null,
      authorId: users[1]._id,
      parentId: comment1._id,
      content: reply1_1Content,
      contentSanitized: sanitizeCommentContent(reply1_1Content),
      depth: 1,
      reactions: { resonate: 8, echo: 0 },
      replyCount: 1
    });
    await reply1_1.save();
    comments.push(reply1_1);
    console.log('Created reply 1.1');

    // Reply 1.1.1: Anon_992
    const reply1_1_1Content = "The script can be broken. You just have to stop looking for the exit and start looking at the walls.";
    const reply1_1_1 = new Comment({
      circleId: voidCircle._id,
      postId: null,
      authorId: users[2]._id,
      parentId: reply1_1._id,
      content: reply1_1_1Content,
      contentSanitized: sanitizeCommentContent(reply1_1_1Content),
      depth: 2,
      reactions: { resonate: 3, echo: 0 },
      replyCount: 0
    });
    await reply1_1_1.save();
    comments.push(reply1_1_1);
    console.log('Created reply 1.1.1');

    // Top-level comment 2: Echo_Null
    const comment2Content = 'The "Void" isn\'t empty. It\'s just full of things we aren\'t allowed to say out loud. I feel lighter every time I post here.';
    const comment2 = new Comment({
      circleId: voidCircle._id,
      postId: null,
      authorId: users[3]._id,
      parentId: null,
      content: comment2Content,
      contentSanitized: sanitizeCommentContent(comment2Content),
      depth: 0,
      reactions: { resonate: 156, echo: 89 },
      replyCount: 0
    });
    await comment2.save();
    comments.push(comment2);
    console.log('Created comment 2');

    // Top-level comment 3
    const comment3Content = "I've been lurking here for weeks. This is the first place where I don't feel judged for just... existing in my own weird way.";
    const comment3 = new Comment({
      circleId: voidCircle._id,
      postId: null,
      authorId: users[4]._id,
      parentId: null,
      content: comment3Content,
      contentSanitized: sanitizeCommentContent(comment3Content),
      depth: 0,
      reactions: { resonate: 67, echo: 23 },
      replyCount: 2
    });
    await comment3.save();
    comments.push(comment3);
    console.log('Created comment 3');

    // Reply 3.1
    const reply3_1Content = "Welcome to the void. We're all weird here, and that's exactly the point.";
    const reply3_1 = new Comment({
      circleId: voidCircle._id,
      postId: null,
      authorId: users[5]._id,
      parentId: comment3._id,
      content: reply3_1Content,
      contentSanitized: sanitizeCommentContent(reply3_1Content),
      depth: 1,
      reactions: { resonate: 12, echo: 4 },
      replyCount: 0
    });
    await reply3_1.save();
    comments.push(reply3_1);
    console.log('Created reply 3.1');

    // Reply 3.2
    const reply3_2Content = "Same. I spent years trying to fit into spaces that weren't made for me. Here, I can just be.";
    const reply3_2 = new Comment({
      circleId: voidCircle._id,
      postId: null,
      authorId: users[6]._id,
      parentId: comment3._id,
      content: reply3_2Content,
      contentSanitized: sanitizeCommentContent(reply3_2Content),
      depth: 1,
      reactions: { resonate: 18, echo: 7 },
      replyCount: 0
    });
    await reply3_2.save();
    comments.push(reply3_2);
    console.log('Created reply 3.2');

    // Top-level comment 4
    const comment4Content = "Does anyone else come here at 3am when the thoughts get too loud? The void listens better than therapy ever did.";
    const comment4 = new Comment({
      circleId: voidCircle._id,
      postId: null,
      authorId: users[7]._id,
      parentId: null,
      content: comment4Content,
      contentSanitized: sanitizeCommentContent(comment4Content),
      depth: 0,
      reactions: { resonate: 94, echo: 31 },
      replyCount: 1
    });
    await comment4.save();
    comments.push(comment4);
    console.log('Created comment 4');

    // Reply 4.1
    const reply4_1Content = "3am void crew checking in. There's something about the darkness that makes it easier to be honest.";
    const reply4_1 = new Comment({
      circleId: voidCircle._id,
      postId: null,
      authorId: users[8]._id,
      parentId: comment4._id,
      content: reply4_1Content,
      contentSanitized: sanitizeCommentContent(reply4_1Content),
      depth: 1,
      reactions: { resonate: 27, echo: 9 },
      replyCount: 0
    });
    await reply4_1.save();
    comments.push(reply4_1);
    console.log('Created reply 4.1');

    // Top-level comment 5
    const comment5Content = "I don't know who needs to hear this, but your silence is valid. You don't owe anyone your story.";
    const comment5 = new Comment({
      circleId: voidCircle._id,
      postId: null,
      authorId: users[9]._id,
      parentId: null,
      content: comment5Content,
      contentSanitized: sanitizeCommentContent(comment5Content),
      depth: 0,
      reactions: { resonate: 203, echo: 78 },
      replyCount: 0
    });
    await comment5.save();
    comments.push(comment5);
    console.log('Created comment 5');

    console.log(`\nSuccessfully seeded ${comments.length} comments for "The Void" circle`);
    console.log(`Circle ID: ${voidCircle._id}`);
    console.log(`Circle name: ${voidCircle.name}`);

  } catch (error) {
    console.error('Error seeding comments:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
seedVoidComments();
