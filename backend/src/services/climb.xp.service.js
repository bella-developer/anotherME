import User from '../models/User.model.js';
import { createLevelUpNotification } from './notification.service.js';

/**
 * Climb Room XP Service
 * Handles reaction-based XP calculation and stat distribution
 * 
 * Climb Room Philosophy:
 * - Rewards execution, innovation, and momentum
 * - Fast dopamine curve with visible progress
 * - Identity: "I execute and innovate"
 * - Growth through action and impact
 */

/**
 * Climb Room Reaction Weights
 * Each reaction maps to execution signals
 */
const CLIMB_ROOM_REACTIONS = {
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
 * Climb Room Stat Distribution
 * XP flows toward execution first, vision last
 */
const STAT_DISTRIBUTION = {
  genius: 0.40,  // Innovation, originality, problem-solving
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
  
  Object.entries(CLIMB_ROOM_REACTIONS).forEach(([reactionType, config]) => {
    const count = reactions[reactionType] || 0;
    totalXP += count * config.xp;
  });
  
  return Math.max(0, totalXP);
}

/**
 * Distribute XP across Climb Room stats
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
 * Award Climb Room XP to post author based on reactions
 * @param {string} userId - User's MongoDB ObjectId
 * @param {Object} reactions - Reaction counts
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Updated stats and level changes
 */
export async function awardClimbRoomXP(userId, reactions, options = {}) {
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
      genius: { xp: 0, level: 1, room: 'climb' },
      hustle: { xp: 0, level: 1, room: 'climb' },
      legend: { xp: 0, level: 1, room: 'climb' }
    };
  }
  
  // Track level ups
  const levelUps = [];
  
  // Award XP to each stat
  ['genius', 'hustle', 'legend'].forEach(stat => {
    if (!user.stats[stat]) {
      user.stats[stat] = { xp: 0, level: 1, room: 'climb' };
    }
    
    const oldLevel = user.stats[stat].level;
    const oldXP = user.stats[stat].xp || 0;
    
    // Add XP
    user.stats[stat].xp = oldXP + xpDistribution[stat];
    
    // Calculate new level
    const newLevel = calculateLevel(user.stats[stat].xp);
    user.stats[stat].level = newLevel;
    user.stats[stat].room = 'climb';
    
    // Track level up (energizing feedback)
    if (newLevel > oldLevel) {
      levelUps.push({
        stat,
        oldLevel,
        newLevel,
        xpGained: xpDistribution[stat]
      });
      
      // Create notification (async, don't block)
      createLevelUpNotification(userId, 'climb', stat, oldLevel, newLevel, xpDistribution[stat])
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
 * Get Climb Room feedback message based on reaction type
 * Energizing, momentum-building feedback
 * @param {string} reactionType - Type of reaction
 * @returns {string} Feedback message
 */
export function getClimbRoomFeedback(reactionType) {
  const feedbackMessages = {
    push: 'Keep climbing!',
    pull: 'Refine and iterate.',
    gear: 'That\'s practical genius.',
    rocket: 'You\'re onto something big!'
  };
  
  return feedbackMessages[reactionType] || 'Progress made.';
}

/**
 * Calculate momentum bonus for consistent posting
 * Climb Room rewards consistency and execution
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
  
  const result = await checkForAbuse('climb', userId, postData);
  
  return result.xpMultiplier;
}

export default {
  awardClimbRoomXP,
  getClimbRoomFeedback,
  calculateMomentumBonus,
  calculateExecutionQuality,
  CLIMB_ROOM_REACTIONS,
  STAT_DISTRIBUTION,
  LEVEL_THRESHOLDS
};
