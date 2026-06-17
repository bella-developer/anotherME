import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Post from '../src/models/Post.model.js';
import Comment from '../src/models/Comment.model.js';
import User from '../src/models/User.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

/**
 * Seed conversations for each room's posts
 * Creates nested comments with varying engagement levels
 */

const DARK_ROOM_CONVERSATIONS = {
  'The weight of my regrets is suffocating.': [
    {
      content: "I feel this so deeply. The past haunts me every single day.",
      replies: [
        { content: "You're not alone in this. We all carry our regrets." },
        { content: "Have you tried writing them down? Sometimes seeing them on paper helps." }
      ],
      reactions: 12
    },
    {
      content: "The darkness feels endless sometimes. But we're here together.",
      replies: [
        { content: "This community has been my lifeline." },
        { content: "Thank you for being here. Your words matter." },
        { content: "We witness each other's pain. That's powerful." }
      ],
      reactions: 18
    },
    {
      content: "I understand the suffocation. It's like drowning in memories.",
      replies: [],
      reactions: 7
    },
    {
      content: "Some days are harder than others. Today is one of those days.",
      replies: [
        { content: "Sending you strength. One moment at a time." }
      ],
      reactions: 5
    }
  ],
  'Everyone around me is talking, laughing, living': [
    {
      content: "I know exactly what you mean. Present but absent. That's my life.",
      replies: [
        { content: "It's exhausting pretending everything is okay." },
        { content: "The mask we wear gets heavier each day." }
      ],
      reactions: 15
    },
    {
      content: "Someone would care. I care. You matter.",
      replies: [
        { content: "This. You are seen here." },
        { content: "Your presence matters, even in the silence." },
        { content: "We notice. We care. You're not invisible here." }
      ],
      reactions: 22
    },
    {
      content: "The loneliness in a crowd is the worst kind.",
      replies: [
        { content: "Surrounded by people, yet completely alone." }
      ],
      reactions: 9
    }
  ],
  'Sometimes the weight of everything feels unbearable': [
    {
      content: "The dread. Yes. It's the first thing I feel when I wake up.",
      replies: [
        { content: "Like a heavy blanket you can't shake off." },
        { content: "I've been there. Some mornings I can barely get out of bed." }
      ],
      reactions: 16
    },
    {
      content: "Dissociation is real. Watching yourself from outside is terrifying.",
      replies: [
        { content: "It's like being a ghost in your own life." },
        { content: "I feel this. Like nothing is quite real anymore." },
        { content: "Grounding techniques help sometimes. Deep breaths, cold water." }
      ],
      reactions: 20
    },
    {
      content: "You're going through the motions but you're still here. That takes strength.",
      replies: [],
      reactions: 8
    }
  ]
};

const PHILO_ROOM_CONVERSATIONS = {
  'The paradox of choice': [
    {
      content: "More options don't always mean more freedom. Sometimes they paralyze us.",
      replies: [
        { content: "Barry Schwartz wrote about this. Too many choices lead to anxiety." },
        { content: "The tyranny of small decisions. Every choice has an opportunity cost." }
      ],
      reactions: 14
    },
    {
      content: "Perhaps the paradox reveals that freedom isn't about having options, but about knowing what we value.",
      replies: [
        { content: "This is profound. Clarity of values simplifies choice." },
        { content: "Kierkegaard: anxiety is the dizziness of freedom." },
        { content: "When we know our 'why', the 'what' becomes easier." }
      ],
      reactions: 19
    },
    {
      content: "I think we're evolutionarily unprepared for infinite choice.",
      replies: [
        { content: "Our brains evolved for scarcity, not abundance." }
      ],
      reactions: 11
    },
    {
      content: "What if the real choice is whether to engage with all the options?",
      replies: [],
      reactions: 6
    }
  ],
  "I've been thinking about authenticity": [
    {
      content: "We contain multitudes. Maybe authenticity is honoring all our selves, not picking one.",
      replies: [
        { content: "Walt Whitman: 'Do I contradict myself? Very well then I contradict myself.'" },
        { content: "Context matters. Different situations call forth different aspects of who we are." }
      ],
      reactions: 17
    },
    {
      content: "Authenticity might be about alignment between inner experience and outer expression.",
      replies: [
        { content: "But we also perform for ourselves. Self-deception is real." },
        { content: "Sartre: bad faith is lying to ourselves about our freedom." }
      ],
      reactions: 13
    },
    {
      content: "The self we present is always a construction. That doesn't make it inauthentic.",
      replies: [],
      reactions: 8
    }
  ],
  'On the nature of suffering': [
    {
      content: "Suffering reveals what we value. It shows us what matters.",
      replies: [
        { content: "Viktor Frankl found meaning in the worst suffering imaginable." },
        { content: "But should we have to suffer to find meaning?" }
      ],
      reactions: 21
    },
    {
      content: "Perhaps suffering is the price of consciousness. To feel deeply is to hurt deeply.",
      replies: [
        { content: "The Buddha taught that suffering comes from attachment." },
        { content: "But attachment is also what makes life worth living." },
        { content: "Maybe it's about finding balance, not elimination." }
      ],
      reactions: 16
    },
    {
      content: "Suffering without meaning is unbearable. Meaning transforms suffering.",
      replies: [
        { content: "This resonates deeply." }
      ],
      reactions: 10
    }
  ]
};

