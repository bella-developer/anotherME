import { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';
import { selectAuth } from '../features/authSlice';
import useStatsMonitor from '../hooks/useStatsMonitor';
import NotificationManager from '../components/NotificationManager';

/**
 * Stats Context
 * Provides stats monitoring and notifications throughout the app
 */
const StatsContext = createContext(null);

export function StatsProvider({ children }) {
  const { isAuthenticated } = useSelector(selectAuth);

  // Monitor stats only when authenticated
  const {
    stats,
    xpNotifications,
    levelUpNotifications,
    dismissXpNotification,
    dismissLevelUpNotification
  } = useStatsMonitor({
    enabled: isAuthenticated,
    pollInterval: 30000 // Poll every 30 seconds
  });

  return (
    <StatsContext.Provider value={{ stats }}>
      {children}
      
      {/* Notification Manager */}
      {isAuthenticated && (
        <NotificationManager
          xpNotifications={xpNotifications}
          levelUpNotifications={levelUpNotifications}
          onDismissXp={dismissXpNotification}
          onDismissLevelUp={dismissLevelUpNotification}
        />
      )}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within StatsProvider');
  }
  return context;
}

export default StatsContext;
