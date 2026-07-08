import User from '../models/User.model.js';
import { awardDarkRoomXP } from './darkroom.xp.service.js';
import { awardPhiloRoomXP } from './philo.xp.service.js';
import { awardFantasyRoomXP } from './fantasy.xp.service.js';
import { createLevelUpNotification } from './notification.service.js';

/**
 * Gamification Service
 * Handles XP calculation, stat distribution, and level progression
 * Implements dopamine-driven engagement mechanics
 */

// Reaction weights for XP calculation
export const REACTION_WEIGHTS = {
  fantasy: {
    push: 2,      // ⬆️ Basic upvote
    pull: -1,     // ⬇️ Downvote
    gear: 5,      // ⚙️ Comments/engagement
    rocket: 10    // 🚀 Super-upvote/hype
  },
  dark: {
    // Dark Room uses special XP logic from darkroom.xp.service.js
    iFeelYou: 6,
    notGood: -1,
    youreNotAlone: 5,
    sendingStrength: 7
  },
  philo: {
    // Philo Room uses special XP logic from philo.xp.service.js
    lamp: 6,      // 💡 Insight
    spark: 4,     // ✨ Curiosity
    clap: 8       // 👏 Resonance
  }
};

// Stat distribution percentages by room
export const STAT_DISTRIBUTION = {
  fantasy: {
    genius: 0.50,  // 50% - Originality, innovation
    hustle: 0.30,  // 30% - Execution, effort
    legend: 0.20   // 20% - Impact, vision
  },
  dark: {
    // Dark Room uses special distribution: shadow 45%, ghost 35%, rogue 20%
    shadow: 0.45,  // 45% - Depth, hidden truth, inner weight
    ghost: 0.35,   // 35% - Vulnerability, emotional resonance
    rogue: 0.20    // 20% - Courage, danger, taboo survival
  },
  philo: {
    // Philo Room: slow-burn dopamine, intellectual satisfaction
    wise: 0.45,      // 45% - Clarity, reasoning, articulation
    soulLevel: 0.35, // 35% - Emotional truth, human meaning
    godmode: 0.20    // 20% - Synthesis, rare insight (grows slowly)
  }
};

// Level thresholds
export const LEVEL_THRESHOLDS = [
  { level: 1, min: 0, max: 100 },
  { level: 2, min: 101, max: 250 },
  { level: 3, min: 251, max: 500 },
  { level: 4, min: 501, max: 900 },
  { level: 5, min: 901, max: 1500 },
  { level: 6, min: 1501, max: 2500 },
  { level: 7, min: 2501, max: 4000 },
  { level: 8, min: 4001, max: 6000 },
  { level: 9, min: 6001, max: 9000 },
  { level: 10, min: 9001, max: Infinity }
];

/**
 * Calculate total XP from post reactions
 * @param {string} room - Room type (fantasy, dark, philo)
 * @param {Object} reactions - Reaction counts
 * @returns {number} Total XP earned
 */
export function calculateTotalXP(room, reactions) {
  const weights = REACTION_WEIGHTS[room];
  if (!weights) {
    throw new Error(`Invalid room type: ${room}`);
  }

  let totalXP = 0;

  // Map reaction types to weights
  const reactionMap = {
    fantasy: {
      push: reactions.push || 0,
      pull: reactions.pull || 0,
      gear: reactions.gear || 0,
      rocket: reactions.rocket || 0
    },
    dark: {
      resonate: reactions.resonate || 0,
      echo: reactions.echo || 0,
      amplify: reactions.amplify || 0
    },
    philo: {
      lamp: reactions.lamp || 0,
      spark: reactions.spark || 0,
      clap: reactions.clap || 0
    }
  };

  const roomReactions = reactionMap[room];
  
  // Calculate XP for each reaction type
  for (const [reactionType, count] of Object.entries(roomReactions)) {
    const weight = weights[reactionType];
    if (weight !== undefined) {
      totalXP += count * weight;
    }
  }

  // Ensure XP doesn't go negative
  return Math.max(0, totalXP);
}

/**
 * Distribute XP across room stats
 * @param {string} room - Room type (fantasy, dark, philo)
 * @param {number} totalXP - Total XP to distribute
 * @returns {Object} XP distribution per stat
 */
export function distributeXP(room, totalXP) {
  const distribution = STAT_DISTRIBUTION[room];
  if (!distribution) {
    throw new Error(`Invalid room type: ${room}`);
  }

  const result = {};
  for (const [stat, percentage] of Object.entries(distribution)) {
    result[stat] = Math.floor(totalXP * percentage);
  }

  return result;
}