const CLIMB_ROOM_CONVERSATIONS = {
  'Community-Driven Mental Health Resources': [
    {
      content: "Love this idea. Start with a simple directory of resources, then add community ratings.",
      replies: [
        { content: "Yes! And make it location-aware. Mental health resources vary by region." },
        { content: "Could integrate with crisis hotlines and emergency services." }
      ],
      reactions: 15
    },
    {
      content: "Privacy is crucial. How do you balance community features with anonymity?",
      replies: [
        { content: "End-to-end encryption for peer support. Public ratings for resources." },
        { content: "Maybe use verified anonymous reviews, like Yelp but private." },
        { content: "Blockchain for verified reviews without revealing identity?" }
      ],
      reactions: 18
    },
    {
      content: "Partner with existing organizations. Don't reinvent the wheel.",
      replies: [
        { content: "NAMI, Crisis Text Line, local nonprofits. Build bridges." }
      ],
      reactions: 12
    },
    {
      content: "Accessibility is key. Multiple languages, screen reader support, simple UI.",
      replies: [],
      reactions: 7
    }
  ],
  'Micro-journaling for Emotional Patterns': [
    {
      content: "This could be powerful. Quick mood check-ins throughout the day, then ML to find patterns.",
      replies: [
        { content: "Sentiment analysis on journal entries. Show trends over time." },
        { content: "But keep it simple. Don't overwhelm users with data." }
      ],
      reactions: 20
    },
    {
      content: "Privacy first. All data encrypted, stored locally, user controls everything.",
      replies: [
        { content: "Exactly. This is sensitive data. No cloud unless user opts in." },
        { content: "Open source it. Let people audit the code." }
      ],
      reactions: 14
    },
    {
      content: "Gamify consistency. Streaks, gentle reminders, but not pushy.",
      replies: [
        { content: "Positive reinforcement, not guilt trips." }
      ],
      reactions: 9
    }
  ],
  'Anonymous Mental Health Support Network': [
    {
      content: "Peer support is underrated. Professional help is important, but community matters too.",
      replies: [
        { content: "Trained peer counselors. Not therapy, but empathetic listening." },
        { content: "7 Cups of Tea does this well. Learn from what works." }
      ],
      reactions: 16
    },
    {
      content: "Moderation is critical. How do you prevent harm while maintaining anonymity?",
      replies: [
        { content: "AI-assisted moderation for crisis keywords. Human review for escalation." },
        { content: "Clear community guidelines. Report system with quick response." }
      ],
      reactions: 19
    },
    {
      content: "Build in professional resources. Peer support is great, but know when to escalate.",
      replies: [],
      reactions: 11
    }
  ]
};

