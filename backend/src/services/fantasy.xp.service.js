import User from '../models/User.model.js';
import { createLevelUpNotification } from './notification.service.js';

/**
 * Fantasy Room XP Service
 * Handles reaction-based XP calculation and stat distribution
 * 
 * Fantasy Room Philosophy:
 * - Rewards creativity, imagination, and artistic expression
 * - Encourages daydreaming and creative thinking
 * - Identity: "I create and imagine"
 * - Growth through creativity and innovation
 */

/**
 * Fantasy Room Reaction Weights
 * Each reaction maps to creative signals
 */
const FANTASY_ROOM_REACTIONS = {
  push: {
    meaning: 'Basic support, upvote, "keep going"',
    xp: 3,
    statBias: 'hustle'
  },
  pull: {
    meaning: 'Constructive criticism, needs work',
    xp: -1,
    statBias: 'hustle'
  },
  gear: {
    meaning: 'Practical, actionable, useful',
    xp: 6,
    statBias: 'genius'
  },
  rocket: {
    meaning: 'Game-changing, breakthrough, visionary',
    xp: 10,
    statBias: 'legend'
  }
};

/**
 * Fantasy Room Stat Distribution
 * XP flows toward creativity first, vision last
 */
const STAT_DISTRIBUTION = {
  genius: 0.40,  // Innovation, originality, creativity
  hustle: 0.35,  // Execution, effort, consistency
  legend: 0.25   // Impact, vision, breakthrough moments
};

/**
 * Level Thresholds (same across all rooms)
 */
const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0 },
  { level: 2, xp: 101 },
  { level: 3, xp: 251 },
  { level: 4, xp: 501 },
  { level: 5, xp: 1001 },
  { level: 6, xp: 2001 },
  { level: 7, xp: 4001 },
  { level: 8, xp: 8001 },
  { level: 9, xp: 16001 },
  { level: 10, xp: 32001 }
];

/**
 * Calculate total engagement XP from reactions
 * @param {Object} reactions - Reaction counts
 * @returns {number} Total XP
 */
function calculateEngagementXP(reactions) {
  let totalXP = 0;
  
  Object.entries(FANTASY_ROOM_REACTIONS).forEach(([reactionType, config]) => {
    const count = reactions[reactionType] || 0;
    totalXP += count * config.xp;
  });
  
  return Math.max(0, totalXP);
}

/**
 * Distribute XP across Fantasy Room stats
 * @param {number} totalXP - Total engagement XP
 * @returns {Object} XP distribution by stat
 */
function distributeXP(totalXP) {
  return {
    genius: Math.floor(totalXP * STAT_DISTRIBUTION.genius),
    hustle: Math.floor(totalXP * STAT_DISTRIBUTION.hustle),
    legend: Math.floor(totalXP * STAT_DISTRIBUTION.legend)
  };
}

/**
 * Calculate level from XP
 * @param {number} xp - Current XP
 * @returns {number} Current level
 */
function calculateLevel(xp) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].xp) {
      return LEVEL_THRESHOLDS[i].level;
    }
  }
  return 1;
}

/**
 * Get XP needed for next level
 * @param {number} currentLevel - Current level
 * @returns {number|null} XP needed for next level, or null if max level
 */
function getXPForNextLevel(currentLevel) {
  const nextLevelData = LEVEL_THRESHOLDS.find(t => t.level === currentLevel + 1);
  return nextLevelData ? nextLevelData.xp : null;
}

/**
 * Award Fantasy Room XP to post author based on reactions
 * @param {string} userId - User's MongoDB ObjectId
 * @param {Object} reactions - Reaction counts
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Updated stats and level changes
 */