/**
 * Calculate level from XP
 * @param {number} xp - Experience points
 * @returns {number} Current level (1-10)
 */
export function calculateLevel(xp) {
  for (const threshold of LEVEL_THRESHOLDS) {
    if (xp >= threshold.min && xp <= threshold.max) {
      return threshold.level;
    }
  }
  return 1; // Default to level 1
}

/**
 * Get XP progress to next level
 * @param {number} xp - Current XP
 * @returns {Object} Progress information
 */
export function getLevelProgress(xp) {
  const currentLevel = calculateLevel(xp);
  const currentThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel);
  const nextThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel + 1);

  if (!nextThreshold) {
    // Max level reached
    return {
      level: currentLevel,
      currentXP: xp,
      xpInLevel: xp - currentThreshold.min,
      xpToNextLevel: 0,
      xpForNextLevel: 0,
      progress: 1.0,
      isMaxLevel: true
    };
  }

  const xpInLevel = xp - currentThreshold.min;
  const xpForNextLevel = nextThreshold.min - currentThreshold.min;
  const progress = xpInLevel / xpForNextLevel;

  return {
    level: currentLevel,
    currentXP: xp,
    xpInLevel,
    xpToNextLevel: nextThreshold.min - xp,
    xpForNextLevel,
    progress: Math.min(1.0, progress),
    isMaxLevel: false
  };
}

/**
 * Award XP to user for post reactions
 * Recalculates total XP from current reaction counts and updates user stats
 * @param {string} userId - User's MongoDB ObjectId
 * @param {string} room - Room type (fantasy, dark, philo)
 * @param {Object} reactions - Current reaction counts
 * @returns {Promise<Object>} Updated stats and level info
 */
export async function awardXP(userId, room, reactions) {
  // Dark Room uses special XP logic
  if (room === 'dark') {
    return await awardDarkRoomXP(userId, reactions);
  }
  
  // Philo Room uses special XP logic
  if (room === 'philo') {
    return await awardPhiloRoomXP(userId, reactions);
  }
  
  // Fantasy Room uses special XP logic
  if (room === 'fantasy') {
    return await awardFantasyRoomXP(userId, reactions);
  }
  
  // Fallback to standard logic (should not reach here)
  throw new Error(`Unknown room type: ${room}`);
}

/**
 * Get user's stats with level information
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {Promise<Object>} User stats with levels
 */
export async function getUserStats(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Initialize stats if not present
  if (!user.stats) {
    return {
      fantasy: {
        genius: { xp: 0, level: 1, progress: getLevelProgress(0) },
        hustle: { xp: 0, level: 1, progress: getLevelProgress(0) },
        legend: { xp: 0, level: 1, progress: getLevelProgress(0) }
      },
      dark: {
        depth: { xp: 0, level: 1, progress: getLevelProgress(0) },
        mystery: { xp: 0, level: 1, progress: getLevelProgress(0) },
        wisdom: { xp: 0, level: 1, progress: getLevelProgress(0) }
      },
      philo: {
        logic: { xp: 0, level: 1, progress: getLevelProgress(0) },
        insight: { xp: 0, level: 1, progress: getLevelProgress(0) },
        impact: { xp: 0, level: 1, progress: getLevelProgress(0) }
      }
    };
  }

  // Build stats with level information
  const result = {};
  for (const [room, stats] of Object.entries(user.stats)) {
    result[room] = {};
    for (const [stat, xp] of Object.entries(stats)) {
      result[room][stat] = {
        xp,
        level: calculateLevel(xp),
        progress: getLevelProgress(xp)
      };
    }
  }

  return result;
}

/**
 * Get leaderboard for a specific room and stat
 * @param {string} room - Room type (fantasy, dark, philo)
 * @param {string} stat - Stat name
 * @param {number} limit - Number of users to return
 * @returns {Promise<Array>} Top users
 */
export async function getLeaderboard(room, stat, limit = 10) {
  const sortField = `stats.${room}.${stat}`;
  
  const users = await User.find({})
    .sort({ [sortField]: -1 })
    .limit(limit)
    .select('username stats')
    .lean();

  return users.map((user, index) => ({
    rank: index + 1,
    username: user.username,
    xp: user.stats?.[room]?.[stat] || 0,
    level: calculateLevel(user.stats?.[room]?.[stat] || 0)
  }));
}

