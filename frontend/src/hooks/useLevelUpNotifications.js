import { useState, useCallback, useEffect } from 'react';

/**
 * useLevelUpNotifications Hook
 * Manages level-up notification queue and display
 */
export function useLevelUpNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);

  // Show next notification from queue
  useEffect(() => {
    if (!currentNotification && notifications.length > 0) {
      const [next, ...rest] = notifications;
      setCurrentNotification(next);
      setNotifications(rest);
    }
  }, [currentNotification, notifications]);

  // Add level-up to queue
  const addLevelUp = useCallback((room, levelUpData) => {
    if (!levelUpData || !levelUpData.levelUps || levelUpData.levelUps.length === 0) {
      return;
    }

    // Add each level-up to the queue
    const newNotifications = levelUpData.levelUps.map(levelUp => ({
      room,
      levelUp,
      id: `${room}-${levelUp.stat}-${Date.now()}-${Math.random()}`
    }));

    setNotifications(prev => [...prev, ...newNotifications]);
  }, []);

  // Close current notification
  const closeNotification = useCallback(() => {
    setCurrentNotification(null);
  }, []);

  return {
    currentNotification,
    addLevelUp,
    closeNotification,
    hasNotifications: notifications.length > 0 || currentNotification !== null
  };
}

export default useLevelUpNotifications;