async function seedConversations() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({});
    if (users.length < 3) {
      console.error('Need at least 3 users. Run seed-database.js first.');
      process.exit(1);
    }

    console.log(`Found ${users.length} users`);

    // Clear existing comments
    await Comment.deleteMany({});
    console.log('Cleared existing comments');

    let totalComments = 0;
    let totalReplies = 0;

    // Helper function to create comments with reactions
    async function createComment(postId, circleId, content, authorId, parentId = null, reactionCount = 0) {
      const comment = new Comment({
        postId,
        circleId,
        authorId,
        parentId,
        content,
        contentSanitized: content,
        reactions: {
          resonate: 0,
          echo: 0
        },
        replyCount: 0,
        depth: parentId ? 1 : 0
      });

      // Add reactions from different users
      if (reactionCount > 0) {
        const reactionTypes = ['resonate', 'echo'];
        const reactors = users.filter(u => u._id.toString() !== authorId.toString()).slice(0, Math.min(reactionCount, users.length - 1));
        
        reactors.forEach((reactor, index) => {
          const reactionType = reactionTypes[index % reactionTypes.length];
          comment.reactions[reactionType]++;
          comment.userReactions.push({
            userId: reactor._id,
            type: reactionType
          });
        });
      }

      await comment.save();
      return comment;
    }

    // Seed Dark Room conversations
    console.log('\nSeeding Dark Room conversations...');
    const darkPosts = await Post.find({ room: 'dark' }).sort({ createdAt: -1 });
    
    for (const post of darkPosts) {
      const postTitle = post.content.split('\n')[0];
      // Try exact match first, then partial match
      let conversations = DARK_ROOM_CONVERSATIONS[postTitle];
      if (!conversations) {
        // Try partial match
        const key = Object.keys(DARK_ROOM_CONVERSATIONS).find(k => 
          postTitle.includes(k.substring(0, 30)) || k.includes(postTitle.substring(0, 30))
        );
        conversations = key ? DARK_ROOM_CONVERSATIONS[key] : null;
      }
      
      if (conversations) {
        console.log(`  Adding conversations to: "${postTitle.substring(0, 50)}..."`);
        
        // Get the first circle ID from the post
        const circleId = post.circles && post.circles.length > 0 ? post.circles[0].circleId : null;
        if (!circleId) {
          console.log(`    Skipping - no circle found for post`);
          continue;
        }
        
        for (const conv of conversations) {
          // Create parent comment
          const author = users[Math.floor(Math.random() * users.length)];
          const parentComment = await createComment(
            post._id,
            circleId,
            conv.content,
            author._id,
            null,
            conv.reactions
          );
          totalComments++;

          // Create replies
          for (const reply of conv.replies) {
            const replyAuthor = users[Math.floor(Math.random() * users.length)];
            await createComment(
              post._id,
              circleId,
              reply.content,
              replyAuthor._id,
              parentComment._id,
              Math.floor(Math.random() * 8) + 2 // 2-9 reactions for replies
            );
            totalReplies++;
            
            // Update parent reply count
            parentComment.replyCount++;
            await parentComment.save();
          }
        }

        // Update post comment count
        const commentCount = await Comment.countDocuments({ postId: post._id, parentId: null });
        post.commentCount = commentCount;
        await post.save();
      }
    }

    // Seed Philo Room conversations
    console.log('\nSeeding Philo Room conversations...');
    const philoPosts = await Post.find({ room: 'philo' }).sort({ createdAt: -1 });
    
    for (const post of philoPosts) {
      const postTitle = post.title || post.content.split('\n')[0];
      // Try exact match first, then partial match
      let conversations = PHILO_ROOM_CONVERSATIONS[postTitle];
      if (!conversations) {
        const key = Object.keys(PHILO_ROOM_CONVERSATIONS).find(k => 
          postTitle.includes(k.substring(0, 20)) || k.includes(postTitle.substring(0, 20))
        );
        conversations = key ? PHILO_ROOM_CONVERSATIONS[key] : null;
      }
      
      if (conversations) {
        console.log(`  Adding conversations to: "${postTitle}"`);
        
        const circleId = post.circles && post.circles.length > 0 ? post.circles[0].circleId : null;
        if (!circleId) {
          console.log(`    Skipping - no circle found for post`);
          continue;
        }
        
        for (const conv of conversations) {
          const author = users[Math.floor(Math.random() * users.length)];
          const parentComment = await createComment(
            post._id,
            circleId,
            conv.content,
            author._id,
            null,
            conv.reactions
          );
          totalComments++;

          for (const reply of conv.replies) {
            const replyAuthor = users[Math.floor(Math.random() * users.length)];
            await createComment(
              post._id,
              circleId,
              reply.content,
              replyAuthor._id,
              parentComment._id,
              Math.floor(Math.random() * 7) + 3
            );
            totalReplies++;
            
            parentComment.replyCount++;
            await parentComment.save();
          }
        }

        const commentCount = await Comment.countDocuments({ postId: post._id, parentId: null });
        post.commentCount = commentCount;
        await post.save();
      }
    }

    // Seed Climb Room conversations
    console.log('\nSeeding Climb Room conversations...');
    const climbPosts = await Post.find({ room: 'climb' }).sort({ createdAt: -1 });
    
    for (const post of climbPosts) {
      const postTitle = post.title || post.content.split('\n')[0];
      // Try exact match first, then partial match
      let conversations = CLIMB_ROOM_CONVERSATIONS[postTitle];
      if (!conversations) {
        const key = Object.keys(CLIMB_ROOM_CONVERSATIONS).find(k => 
          postTitle.includes(k.substring(0, 20)) || k.includes(postTitle.substring(0, 20))
        );
        conversations = key ? CLIMB_ROOM_CONVERSATIONS[key] : null;
      }
      
      if (conversations) {
        console.log(`  Adding conversations to: "${postTitle}"`);
        
        const circleId = post.circles && post.circles.length > 0 ? post.circles[0].circleId : null;
        if (!circleId) {
          console.log(`    Skipping - no circle found for post`);
          continue;
        }
        
        for (const conv of conversations) {
          const author = users[Math.floor(Math.random() * users.length)];
          const parentComment = await createComment(
            post._id,
            circleId,
            conv.content,
            author._id,
            null,
            conv.reactions
          );
          totalComments++;

          for (const reply of conv.replies) {
            const replyAuthor = users[Math.floor(Math.random() * users.length)];
            await createComment(
              post._id,
              circleId,
              reply.content,
              replyAuthor._id,
              parentComment._id,
              Math.floor(Math.random() * 6) + 4
            );
            totalReplies++;
            
            parentComment.replyCount++;
            await parentComment.save();
          }
        }

        const commentCount = await Comment.countDocuments({ postId: post._id, parentId: null });
        post.commentCount = commentCount;
        await post.save();
      }
    }

    console.log('\n✅ Conversation seeding complete!');
    console.log(`   Total parent comments: ${totalComments}`);
    console.log(`   Total replies: ${totalReplies}`);
    console.log(`   Total comments: ${totalComments + totalReplies}`);
    
    // Show engagement distribution
    const highEngagement = await Comment.countDocuments({ 
      parentId: null,
      $expr: { 
        $gte: [
          { $add: ['$reactions.resonate', '$reactions.echo'] },
          15
        ]
      }
    });
    const mediumEngagement = await Comment.countDocuments({ 
      parentId: null,
      $expr: { 
        $and: [
          { $gte: [{ $add: ['$reactions.resonate', '$reactions.echo'] }, 10] },
          { $lt: [{ $add: ['$reactions.resonate', '$reactions.echo'] }, 15] }
        ]
      }
    });
    const lowEngagement = await Comment.countDocuments({ 
      parentId: null,
      $expr: { 
        $and: [
          { $gte: [{ $add: ['$reactions.resonate', '$reactions.echo'] }, 4] },
          { $lt: [{ $add: ['$reactions.resonate', '$reactions.echo'] }, 10] }
        ]
      }
    });

    console.log('\n📊 Engagement distribution:');
    console.log(`   High (15+): ${highEngagement} comments`);
    console.log(`   Medium (10-14): ${mediumEngagement} comments`);
    console.log(`   Low (4-9): ${lowEngagement} comments`);

  } catch (error) {
    console.error('Error seeding conversations:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
}

// Run the seeder
seedConversations();
