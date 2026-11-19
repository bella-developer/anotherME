import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * Minimalistic Toast Notification
 * Dark aesthetic with minimal border, small font, hide button
 */
const Toast = ({ title, message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timerIn = setTimeout(() => setIsVisible(true), 10);

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timerIn);
      clearTimeout(timer);
    };
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
      className={`relative pointer-events-auto transition-all duration-200 ease-out ${
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
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '6px',
        }}
      >
        <div className="flex items-start gap-2.5 px-3 py-2.5">
          <div style={{ color: colors.icon, flexShrink: 0, marginTop: '2px' }}>
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            {title && (
              <p
                className="text-[#f5f5f5] font-medium leading-tight mb-0.5"
                style={{ fontSize: '12px' }}
              >
                {title}
              </p>
            )}
            {message && (
              <p
                className="text-[#9ca3af] leading-relaxed"
                style={{
                  fontSize: '11px',
                  fontWeight: '400',
                  lineHeight: '1.4',
                }}
              >
                {typeof message === 'string' ? message : JSON.stringify(message)}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-[#6b7280] hover:text-[#9ca3af] transition-colors flex-shrink-0 ml-1 mt-0.5"
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
