import { useEffect, useState } from 'react';

/**
 * XP Notification Component
 * Displays floating +XP notification with animation
 */
function XPNotification({ xp, onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after animation completes
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-float-up">
      <div className="bg-gradient-to-r from-purple-600 to-purple-400 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <span className="text-xl">✨</span>
        <span className="font-bold text-lg">+{xp} XP</span>
      </div>
    </div>
  );
}

export default XPNotification;
