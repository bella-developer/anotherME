import Notification from '../models/Notification.model.js';

/**
 * Create a notification for a user
 * @param {string} userId - User's MongoDB ObjectId
 * @param {string} type - Notification type
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {Object} data - Additional data
 * @returns {Promise<Object>} Created notification
 */
export async function createNotification(userId, type, title, message, data = {}) {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      data,
      read: false
    });
    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
    throw error;
  }
}

/**
 * Create a reaction notification
 * @param {string} userId - Post author's user ID
 * @param {string} reactionType - Type of reaction
 * @param {string} postTitle - Post title
 * @param {string} room - Room name
 * @returns {Promise<Object>} Created notification
 */
export async function createReactionNotification(userId, reactionType, postTitle, room) {
  const reactionLabels = {
    // Dark Room
    iFeelYou: 'I feel you',
    notGood: 'Not good',
    youreNotAlone: "You're not alone",
    sendingStrength: 'Sending strength',
    // Philo Room
    lamp: '💡 Insight',
    spark: '✨ Curiosity',
    clap: '👏 Resonance',
    // Climb Room
    push: '⬆️ Push',
    pull: '⬇️ Pull',
    gear: '⚙️ Gear',
    rocket: '🚀 Rocket'
  };

  const label = reactionLabels[reactionType] || reactionType;
  const title = `New reaction on your post`;
  const message = `Someone reacted with "${label}" to your post${postTitle ? ` "${postTitle}"` : ''} in ${room} room`;

  return createNotification(userId, 'reaction', title, message, {
    reactionType,
    postTitle,
    room
  });
}

/**
 * Create a level-up notification
 * @param {string} userId - User ID
 * @param {string} room - Room name
 * @param {string} stat - Stat name
 * @param {number} oldLevel - Old level
 * @param {number} newLevel - New level
 * @param {number} xpGained - XP gained
 * @returns {Promise<Object>} Created notification
 */
export async function createLevelUpNotification(userId, room, stat, oldLevel, newLevel, xpGained) {
  const roomEmojis = {
    dark: '🌑',
    philo: '🦉',
    climb: '🚀'
  };

  const statLabels = {
    // Dark Room
    shadow: 'Shadow',
    ghost: 'Ghost',
    rogue: 'Rogue',
    // Philo Room
    wise: 'Wise',
    soulLevel: 'Soul-Level',
    godmode: 'Godmode',
    // Climb Room
    genius: 'Genius',
    hustle: 'Hustle',
    legend: 'Legend'
  };

  const emoji = roomEmojis[room] || '⭐';
  const statLabel = statLabels[stat] || stat;
  const title = `${emoji} Level Up!`;
  const message = `Your ${statLabel} stat reached Level ${newLevel} in ${room} room (+${xpGained} XP)`;

  return createNotification(userId, 'level_up', title, message, {
    room,
    stat,
    oldLevel,
    newLevel,
    xpGained
  });
}

/**
 * Get user's notifications
 * @param {string} userId - User's MongoDB ObjectId
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Array of notifications
 */
export async function getUserNotifications(userId, options = {}) {
  const {
    unreadOnly = false,
    limit = 50,
    skip = 0
  } = options;

  const query = { userId };
  if (unreadOnly) {
    query.read = false;
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  return notifications;
}

/**
 * Get unread notification count
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {Promise<number>} Count of unread notifications
 */
export async function getUnreadCount(userId) {
  return await Notification.countDocuments({ userId, read: false });
}

/**
 * Mark notification as read
 * @param {string} notificationId - Notification's MongoDB ObjectId
 * @param {string} userId - User's MongoDB ObjectId (for security)
 * @returns {Promise<Object>} Updated notification
 */
export async function markAsRead(notificationId, userId) {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true, readAt: new Date() },
    { new: true }
  );

  if (!notification) {
    const err = new Error('Notification not found');
    err.statusCode = 404;
    throw err;
  }

  return notification;
}

/**
 * Mark all notifications as read
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {Promise<Object>} Update result
 */
export async function markAllAsRead(userId) {
  const result = await Notification.updateMany(
    { userId, read: false },
    { read: true, readAt: new Date() }
  );

  return result;
}

/**
 * Delete a notification
 * @param {string} notificationId - Notification's MongoDB ObjectId
 * @param {string} userId - User's MongoDB ObjectId (for security)
 * @returns {Promise<void>}
 */
export async function deleteNotification(notificationId, userId) {
  const result = await Notification.deleteOne({ _id: notificationId, userId });

  if (result.deletedCount === 0) {
    const err = new Error('Notification not found');
    err.statusCode = 404;
    throw err;
  }
}
