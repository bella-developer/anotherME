import { useEffect, useState } from 'react';
import useReducedMotion from '../hooks/useReducedMotion';

/**
 * Toast Component
 * Notification toast with slide-in animation
 * Requirements: 35.3 - Toast slide-in animations (400ms)
 * Requirements: 35.7 - Respect prefers-reduced-motion
 */
function Toast({ message, type = 'success', duration = 5000, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Trigger slide-in animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, prefersReducedMotion ? 0 : 400); // Skip animation delay if reduced motion
  };

  const typeStyles = {
    success: {
      bg: 'bg-success/10 border-success',
      icon: 'text-success',
      iconPath: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
    error: {
      bg: 'bg-error/10 border-error',
      icon: 'text-error',
      iconPath: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
    warning: {
      bg: 'bg-warning/10 border-warning',
      icon: 'text-warning',
      iconPath: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      ),
    },
  };

  const styles = typeStyles[type];

  return (
    <div
      className={`fixed top-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] transition-all ease-out ${
        prefersReducedMotion ? 'duration-0' : 'duration-400'
      } ${
        isVisible && !isExiting
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      }`}
      role="alert"
      aria-live="polite"
    >
      <div
        className={`${styles.bg} border rounded-lg shadow-lg p-4 flex items-start space-x-3`}
      >
        {/* Icon */}
        <div className={`flex-shrink-0 ${styles.icon}`}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {styles.iconPath}
          </svg>
        </div>

        {/* Message */}
        <div className="flex-1 text-text-primary text-sm">{message}</div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-text-secondary hover:text-text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-primary rounded"
          aria-label="Close notification"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Toast;
