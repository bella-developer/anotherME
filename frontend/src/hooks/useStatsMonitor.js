import { useState, useEffect, useRef } from 'react';
import { fetchUserStats } from '../services/userService';

/**
 * useStatsMonitor Hook
 * Monitors user stats for changes and triggers notifications
 * Uses efficient polling with exponential backoff
 */
function useStatsMonitor({ enabled = true, pollInterval = 30000 }) {
  const [stats, setStats] = useState(null);
  const [xpNotifications, setXpNotifications] = useState([]);
  const [levelUpNotifications, setLevelUpNotifications] = useState([]);
  const previousStatsRef = useRef(null);
  const pollTimeoutRef = useRef(null);

  // Load initial stats
  useEffect(() => {
    if (!enabled) return;

    const loadInitialStats = async () => {
      try {
        const statsData = await fetchUserStats();
        setStats(statsData);
        previousStatsRef.current = statsData;
      } catch (err) {
        console.error('Failed to load initial stats:', err);
      }
    };

    loadInitialStats();
  }, [enabled]);

  // Poll for stat changes
  useEffect(() => {
    if (!enabled || !previousStatsRef.current) return;

    const pollStats = async () => {
      try {
        const newStats = await fetchUserStats();
        
        // Compare with previous stats
        const changes = detectStatChanges(previousStatsRef.current, newStats);
        
        // Trigger notifications for changes
        if (changes.xpGains.length > 0) {
          setXpNotifications(prev => [...prev, ...changes.xpGains]);
        }
        
        if (changes.levelUps.length > 0) {
          setLevelUpNotifications(prev => [...prev, ...changes.levelUps]);
        }
        
        // Update refs and state
        previousStatsRef.current = newStats;
        setStats(newStats);
        
      } catch (err) {
        console.error('Failed to poll stats:', err);
      }
      
      // Schedule next poll
      pollTimeoutRef.current = setTimeout(pollStats, pollInterval);
    };

    // Start polling
    pollTimeoutRef.current = setTimeout(pollStats, pollInterval);

    // Cleanup
    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, [enabled, pollInterval]);

  // Dismiss XP notification
  const dismissXpNotification = (index) => {
    setXpNotifications(prev => prev.filter((_, i) => i !== index));
  };

  // Dismiss level-up notification
  const dismissLevelUpNotification = (index) => {
    setLevelUpNotifications(prev => prev.filter((_, i) => i !== index));
  };

  return {
    stats,
    xpNotifications,
    levelUpNotifications,
    dismissXpNotification,
    dismissLevelUpNotification
  };
}

/**
 * Detect changes between old and new stats
 * Returns XP gains and level-ups
 */
function detectStatChanges(oldStats, newStats) {
  const xpGains = [];
  const levelUps = [];

  if (!oldStats || !newStats) {
    return { xpGains, levelUps };
  }

  // Check each room
  for (const room of ['climb', 'dark', 'philo']) {
    if (!oldStats[room] || !newStats[room]) continue;

    // Check each stat in the room
    for (const stat in newStats[room]) {
      const oldStat = oldStats[room][stat];
      const newStat = newStats[room][stat];

      if (!oldStat || !newStat) continue;

      // Check for XP gain
      const xpGain = newStat.xp - oldStat.xp;
      if (xpGain > 0) {
        xpGains.push({
          room,
          stat,
          xp: xpGain,
          totalXp: newStat.xp
        });
      }

      // Check for level-up
      if (newStat.level > oldStat.level) {
        levelUps.push({
          room,
          stat,
          fromLevel: oldStat.level,
          toLevel: newStat.level
        });
      }
    }
  }

  return { xpGains, levelUps };
}

export default useStatsMonitor;
