import User from '../models/User.model.js';
import { createLevelUpNotification } from './notification.service.js';

/**
 * Dark Room XP Service
 * Handles reaction-based XP calculation and stat distribution
 * 
 * Dark Room Philosophy:
 * - No likes, no hype, only witnessing
 * - XP comes from being felt, not being liked
 * - Stats reflect inner alignment, not popularity
 */

/**
 * Dark Room Reaction Weights
 * Each reaction maps to psychological signals
 */
const DARK_ROOM_REACTIONS = {
  iFeelYou: {
    meaning: 'Emotional resonance, shared pain',
    xp: 6,
    statBias: 'ghost'
  },
  notGood: {
    meaning: 'Discomfort, rejection, emotional heaviness',
    xp: -1,
    statBias: 'shadow'
  },
  youreNotAlone: {
    meaning: 'Validation, presence, witnessing',
    xp: 5,
    statBias: 'shadow'
  },
  sendingStrength: {
    meaning: 'Support, courage, survival energy',
    xp: 7,
    statBias: 'rogue'
  }
};

/**
 * Dark Room Stat Distribution
 * XP flows toward the emotion expressed
 */
const STAT_DISTRIBUTION = {
  shadow: 0.45,  // Depth, hidden truth, inner weight
  ghost: 0.35,   // Vulnerability, emotional resonance
  rogue: 0.20    // Courage, danger, taboo survival
};

/**
 * Level Thresholds
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
  
  Object.entries(DARK_ROOM_REACTIONS).forEach(([reactionType, config]) => {
    const count = reactions[reactionType] || 0;
    totalXP += count * config.xp;
  });
  
  return Math.max(0, totalXP); // Never go below 0
}

/**
 * Distribute XP across Dark Room stats
 * @param {number} totalXP - Total engagement XP
 * @returns {Object} XP distribution by stat
 */
function distributeXP(totalXP) {
  return {
    shadow: Math.floor(totalXP * STAT_DISTRIBUTION.shadow),
    ghost: Math.floor(totalXP * STAT_DISTRIBUTION.ghost),
    rogue: Math.floor(totalXP * STAT_DISTRIBUTION.rogue)
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
 * Award Dark Room XP to post author based on reactions
 * @param {string} userId - User's MongoDB ObjectId
 * @param {Object} reactions - Reaction counts
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Updated stats and level changes
 */
export async function awardDarkRoomXP(userId, reactions, options = {}) {
  // Calculate total engagement XP
  const totalXP = calculateEngagementXP(reactions);
  
  if (totalXP <= 0) {
    return {
      totalXP: 0,
      distribution: { shadow: 0, ghost: 0, rogue: 0 },
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
      shadow: { xp: 0, level: 1, room: 'dark' },
      ghost: { xp: 0, level: 1, room: 'dark' },
      rogue: { xp: 0, level: 1, room: 'dark' }
    };
  }
  
  // Track level ups
  const levelUps = [];
  
  // Award XP to each stat
  ['shadow', 'ghost', 'rogue'].forEach(stat => {
    if (!user.stats[stat]) {
      user.stats[stat] = { xp: 0, level: 1, room: 'dark' };
    }
    
    const oldLevel = user.stats[stat].level;
    const oldXP = user.stats[stat].xp || 0;
    
    // Add XP
    user.stats[stat].xp = oldXP + xpDistribution[stat];
    
    // Calculate new level
    const newLevel = calculateLevel(user.stats[stat].xp);
    user.stats[stat].level = newLevel;
    user.stats[stat].room = 'dark';
    
    // Track level up
    if (newLevel > oldLevel) {
      levelUps.push({
        stat,
        oldLevel,
        newLevel,
        xpGained: xpDistribution[stat]
      });
      
      // Create notification (async, don't block)
      createLevelUpNotification(userId, 'dark', stat, oldLevel, newLevel, xpDistribution[stat])
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
      shadow: {
        xp: user.stats.shadow.xp,
        level: user.stats.shadow.level,
        nextLevelXP: getXPForNextLevel(user.stats.shadow.level)
      },
      ghost: {
        xp: user.stats.ghost.xp,
        level: user.stats.ghost.level,
        nextLevelXP: getXPForNextLevel(user.stats.ghost.level)
      },
      rogue: {
        xp: user.stats.rogue.xp,
        level: user.stats.rogue.level,
        nextLevelXP: getXPForNextLevel(user.stats.rogue.level)
      }
    }
  };
}

/**
 * Get Dark Room feedback message based on reaction type
 * @param {string} reactionType - Type of reaction
 * @returns {string} Feedback message
 */
export function getDarkRoomFeedback(reactionType) {
  const feedbackMessages = {
    iFeelYou: 'Someone felt this.',
    notGood: 'This was heavy.',
    youreNotAlone: 'You were witnessed.',
    sendingStrength: 'You endured.'
  };
  
  return feedbackMessages[reactionType] || 'You were seen.';
}

/**
 * Apply anti-abuse rules
 * @param {string} userId - User's MongoDB ObjectId
 * @param {Object} postData - Post data
 * @returns {Promise<number>} XP multiplier (0.0 to 1.0)
 */
export async function calculateXPMultiplier(userId, postData) {
  const { checkForAbuse } = await import('./antiabuse.service.js');
  
  const result = await checkForAbuse('dark', userId, postData);
  
  return result.xpMultiplier;
}

export default {
  awardDarkRoomXP,
  getDarkRoomFeedback,
  calculateXPMultiplier,
  DARK_ROOM_REACTIONS,
  STAT_DISTRIBUTION,
  LEVEL_THRESHOLDS
};
