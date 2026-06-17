import XPNotification from './XPNotification';
import LevelUpModal from './LevelUpModal';

/**
 * NotificationManager Component
 * Manages display of XP notifications and level-up modals
 * Handles stacking and auto-dismiss
 */
function NotificationManager({ 
  xpNotifications = [], 
  levelUpNotifications = [],
  onDismissXp,
  onDismissLevelUp
}) {
  return (
    <>
      {/* XP Notifications - Stack vertically */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {xpNotifications.map((notification, index) => (
          <XPNotification
            key={`xp-${index}-${notification.totalXp}`}
            xp={notification.xp}
            onComplete={() => onDismissXp(index)}
          />
        ))}
      </div>

      {/* Level-Up Modals - Show one at a time */}
      {levelUpNotifications.length > 0 && (
        <LevelUpModal
          stat={levelUpNotifications[0].stat}
          fromLevel={levelUpNotifications[0].fromLevel}
          toLevel={levelUpNotifications[0].toLevel}
          onClose={() => onDismissLevelUp(0)}
        />
      )}
    </>
  );
}

export default NotificationManager;
