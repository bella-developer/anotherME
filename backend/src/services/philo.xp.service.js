import User from '../models/User.model.js';
import { createLevelUpNotification } from './notification.service.js';

/**
 * Philo Room XP Service
 * Handles reaction-based XP calculation and stat distribution
 * 
 * Philo Room Philosophy:
 * - Rewards thinking well, not thinking loud
 * - Slow-burn dopamine curve
 * - Intellectual satisfaction over instant gratification
 * - Wisdom compounds, it does not spike
 */

/**
 * Philo Room Reaction Weights
 * Each reaction maps to cognitive signals
 */
const PHILO_ROOM_REACTIONS = {
  lamp: {
    meaning: 'Clear idea, sharp thought, "this makes sense"',
    xp: 6,
    statBias: 'wise'
  },
  spark: {
    meaning: 'Provoked thought, open questions, wonder',
    xp: 4,
    statBias: 'wise/godmode'
  },
  clap: {
    meaning: 'Deep agreement, emotional + intellectual alignment',
    xp: 8,
    statBias: 'soulLevel'
  }
};

/**
 * Philo Room Stat Distribution
 * XP flows toward understanding first, transcendence last
 */
const STAT_DISTRIBUTION = {
  wise: 0.45,       // Clarity, reasoning, articulation
  soulLevel: 0.35,  // Emotional truth, human meaning
  godmode: 0.20     // Synthesis, rare insight (grows slowly by design)
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
  
  Object.entries(PHILO_ROOM_REACTIONS).forEach(([reactionType, config]) => {
    const count = reactions[reactionType] || 0;
    totalXP += count * config.xp;
  });
  
  return Math.max(0, totalXP);
}

/**
 * Distribute XP across Philo Room stats
 * @param {number} totalXP - Total engagement XP
 * @returns {Object} XP distribution by stat
 */
function distributeXP(totalXP) {
  return {
    wise: Math.floor(totalXP * STAT_DISTRIBUTION.wise),
    soulLevel: Math.floor(totalXP * STAT_DISTRIBUTION.soulLevel),
    godmode: Math.floor(totalXP * STAT_DISTRIBUTION.godmode)
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
 * Award Philo Room XP to post author based on reactions
 * @param {string} userId - User's MongoDB ObjectId
 * @param {Object} reactions - Reaction counts
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Updated stats and level changes
 */
export async function awardPhiloRoomXP(userId, reactions, options = {}) {
  // Calculate total engagement XP
  const totalXP = calculateEngagementXP(reactions);
  
  if (totalXP <= 0) {
    return {
      totalXP: 0,
      distribution: { wise: 0, soulLevel: 0, godmode: 0 },
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
      wise: { xp: 0, level: 1, room: 'philo' },
      soulLevel: { xp: 0, level: 1, room: 'philo' },
      godmode: { xp: 0, level: 1, room: 'philo' }
    };
  }
  
  // Track level ups
  const levelUps = [];
  
  // Award XP to each stat
  ['wise', 'soulLevel', 'godmode'].forEach(stat => {
    if (!user.stats[stat]) {
      user.stats[stat] = { xp: 0, level: 1, room: 'philo' };
    }
    
    const oldLevel = user.stats[stat].level;
    const oldXP = user.stats[stat].xp || 0;
    
    // Add XP
    user.stats[stat].xp = oldXP + xpDistribution[stat];
    
    // Calculate new level
    const newLevel = calculateLevel(user.stats[stat].xp);
    user.stats[stat].level = newLevel;
    user.stats[stat].room = 'philo';
    
    // Track level up (quiet, no celebration)
    if (newLevel > oldLevel) {
      levelUps.push({
        stat,
        oldLevel,
        newLevel,
        xpGained: xpDistribution[stat]
      });
      
      // Create notification (async, don't block)
      createLevelUpNotification(userId, 'philo', stat, oldLevel, newLevel, xpDistribution[stat])
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
      wise: {
        xp: user.stats.wise.xp,
        level: user.stats.wise.level,
        nextLevelXP: getXPForNextLevel(user.stats.wise.level)
      },
      soulLevel: {
        xp: user.stats.soulLevel.xp,
        level: user.stats.soulLevel.level,
        nextLevelXP: getXPForNextLevel(user.stats.soulLevel.level)
      },
      godmode: {
        xp: user.stats.godmode.xp,
        level: user.stats.godmode.level,
        nextLevelXP: getXPForNextLevel(user.stats.godmode.level)
      }
    }
  };
}

/**
 * Get Philo Room feedback message based on reaction type
 * Calm, subtle affirmation
 * @param {string} reactionType - Type of reaction
 * @returns {string} Feedback message
 */
export function getPhiloRoomFeedback(reactionType) {
  const feedbackMessages = {
    lamp: 'That clarified something.',
    spark: 'This opened a question.',
    clap: 'This felt true.'
  };
  
  return feedbackMessages[reactionType] || 'This resonated.';
}

/**
 * Apply anti-gaming rules for Philo Room
 * Philo Room must resist shallow philosophy
 * @param {string} userId - User's MongoDB ObjectId
 * @param {Object} postData - Post data
 * @returns {Promise<number>} XP multiplier (0.0 to 1.0)
 */
export async function calculatePhiloXPMultiplier(userId, postData) {
  const { checkForAbuse } = await import('./antiabuse.service.js');
  
  const result = await checkForAbuse('philo', userId, postData);
  
  return result.xpMultiplier;
}

/**
 * Calculate time-based XP bonus for posts that age well
 * Wisdom compounds over time
 * @param {Date} postCreatedAt - Post creation date
 * @param {Object} reactions - Current reaction counts
 * @returns {number} Time bonus multiplier
 */
export function calculateTimeBonus(postCreatedAt, reactions) {
  const ageInDays = (Date.now() - postCreatedAt.getTime()) / (1000 * 60 * 60 * 24);
  
  // Posts that continue to get reactions over time get a bonus
  if (ageInDays > 7) {
    return 1.1; // 10% bonus for posts older than a week
  }
  
  if (ageInDays > 30) {
    return 1.25; // 25% bonus for posts older than a month
  }
  
  return 1.0; // No bonus for recent posts
}

export default {
  awardPhiloRoomXP,
  getPhiloRoomFeedback,
  calculatePhiloXPMultiplier,
  calculateTimeBonus,
  PHILO_ROOM_REACTIONS,
  STAT_DISTRIBUTION,
  LEVEL_THRESHOLDS
};
