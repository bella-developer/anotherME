import Post from '../models/Post.model.js';
import User from '../models/User.model.js';

/**
 * Anti-Abuse Service
 * Detects and prevents gaming of the XP system
 * Implements room-specific abuse detection
 */

/**
 * Calculate posting frequency for a user
 * @param {string} userId - User's MongoDB ObjectId
 * @param {number} hours - Time window in hours
 * @returns {Promise<number>} Number of posts in time window
 */
async function getPostingFrequency(userId, hours = 24) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  
  const count = await Post.countDocuments({
    authorId: userId,
    createdAt: { $gte: since },
    isHidden: false
  });
  
  return count;
}

/**
 * Calculate average post length for a user
 * @param {string} userId - User's MongoDB ObjectId
 * @param {number} limit - Number of recent posts to check
 * @returns {Promise<number>} Average content length
 */
async function getAveragePostLength(userId, limit = 10) {
  const posts = await Post.find({
    authorId: userId,
    isHidden: false
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('content')
    .lean();
  
  if (posts.length === 0) return 0;
  
  const totalLength = posts.reduce((sum, post) => sum + (post.content?.length || 0), 0);
  return totalLength / posts.length;
}

/**
 * Detect shallow posting patterns (Dark Room)
 * @param {string} userId - User's MongoDB ObjectId
 * @param {Object} postData - Current post data
 * @returns {Promise<Object>} Abuse detection result
 */
export async function detectDarkRoomAbuse(userId, postData) {
  const result = {
    isAbuse: false,
    xpMultiplier: 1.0,
    reasons: []
  };
  
  // Check posting frequency (over-posting)
  const postsLast24h = await getPostingFrequency(userId, 24);
  if (postsLast24h > 10) {
    result.xpMultiplier *= 0.5; // 50% penalty
    result.reasons.push('Over-posting detected');
  }
  
  // Check for shallow content
  const avgLength = await getAveragePostLength(userId);
  if (avgLength < 100 && postData.content.length < 100) {
    result.xpMultiplier *= 0.6; // 40% penalty
    result.reasons.push('Shallow content pattern');
  }
  
  // Check for rage-bait (excessive negative language)
  const negativeWords = ['hate', 'stupid', 'idiot', 'worst', 'terrible', 'awful'];
  const negativeCount = negativeWords.filter(word => 
    postData.content.toLowerCase().includes(word)
  ).length;
  
  if (negativeCount > 3) {
    result.xpMultiplier *= 0.7; // 30% penalty
    result.reasons.push('Potential rage-bait');
  }
  
  // Bonus for long silence + deep post
  const postsLast7d = await getPostingFrequency(userId, 168); // 7 days
  if (postsLast7d === 0 && postData.content.length > 500) {
    result.xpMultiplier *= 1.3; // 30% bonus
    result.reasons.push('Thoughtful return after silence');
  }
  
  result.isAbuse = result.xpMultiplier < 0.8;
  
  return result;
}

/**
 * Detect shallow philosophy (Philo Room)
 * @param {string} userId - User's MongoDB ObjectId
 * @param {Object} postData - Current post data
 * @returns {Promise<Object>} Abuse detection result
 */
export async function detectPhiloRoomAbuse(userId, postData) {
  const result = {
    isAbuse: false,
    xpMultiplier: 1.0,
    reasons: []
  };
  
  // Check for platitudes (very short posts)
  if (postData.content.length < 100) {
    result.xpMultiplier *= 0.5; // 50% penalty
    result.reasons.push('Likely platitude');
  }
  
  // Check for recycled quotes (common quote patterns)
  const quotePatterns = [
    /^["'].*["']$/m, // Starts and ends with quotes
    /- [A-Z][a-z]+ [A-Z][a-z]+$/, // Ends with "- Name Name"
    /\([A-Z][a-z]+ [A-Z][a-z]+\)$/ // Ends with "(Name Name)"
  ];
  
  const hasQuotePattern = quotePatterns.some(pattern => pattern.test(postData.content));
  if (hasQuotePattern && postData.content.length < 200) {
    result.xpMultiplier *= 0.6; // 40% penalty
    result.reasons.push('Likely recycled quote');
  }
  
  // Bonus for long, thoughtful posts
  if (postData.content.length > 500) {
    result.xpMultiplier *= 1.2; // 20% bonus
    result.reasons.push('Thoughtful depth');
  }
  
  // Bonus for posts with questions (provokes thought)
  const questionCount = (postData.content.match(/\?/g) || []).length;
  if (questionCount >= 2) {
    result.xpMultiplier *= 1.1; // 10% bonus
    result.reasons.push('Thought-provoking questions');
  }
  
  // Check posting frequency
  const postsLast24h = await getPostingFrequency(userId, 24);
  if (postsLast24h > 5) {
    result.xpMultiplier *= 0.7; // 30% penalty
    result.reasons.push('Over-posting');
  }
  
  result.isAbuse = result.xpMultiplier < 0.7;
  
  return result;
}

/**
 * Detect low-effort execution (Climb Room)
 * @param {string} userId - User's MongoDB ObjectId
 * @param {Object} postData - Current post data
 * @returns {Promise<Object>} Abuse detection result
 */
export async function detectClimbRoomAbuse(userId, postData) {
  const result = {
    isAbuse: false,
    xpMultiplier: 1.0,
    reasons: []
  };
  
  // Check for very short posts (low effort)
  if (postData.content.length < 50) {
    result.xpMultiplier *= 0.6; // 40% penalty
    result.reasons.push('Low effort content');
  }
  
  // Bonus for structured content (lists, steps)
  const hasStructure = /\d+\./g.test(postData.content);
  if (hasStructure) {
    result.xpMultiplier *= 1.2; // 20% bonus
    result.reasons.push('Well-structured content');
  }
  
  // Bonus for action-oriented language
  const actionWords = ['build', 'create', 'implement', 'execute', 'launch', 'ship', 'deploy'];
  const hasActionWords = actionWords.some(word => 
    postData.content.toLowerCase().includes(word)
  );
  
  if (hasActionWords) {
    result.xpMultiplier *= 1.15; // 15% bonus
    result.reasons.push('Action-oriented');
  }
  
  // Check for momentum (consistent posting)
  const postsLast7d = await getPostingFrequency(userId, 168);
  if (postsLast7d >= 3 && postsLast7d <= 10) {
    result.xpMultiplier *= 1.1; // 10% bonus
    result.reasons.push('Consistent momentum');
  }
  
  // Penalty for spam
  const postsLast24h = await getPostingFrequency(userId, 24);
  if (postsLast24h > 15) {
    result.xpMultiplier *= 0.5; // 50% penalty
    result.reasons.push('Spam detected');
  }
  
  result.isAbuse = result.xpMultiplier < 0.7;
  
  return result;
}

/**
 * Apply anti-abuse checks based on room
 * @param {string} room - Room type
 * @param {string} userId - User's MongoDB ObjectId
 * @param {Object} postData - Post data
 * @returns {Promise<Object>} Abuse detection result
 */
export async function checkForAbuse(room, userId, postData) {
  switch (room) {
    case 'dark':
      return await detectDarkRoomAbuse(userId, postData);
    case 'philo':
      return await detectPhiloRoomAbuse(userId, postData);
    case 'climb':
      return await detectClimbRoomAbuse(userId, postData);
    default:
      return {
        isAbuse: false,
        xpMultiplier: 1.0,
        reasons: []
      };
  }
}

/**
 * Log abuse detection for monitoring
 * @param {string} userId - User's MongoDB ObjectId
 * @param {string} room - Room type
 * @param {Object} result - Abuse detection result
 */
export async function logAbuseDetection(userId, room, result) {
  if (result.isAbuse || result.reasons.length > 0) {
    console.log('[Anti-Abuse]', {
      userId,
      room,
      isAbuse: result.isAbuse,
      xpMultiplier: result.xpMultiplier,
      reasons: result.reasons,
      timestamp: new Date().toISOString()
    });
  }
}

export default {
  checkForAbuse,
  detectDarkRoomAbuse,
  detectPhiloRoomAbuse,
  detectClimbRoomAbuse,
  logAbuseDetection
};
