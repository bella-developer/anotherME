import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * Professional Toast Notification
 * Dark aesthetic with subtle glow, minimal borders, artistic design
 */
const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);

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
    }, 250);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4" strokeWidth={2.5} />;
      case 'error':
        return <AlertCircle className="w-4 h-4" strokeWidth={2.5} />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" strokeWidth={2.5} />;
      default:
        return <Info className="w-4 h-4" strokeWidth={2.5} />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          icon: '#22c55e',
          glow: 'rgba(34, 197, 94, 0.15)',
        };
      case 'error':
        return {
          icon: '#ef4444',
          glow: 'rgba(239, 68, 68, 0.15)',
        };
      case 'warning':
        return {
          icon: '#f59e0b',
          glow: 'rgba(245, 158, 11, 0.15)',
        };
      default:
        return {
          icon: '#2EE6FF',
          glow: 'rgba(46, 230, 255, 0.15)',
        };
    }
  };

  const colors = getColors();

  return (
    <div
      className={`fixed top-20 right-4 z-[9999] transition-all duration-250 ease-out ${
        isVisible && !isExiting
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-8'
      }`}
      style={{
        minWidth: '300px',
        maxWidth: '400px',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.98) 0%, rgba(8, 8, 8, 0.98) 100%)',
          backdropFilter: 'blur(12px)',
          boxShadow: `0 0 40px ${colors.glow}, 0 0 1px rgba(255, 255, 255, 0.06)`,
          border: '1px solid rgba(255, 255, 255, 0.04)',
          borderRadius: '8px',
        }}
      >
        <div className="flex items-start gap-3 px-4 py-3.5">
          <div style={{ color: colors.icon, flexShrink: 0, marginTop: '1px' }}>
            {getIcon()}
          </div>
          <p 
            className="text-[#e5e5e5] flex-1 leading-relaxed"
            style={{
              fontSize: '13px',
              fontWeight: '400',
              letterSpacing: '0.01em',
            }}
          >
            {message}
          </p>
          <button
            onClick={handleClose}
            className="text-[#6b7280] hover:text-[#9ca3af] transition-colors flex-shrink-0"
            style={{ marginTop: '1px' }}
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