export async function awardFantasyRoomXP(userId, reactions, options = {}) {
  // Calculate total engagement XP
  const totalXP = calculateEngagementXP(reactions);
  
  if (totalXP <= 0) {
    return {
      totalXP: 0,
      distribution: { genius: 0, hustle: 0, legend: 0 },
      levelUps: []
    };
  }
  
  // Distribute XP across stats
  const xpDistribution = distributeXP(totalXP);
  
  // Fetch user
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  // Initialize stats if not present
  if (!user.stats) {
    user.stats = {
      genius: { xp: 0, level: 1, room: 'fantasy' },
      hustle: { xp: 0, level: 1, room: 'fantasy' },
      legend: { xp: 0, level: 1, room: 'fantasy' }
    };
  }
  
  // Track level ups
  const levelUps = [];
  
  // Award XP to each stat
  ['genius', 'hustle', 'legend'].forEach(stat => {
    if (!user.stats[stat]) {
      user.stats[stat] = { xp: 0, level: 1, room: 'fantasy' };
    }
    
    const oldLevel = user.stats[stat].level;
    const oldXP = user.stats[stat].xp || 0;
    
    // Add XP
    user.stats[stat].xp = oldXP + xpDistribution[stat];
    
    // Calculate new level
    const newLevel = calculateLevel(user.stats[stat].xp);
    user.stats[stat].level = newLevel;
    user.stats[stat].room = 'fantasy';
    
    // Track level up (energizing feedback)
    if (newLevel > oldLevel) {
      levelUps.push({
        stat,
        oldLevel,
        newLevel,
        xpGained: xpDistribution[stat]
      });
      
      // Create notification (async, don't block)
      createLevelUpNotification(userId, 'fantasy', stat, oldLevel, newLevel, xpDistribution[stat])
        .catch(err => console.error('Failed to create level-up notification:', err));
    }
  });
  
  // Save user
  await user.save();
  
  return {
    totalXP,
    distribution: xpDistribution,
    levelUps,
    currentStats: {
      genius: {
        xp: user.stats.genius.xp,
        level: user.stats.genius.level,
        nextLevelXP: getXPForNextLevel(user.stats.genius.level)
      },
      hustle: {
        xp: user.stats.hustle.xp,
        level: user.stats.hustle.level,
        nextLevelXP: getXPForNextLevel(user.stats.hustle.level)
      },
      legend: {
        xp: user.stats.legend.xp,
        level: user.stats.legend.level,
        nextLevelXP: getXPForNextLevel(user.stats.legend.level)
      }
    }
  };
}

/**
 * Get Fantasy Room feedback message based on reaction type
 * Energizing, creative feedback
 * @param {string} reactionType - Type of reaction
 * @returns {string} Feedback message
 */
export function getFantasyRoomFeedback(reactionType) {
  const feedbackMessages = {
    push: 'Keep creating!',
    pull: 'Refine and iterate.',
    gear: 'That\'s practical genius.',
    rocket: 'You\'re onto something big!'
  };
  
  return feedbackMessages[reactionType] || 'Progress made.';
}

/**
 * Calculate momentum bonus for consistent posting
 * Fantasy Room rewards consistency and creativity
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {Promise<number>} Momentum multiplier (1.0 to 1.5)
 */
export async function calculateMomentumBonus(userId) {
  // TODO: Implement momentum tracking
  // - Posts in last 7 days → momentum bonus
  // - Consistent weekly posting → streak bonus
  // - Long gaps → momentum reset
  
  return 1.0; // Default: no bonus
}

/**
 * Calculate execution quality multiplier
 * Rewards actionable, practical content
 * @param {Object} postData - Post data
 * @returns {Promise<number>} Quality multiplier (0.5 to 1.5)
 */
export async function calculateExecutionQuality(userId, postData) {
  const { checkForAbuse } = await import('./antiabuse.service.js');
  
  const result = await checkForAbuse('fantasy', userId, postData);
  
  return result.xpMultiplier;
}

export default {
  awardFantasyRoomXP,
  getFantasyRoomFeedback,
  calculateMomentumBonus,
  calculateExecutionQuality,
  FANTASY_ROOM_REACTIONS,
  STAT_DISTRIBUTION,
  LEVEL_THRESHOLDS
};
