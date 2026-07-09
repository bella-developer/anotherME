import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * Minimalistic Toast Notification
 * Dark aesthetic with minimal border, small font, hide button
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
    }, 200);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-3.5 h-3.5" strokeWidth={2.5} />;
      case 'error':
        return <AlertCircle className="w-3.5 h-3.5" strokeWidth={2.5} />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2.5} />;
      default:
        return <Info className="w-3.5 h-3.5" strokeWidth={2.5} />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return { icon: '#22c55e' };
      case 'error':
        return { icon: '#ef4444' };
      case 'warning':
        return { icon: '#f59e0b' };
      default:
        return { icon: '#6b7280' };
    }
  };

  const colors = getColors();

  return (
    <div
      className={`fixed top-20 right-4 z-[9999] transition-all duration-200 ease-out ${
        isVisible && !isExiting
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-8'
      }`}
      style={{
        minWidth: '280px',
        maxWidth: '360px',
      }}
    >
      <div
        style={{
          background: '#0a0a0a',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '6px',
        }}
      >
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <div style={{ color: colors.icon, flexShrink: 0 }}>
            {getIcon()}
          </div>
          <p 
            className="text-[#e5e5e5] flex-1"
            style={{
              fontSize: '11px',
              fontWeight: '400',
              lineHeight: '1.4',
            }}
          >
            {message}
          </p>
          <button
            onClick={handleClose}
            className="text-[#6b7280] hover:text-[#9ca3af] transition-colors flex-shrink-0"
            title="Hide"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
